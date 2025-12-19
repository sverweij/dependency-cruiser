/**
 *
 * @param {import("../../../../types/dependency-cruiser.mjs").IModule} pModules
 * @param {import("#graph-utl/module-graph-with-dependency-set.mjs").default} pModulesWithDependencySet
 * @returns {boolean}
 */
export default function isOrphan(pModule, pModulesWithDependencySet) {
  if (pModule.dependencies.length > 0) {
    return false;
  }

  // when dependents already calculated take those
  if (pModule.dependents) {
    return pModule.dependents.length === 0;
  }
  // ... otherwise calculate them
  return !pModulesWithDependencySet.moduleHasDependents(pModule);
}
