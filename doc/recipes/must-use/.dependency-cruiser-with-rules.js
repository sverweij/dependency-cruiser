const options = require("./.dependency-cruiser-options-only");

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  required: [
    {
      name: "must-inherit-from-base-controller",
      severity: "error",
      module: {
        path: "controller\\.ts$",
        pathNot: "base-controller\\.ts$",
      },
      to: {
        path: "base-controller\\.ts$",
      },
    },
  ],
  ...options,
};
