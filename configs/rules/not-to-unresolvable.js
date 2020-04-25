module.exports = {
  name: "not-to-unresolvable",
  comment:
    "This module depends on a module that cannot be found ('resolved to disk'). " +
    "If it's an npm module: add it to your package.json. In all other cases you " +
    "likely already know what to do.",
  severity: "error",
  from: {},
  to: {
    couldNotResolve: true,
  },
};
