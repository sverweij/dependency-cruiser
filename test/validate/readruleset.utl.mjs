import { readFileSync } from "fs";
import normalizeRuleSet from "../../src/main/rule-set/normalize.js";
import validateRuleSet from "../../src/main/rule-set/validate.js";

export default (pFileName) =>
  normalizeRuleSet(
    validateRuleSet(JSON.parse(readFileSync(pFileName, "utf8")))
  );
