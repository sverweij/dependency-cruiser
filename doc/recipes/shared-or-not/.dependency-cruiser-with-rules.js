const options = require("./.dependency-cruiser-options-only");

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "no-unshared-utl",
      severity: "error",
      from: {
        path: "^features/",
      },
      module: {
        path: "^common/",
        numberOfDependentsLessThan: 2,
      },
    },
  ],
  ...options,
};
