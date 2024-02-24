const noCircular = require("./rules/no-circular.cjs");
const noDeprecatedCore = require("./rules/no-deprecated-core.cjs");
const noDuplicateDependencyTypes = require("./rules/no-duplicate-dependency-types.cjs");
const noNonPackageJson = require("./rules/no-non-package-json.cjs");
const noOrphans = require("./rules/no-orphans.cjs");
const notToDeprecated = require("./rules/not-to-deprecated.cjs");
const notToUnresolvable = require("./rules/not-to-unresolvable.cjs");

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
