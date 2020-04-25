module.exports = {
  name: "no-deprecated-core",
  comment:
    "This module depends on a node core module that has been deprecated. Find an " +
    "alternative - these are bound to exist - node doesn't deprecate lightly.",
  severity: "error",
  from: {},
  to: {
    dependencyTypes: ["core"],
    path: "^(punycode|domain|constants|sys|_linklist|_stream_wrap)$",
  },
};
