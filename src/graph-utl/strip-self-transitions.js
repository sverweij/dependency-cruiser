module.exports = function stripSelfTransitions(pModule) {
  return {
    ...pModule,
    dependencies: pModule.dependencies.filter(
      (pDependency) => pModule.source !== pDependency.resolved
    ),
  };
};
