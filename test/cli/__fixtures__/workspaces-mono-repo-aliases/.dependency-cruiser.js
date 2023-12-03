/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  options: {
    doNotFollow: {
      path: "node_modules",
    },
    moduleSystems: ["es6", "cjs"],
    tsPreCompilationDeps: true,
    combinedDependencies: true,
    preserveSymlinks: false,
    tsConfig: {
      fileName: "tsconfig.json",
    },
    cache: false,
  },
};
