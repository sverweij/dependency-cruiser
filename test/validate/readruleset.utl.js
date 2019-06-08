const fs               = require('fs');
const normalizeRuleSet = require('../../src/main/ruleSet/normalize');
const validateRuleSet  = require('../../src/main/ruleSet/validate');

module.exports = (pFileName) => normalizeRuleSet(
    validateRuleSet(
        JSON.parse(
            fs.readFileSync(pFileName, 'utf8')
        )
    )
);
