module.exports = {
  name: "no-duplicate-dep-types",
  comment:
    "Likley this module depends on an external ('npm') package that occurs more " +
    "than once in your package.json i.e. bot as a devDependencies and in dependencies. " +
    "This will cause maintenance problems later on. If it's intentional, you can " +
    "disable this rule by adding this override as a rule in the 'forbidden' section " +
    "of your dependency-cruiser configuration: " +
    '{"name": "no-duplicate-dep-types", "severity": "ignore"}',
  severity: "warn",
  from: {},
  to: {
    moreThanOneDependencyType: true,
  },
};
