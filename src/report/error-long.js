const error = require("./error");

module.exports = function errorLong(pResults, pOptions) {
  return error(pResults, { ...pOptions, long: true });
};
