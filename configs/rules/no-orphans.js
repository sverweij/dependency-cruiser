module.exports = {
  name: "no-orphans",
  comment:
    "This is an orphan module - it's likely not used (anymore?). Either use it or " +
    "remove it. If it's logical this module is an orphan (i.e. it's a config file), " +
    "add an exception for it in your dependency-cruiser configuration.",
  severity: "warn",
  from: {
    orphan: true,
    pathNot: "\\.d\\.ts$"
  },
  to: {}
};
