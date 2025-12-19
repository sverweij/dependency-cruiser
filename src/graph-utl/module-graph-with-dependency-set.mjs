export default class ModuleGraphWithDependencySet {
  /** @type {Array<{source: string, dependencies: Set<string>}>} */
  #modulesWithDependencySet;
  /**
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
   * @param {import("../../types/dependency-cruiser.mjs").IModule} pModule
   * @returns {boolean}
   */
  moduleHasDependents(pModule) {
    return this.#modulesWithDependencySet.some(({ dependencies }) =>
      dependencies.has(pModule.source),
    );
  }

  /**
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
