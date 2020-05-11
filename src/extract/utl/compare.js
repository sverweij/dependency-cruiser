function dependenciesEqual(pLeftDependency) {
  // As we're using this to compare (typescript) pre-compilation dependencies
  // with post-compilation dependencies we donot consider the moduleSystem.
  //
  // In typescript the module system will typically be es6. Compiled down to
  // javascript it can be es6, but also cjs (depends on the `module` setting
  // in your tsconfig). In the latter case, we're still looking at the same
  // dependency even though the module systems differ.
  return (pRightDependency) =>
    pLeftDependency.module === pRightDependency.module &&
    pLeftDependency.dynamic === pRightDependency.dynamic &&
    pLeftDependency.exoticRequire === pRightDependency.exoticRequire;
}

module.exports = {
  dependenciesEqual,
};
