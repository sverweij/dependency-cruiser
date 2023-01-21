module.exports = class IndexedModuleGraph {
  init(pModules, pIndexAttribute) {
    this.indexedGraph = new Map(
      // eslint-disable-next-line security/detect-object-injection
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
};
