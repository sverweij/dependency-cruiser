module.exports = {
  name: "no-circular",
  comment:
    "This dependency is part of a circular relationship. You might want to revise " +
    "your solution (i.e. use dependency inversion, make sure the modules have a " +
    "single responsibility) ",
  severity: "error",
  from: {},
  to: {
    circular: true,
  },
};
