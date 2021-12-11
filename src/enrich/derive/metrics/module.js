// const { findModuleByName, clearCache } = require("../utl");
const { metricsAreCalculable } = require("./module-utl");

module.exports = function deriveModuleMetrics(pModules, pOptions) {
  if (pOptions.metrics) {
    return pModules.map((pModule) => ({
      ...pModule,
      ...(metricsAreCalculable(pModule)
        ? {
            instability:
              pModule.dependencies.length /
                (pModule.dependents.length + pModule.dependencies.length) || 0,
          }
        : {}),
    }));
    // clearCache();
    // return lModules.map((pModule) => ({
    //   ...pModule,
    //   dependencies: pModule.dependencies.map((pDependency) => ({
    //     ...pDependency,
    //     instability:
    //       (findModuleByName(lModules, pDependency.resolved) || {})
    //         .instability || 0,
    //   })),
    // }));
  }
  return pModules;
};
