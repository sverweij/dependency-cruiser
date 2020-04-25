module.exports = {
  extends: "./dependency-cruiser-options.js",
  allowedSeverity: "info",
  allowed: [
    {
      // isolation check: no-db-access-from-schemas
      from: {
        path: "^src/schema-declarations",
      },
      to: {
        path: "^src/db",
        reachable: false,
      },
    },
    {
      // the rest is ok
      from: {
        pathNot: "^src/schema-declarations",
      },
      to: {
        pathNot: "^src/db",
        reachable: true,
      },
    },
  ],
};
