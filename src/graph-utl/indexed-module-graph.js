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
   * @param {import("../types/cruise-result").IModule[]} pModules
   * @param {string} pName
   * @param {Set<string>} pVisited
   * @returns {Array<string>}
   */
  findTransitiveDependents(pName, pVisited = new Set()) {
    /** @type {string[]} */
    let lReturnValue = [];
    const lModule = this.findModuleByName(pName);

    if (lModule) {
      let lDependents = lModule.dependents || [];
      const lVisited = pVisited.add(pName);

      if (lDependents.length > 0) {
        lDependents
          .filter((pDependent) => !lVisited.has(pDependent))
          .forEach((pDependent) =>
            this.findTransitiveDependents(pDependent, lVisited)
          );
      }
      lReturnValue = Array.from(lVisited);
    }
    return lReturnValue;
  }
};
