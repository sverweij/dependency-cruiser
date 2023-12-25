// @ts-check
/* eslint-disable security/detect-object-injection */
/**
 * @typedef {import("../../types/cruise-result.d.mts").IFolderDependency} IFolderDependency
 * @typedef {import("../../types/cruise-result.d.mts").IDependency} IDependency
 * @typedef {import("../../types/cruise-result.d.mts").IFolder} IFolder
 * @typedef {import("../../types/cruise-result.d.mts").IModule} IModule
 * @typedef {import("../../types/shared-types.d.mts").DependencyType} DependencyType
 * @typedef {import("../../types/shared-types.d.mjs").IMiniDependency} IMiniDependency
 *
 * @typedef {(IDependency|IFolderDependency) & {name:string; dependencyTypes?: DependencyType[]}} IEdge
 * @typedef {IModule|IFolder} IModuleOrFolder
 * @typedef {IModuleOrFolder & {dependencies: IEdge[]}} IVertex
 */

export default class IndexedModuleGraph {
  /**
   * @param {IModuleOrFolder} pModule
   * @returns {IVertex}
   */
  #normalizeModule(pModule) {
    return {
      ...pModule,
      dependencies: (pModule?.dependencies ?? []).map((pDependency) => ({
        ...pDependency,
        name: pDependency.name ? pDependency.name : pDependency.resolved,
      })),
    };
  }

  #init(pModules, pIndexAttribute) {
    this.indexedGraph = new Map(
      pModules.map((pModule) => [
        pModule[pIndexAttribute],
        this.#normalizeModule(pModule),
      ]),
    );
  }

  /**
   * @param {import("../../types/dependency-cruiser.mjs").IModule[]} pModules
   * @param {string} pIndexAttribute
   */
  constructor(pModules, pIndexAttribute = "source") {
    this.#init(pModules, pIndexAttribute);
  }

  /**
   * @param {string} pName
   * @return {IVertex}
   */
  findVertexByName(pName) {
    // @ts-expect-error tsc seems to think indexedGraph can be undefined. However,
    // in the constructor it's always set to a Map, and the init method is private
    return this.indexedGraph.get(pName);
  }

  /**
   * @param {string} pName - the name of the module to find transitive dependents of.
   * @param {number} pMaxDepth - the maximum depth to search for dependents.
   *                  Defaults to 0 (no maximum). To only get direct dependents.
   *                  specify 1. To get dependents of these dependents as well
   *                  specify 2 - etc.
   * @param {number} pDepth - technical parameter - best to leave out of direct calls
   * @param {Set<string>} pVisited - technical parameter - best to leave out of direct calls
   * @returns {Array<string>}
   */
  findTransitiveDependents(
    pName,
    pMaxDepth = 0,
    pDepth = 0,
    pVisited = new Set(),
  ) {
    /** @type {string[]} */
    let lReturnValue = [];
    const lModule = this.findVertexByName(pName);

    if (lModule && (!pMaxDepth || pDepth <= pMaxDepth)) {
      let lDependents = lModule.dependents || [];
      const lVisited = pVisited.add(pName);

      // @TODO this works for modules, but not for folders yet
      if (lDependents.length > 0) {
        lDependents
          .filter((pDependent) => !lVisited.has(pDependent))
          .forEach((pDependent) =>
            this.findTransitiveDependents(
              pDependent,
              pMaxDepth,
              pDepth + 1,
              lVisited,
            ),
          );
      }
      lReturnValue = Array.from(lVisited);
    }
    return lReturnValue;
  }

  /**
   * @param {string} pName - the name of the module to find transitive dependencies of.
   * @param {number} pMaxDepth - the maximum depth to search for dependencies
   *                  Defaults to 0 (no maximum). To only get direct dependencies.
   *                  specify 1. To get dependencies of these dependencies as well
   *                  specify 2 - etc.
   * @param {number} pDepth - technical parameter - best to leave out of direct calls
   * @param {Set<string>} pVisited - technical parameter - best to leave out of direct calls
   * @returns {Array<string>}
   */
  findTransitiveDependencies(
    pName,
    pMaxDepth = 0,
    pDepth = 0,
    pVisited = new Set(),
  ) {
    /** @type {string[]} */
    let lReturnValue = [];
    const lModule = this.findVertexByName(pName);

    if (lModule && (!pMaxDepth || pDepth <= pMaxDepth)) {
      let lDependencies = lModule.dependencies;
      const lVisited = pVisited.add(pName);

      if (lDependencies.length > 0) {
        lDependencies
          .map(({ name }) => name)
          .filter((pDependency) => !lVisited.has(pDependency))
          .forEach((pDependency) =>
            this.findTransitiveDependencies(
              pDependency,
              pMaxDepth,
              pDepth + 1,
              lVisited,
            ),
          );
      }
      lReturnValue = Array.from(lVisited);
    }
    return lReturnValue;
  }

  /**
   *
   * @param {IEdge} pEdge
   * @returns {IMiniDependency}
   */
  #geldEdge(pEdge) {
    let lReturnValue = {};
    lReturnValue.name = pEdge.name;
    lReturnValue.dependencyTypes = pEdge.dependencyTypes
      ? pEdge.dependencyTypes
      : [];
    return lReturnValue;
  }

  /**
   * @param {string} pFrom
   * @param {string} pTo
   * @param {Set<string>} pVisited
   * @returns {Array<IMiniDependency>}
   */
  getPath(pFrom, pTo, pVisited = new Set()) {
    const lFromNode = this.findVertexByName(pFrom);

    pVisited.add(pFrom);

    if (!lFromNode) {
      return [];
    }

    const lDirectUnvisitedDependencies = lFromNode.dependencies
      .filter((pDependency) => !pVisited.has(pDependency.name))
      .map(this.#geldEdge);
    const lFoundDependency = lDirectUnvisitedDependencies.find(
      (pDependency) => pDependency.name === pTo,
    );

    if (lFoundDependency) {
      return [lFoundDependency];
    }

    for (const lNewFrom of lDirectUnvisitedDependencies) {
      let lCandidatePath = this.getPath(lNewFrom.name, pTo, pVisited);

      if (lCandidatePath.length > 0) {
        return [lNewFrom].concat(lCandidatePath);
      }
    }
    return [];
  }

  /**
   * Returns the first non-zero length path from pInitialSource to pInitialSource
   * Returns the empty array if there is no such path
   *
   * @param {string} pInitialSource The 'source' attribute of the node to be tested
   *                                (source uniquely identifying a node)
   * @param {IEdge} pCurrentDependency
   *                                The 'to' node to be traversed as a dependency
   *                                object of the previous 'from' traversed
   * @param {Set<string>=} pVisited  Technical parameter - best to leave out of direct calls
   * @return {Array<IMiniDependency>}             see description above
   */
  #getCycleNew(pInitialSource, pCurrentDependency, pVisited) {
    let lVisited = pVisited || new Set();
    const lCurrentVertex = this.findVertexByName(pCurrentDependency.name);
    const lEdges = lCurrentVertex.dependencies.filter(
      (pDependency) => !lVisited.has(pDependency.name),
    );
    const lInitialAsDependency = lEdges.find(
      (pDependency) => pDependency.name === pInitialSource,
    );
    if (lInitialAsDependency) {
      return pInitialSource === pCurrentDependency.name
        ? [this.#geldEdge(lInitialAsDependency)]
        : [
            this.#geldEdge(pCurrentDependency),
            this.#geldEdge(lInitialAsDependency),
          ];
    }
    return lEdges.reduce(
      /**
       * @param {Array<IMiniDependency>} pAll
       * @param {IEdge} pDependency
       * @returns {Array<IMiniDependency>}
       */
      (pAll, pDependency) => {
        if (!pAll.some((pSome) => pSome.name === pCurrentDependency.name)) {
          const lCycle = this.#getCycleNew(
            pInitialSource,
            pDependency,
            lVisited.add(pDependency.name),
          );

          if (
            lCycle.length > 0 &&
            !lCycle.some((pSome) => pSome.name === pCurrentDependency.name)
          ) {
            return pAll
              .concat(this.#geldEdge(pCurrentDependency))
              .concat(lCycle);
          }
        }
        return pAll;
      },
      [],
    );
  }

  /**
   * Returns the first non-zero length path from pInitialSource to pInitialSource
   * Returns the empty array if there is no such path
   *
   * @param {string} pInitialSource The 'source' attribute of the node to be tested
   *                                (source uniquely identifying a node)
   * @param {string} pCurrentSource The 'source' attribute of the 'to' node to
   *                                be traversed
   * @return {Array<IMiniDependency>}   see description above
   */
  getCycle(pInitialSource, pCurrentSource) {
    const lInitialNode = this.findVertexByName(pInitialSource);
    const lCurrentDependency = lInitialNode.dependencies.find(
      (pDependency) => pDependency.name === pCurrentSource,
    );

    if (!lCurrentDependency) {
      return [];
    }
    return this.#getCycleNew(pInitialSource, lCurrentDependency);
  }
}
