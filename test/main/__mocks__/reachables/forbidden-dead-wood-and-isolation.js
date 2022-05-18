module.exports = {
  extends: "./dependency-cruiser-options.js",
  forbidden: [
    {
      name: "no-unreachable-from-root",
      comment:
        "Dead wood check: If a module isn't reachable from the root index, it's probably unused (=> candidate for removal)",
      severity: "info",
      from: {
        path: "^src/index\\.js$",
      },
      to: {
        path: "^src",
        reachable: false,
      },
    },
    {
      name: "no-db-access-from-schemas",
      comment:
        "Isolation check: we don't want schema definitions to be connected to db access code",
      severity: "warn",
      from: {
        path: "^src/schema-declarations",
      },
      to: {
        path: "^src/db",
        reachable: true,
      },
    },
  ],
};
