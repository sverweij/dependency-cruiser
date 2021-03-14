const options = require("./.dependency-cruiser-options-only");

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "no-unshared-utl",
      severity: "error",
      from: {},
      module: {
        path: "^do-things/",
        numberOfDependentsLessThan: 1,
      },
    },
  ],
  ...options,
};
