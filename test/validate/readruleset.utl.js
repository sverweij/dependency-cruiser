const fs = require("fs");
const normalizeRuleSet = require("../../src/main/rule-set/normalize");
const validateRuleSet = require("../../src/main/rule-set/validate");

module.exports = (pFileName) =>
  normalizeRuleSet(
    validateRuleSet(JSON.parse(fs.readFileSync(pFileName, "utf8")))
  );
