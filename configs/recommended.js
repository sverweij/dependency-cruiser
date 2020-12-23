const noCircular = require("./rules/no-circular");
const noDeprecatedCore = require("./rules/no-deprecated-core");
const noDuplicateDependencyTypes = require("./rules/no-duplicate-dependency-types");
const noNonPackageJson = require("./rules/no-non-package-json");
const noOrphans = require("./rules/no-orphans");
const notToDeprecated = require("./rules/not-to-deprecated");
const notToUnresolvable = require("./rules/not-to-unresolvable");

module.exports = {
  forbidden: [
    noOrphans,
    noCircular,
    noDeprecatedCore,
    noDuplicateDependencyTypes,
    noNonPackageJson,
    notToDeprecated,
    notToUnresolvable,
  ],
  options: {
    doNotFollow: {
      path: "node_modules",
      dependencyTypes: [
        "npm",
        "npm-dev",
        "npm-optional",
        "npm-peer",
        "npm-bundled",
        "npm-no-pkg",
      ],
    },
  },
};
