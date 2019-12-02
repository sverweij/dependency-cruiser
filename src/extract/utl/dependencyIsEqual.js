module.exports = pLeftDependency => pRightDependency =>
  pLeftDependency.module === pRightDependency.module &&
  pLeftDependency.moduleSystem === pRightDependency.moduleSystem &&
  pLeftDependency.dynamic === pRightDependency.dynamic &&
  pLeftDependency.exoticRequire === pRightDependency.exoticRequire;
