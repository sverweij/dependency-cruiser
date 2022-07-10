module.exports = {
  name: "no-duplicate-dep-types",
  comment:
    "Likely this module depends on an external ('npm') package that occurs more " +
    "than once in your package.json i.e. bot as a devDependencies and in dependencies. " +
    "This will cause maintenance problems later on. If it's intentional, you can " +
    "disable this rule by adding this override as a rule in the 'forbidden' section " +
    "of your dependency-cruiser configuration: " +
    '{"name": "no-duplicate-dep-types", "severity": "ignore"}',
  severity: "warn",
  from: {},
  to: {
    moreThanOneDependencyType: true,
    // as it's pretty common to have a type import be a type only import
    // _and_ (e.g.) a devDependency - don't consider type-only dependency
    // types for this rule
    dependencyTypesNot: ["type-only"],
  },
};
