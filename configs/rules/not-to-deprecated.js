module.exports = {
  name: "not-to-deprecated",
  comment:
    "This module uses a (version of an) npm module that has been deprecated. Either " +
    "upgrade to a later version of that module, or find an alternative. Deprecated " +
    "modules are a security risk.",
  severity: "warn",
  from: {},
  to: {
    dependencyTypes: ["deprecated"],
  },
};
