/** @type {import('../../../types/strict-options').IStrictCruiseOptions} */
export default {
  validate: false,
  maxDepth: 0,
  moduleSystems: ["es6", "cjs", "tsd", "amd"],
  tsPreCompilationDeps: false,
  preserveSymlinks: false,
  combinedDependencies: false,
  externalModuleResolutionStrategy: "node_modules",
  exoticRequireStrings: [],
};
