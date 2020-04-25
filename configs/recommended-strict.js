const recommended = require("./recommended");

module.exports = {
  ...recommended,
  forbidden: recommended.forbidden.map((pRule) => {
    pRule.severity = "error";
    return pRule;
  }),
};
