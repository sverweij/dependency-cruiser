module.exports = class IndexedModuleGraph {
  init(pModules) {
    this.indexedGraph = new Map(
      pModules.map((pModule) => [pModule.source, pModule])
    );
  }

  constructor(pModules) {
    this.init(pModules);
  }

  /**
   *
   * @param {string} pName
   * @return {import("../types/cruise-result").IModule}
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
};
