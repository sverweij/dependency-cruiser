module.exports = {
  name: "no-non-package-json",
  severity: "error",
  comment:
    "This module depends on an npm package that isn't in the 'dependencies' section " +
    "of your package.json. That's problematic as the package either (1) won't be " +
    "available on live (2 - worse) will be available on live with an non-guaranteed " +
    "version. Fix it by adding the package to the dependencies in your package.json.",
  from: {},
  to: {
    dependencyTypes: ["npm-no-pkg", "npm-unknown"],
  },
};
