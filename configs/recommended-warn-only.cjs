const recommended = require("./recommended.cjs");

module.exports = {
  ...recommended,
  forbidden: recommended.forbidden.map((pRule) => {
    pRule.severity = "warn";
    return pRule;
  }),
};
