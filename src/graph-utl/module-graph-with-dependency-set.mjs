export default class ModuleGraphWithDependencySet {
  /** @type {Array<{source: string, dependencies: Set<string>}>} */
  #modulesWithDependencySet;
  /**
   * Creates Module graph optimized for querying dependents
   * @constructor
   * @param {import("../../types/dependency-cruiser.mjs").IModule[]} pModules
   */
  constructor(pModules) {
    this.#modulesWithDependencySet = pModules.map((pModule) => ({
      source: pModule.source,
      dependencies: new Set(
        pModule.dependencies.map((pDependency) => pDependency.resolved),
      ),
    }));
  }

  /**
   * Returns true if the given module has dependents in the graph, false otherwise
   *
   * @param {import("../../types/dependency-cruiser.mjs").IModule} pModule
   * @returns {boolean}
   */
  moduleHasDependents(pModule) {
    return this.#modulesWithDependencySet.some(({ dependencies }) =>
      dependencies.has(pModule.source),
    );
  }

  /**
   * Returns an array of module source paths that depend on the given module
   *
   * @param {import("../../types/dependency-cruiser.mjs").IModule} pModule
   * @returns {Array<string>}
   */
  getDependents(pModule) {
    return this.#modulesWithDependencySet
      .filter(({ dependencies }) => dependencies.has(pModule.source))
      .map(({ source }) => source);
  }
}
