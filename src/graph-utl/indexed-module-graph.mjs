/* eslint-disable security/detect-object-injection */
export default class IndexedModuleGraph {
  init(pModules, pIndexAttribute) {
    this.indexedGraph = new Map(
      pModules.map((pModule) => [pModule[pIndexAttribute], pModule])
    );
  }

  constructor(pModules, pIndexAttribute = "source") {
    this.init(pModules, pIndexAttribute);
  }

  /**
   * @param {string} pName
   * @return {import("..").IModule}
   */
  findModuleByName(pName) {
    return this.indexedGraph.get(pName);
  }

  /**
   *
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
    pVisited = new Set()
  ) {
    /** @type {string[]} */
    let lReturnValue = [];
    const lModule = this.findModuleByName(pName);

    if (lModule && (!pMaxDepth || pDepth <= pMaxDepth)) {
      let lDependents = lModule.dependents || [];
      const lVisited = pVisited.add(pName);

      if (lDependents.length > 0) {
        lDependents
          .filter((pDependent) => !lVisited.has(pDependent))
          .forEach((pDependent) =>
            this.findTransitiveDependents(
              pDependent,
              pMaxDepth,
              pDepth + 1,
              lVisited
            )
          );
      }
      lReturnValue = Array.from(lVisited);
    }
    return lReturnValue;
  }

  /**
   *
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
    pVisited = new Set()
  ) {
    /** @type {string[]} */
    let lReturnValue = [];
    const lModule = this.findModuleByName(pName);

    if (lModule && (!pMaxDepth || pDepth <= pMaxDepth)) {
      let lDependencies = lModule.dependencies;
      const lVisited = pVisited.add(pName);

      if (lDependencies.length > 0) {
        lDependencies
          .map(({ resolved }) => resolved)
          .filter((pDependency) => !lVisited.has(pDependency))
          .forEach((pDependency) =>
            this.findTransitiveDependencies(
              pDependency,
              pMaxDepth,
              pDepth + 1,
              lVisited
            )
          );
      }
      lReturnValue = Array.from(lVisited);
    }
    return lReturnValue;
  }

  /**
   * @param {string} pFrom
   * @param {string} pTo
   * @param {Set<string>} pVisited
   * @returns {string[]}
   */
  getPath(pFrom, pTo, pVisited = new Set()) {
    let lReturnValue = [];
    const lFromNode = this.findModuleByName(pFrom);

    pVisited.add(pFrom);

    if (lFromNode) {
      const lDirectUnvisitedDependencies = lFromNode.dependencies
        .filter((pDependency) => !pVisited.has(pDependency.resolved))
        .map((pDependency) => pDependency.resolved);
      if (lDirectUnvisitedDependencies.includes(pTo)) {
        lReturnValue = [pFrom, pTo];
      } else {
        for (const lFrom of lDirectUnvisitedDependencies) {
          let lCandidatePath = this.getPath(lFrom, pTo, pVisited);
          // eslint-disable-next-line max-depth
          if (lCandidatePath.length > 0) {
            lReturnValue = [pFrom].concat(lCandidatePath);
            break;
          }
        }
      }
    }
    return lReturnValue;
  }

  /**
   * Returns the first non-zero length path from pInitialSource to pInitialSource
   * Returns the empty array if there is no such path
   *
   * @param {string} pInitialSource The 'source' attribute of the node to be tested
   *                                (source uniquely identifying a node)
   * @param {string} pCurrentSource The 'source' attribute of the 'to' node to
   *                                be traversed
   * @param {string} pDependencyName The attribute name of the dependency to use.
   *                                defaults to "resolved" (which is in use for
   *                                modules). For folders pass "name"
   * @return {string[]}             see description above
   */
  getCycle(pInitialSource, pCurrentSource, pDependencyName, pVisited) {
    let lVisited = pVisited || new Set();
    const lCurrentNode = this.findModuleByName(pCurrentSource);
    const lDependencies = lCurrentNode.dependencies.filter(
      (pDependency) => !lVisited.has(pDependency[pDependencyName])
    );
    const lMatch = lDependencies.find(
      (pDependency) => pDependency[pDependencyName] === pInitialSource
    );
    if (lMatch) {
      return [pCurrentSource, lMatch[pDependencyName]];
    }
    return lDependencies.reduce((pAll, pDependency) => {
      if (!pAll.includes(pCurrentSource)) {
        const lCycle = this.getCycle(
          pInitialSource,
          pDependency[pDependencyName],
          pDependencyName,
          lVisited.add(pDependency[pDependencyName])
        );

        if (lCycle.length > 0 && !lCycle.includes(pCurrentSource)) {
          return pAll.concat(pCurrentSource).concat(lCycle);
        }
      }
      return pAll;
    }, []);
  }
}
