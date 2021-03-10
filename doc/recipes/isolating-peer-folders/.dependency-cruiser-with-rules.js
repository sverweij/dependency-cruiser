const options = require("./.dependency-cruiser-options-only");

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "not-into-features",
      comment:
        "Code outside of features should not depend on features, except app",
      severity: "error",
      from: { pathNot: ["^features", "^app"] },
      to: { path: "^features" },
    },
    {
      name: "features-not-to-features",
      comment:
        "One feature should not depend on another feature (in a separate folder)",
      severity: "error",
      from: { path: "(^features/)([^/]+)/" },
      to: { path: "^$1", pathNot: "$1$2" },
    },
  ],
  ...options,
};
