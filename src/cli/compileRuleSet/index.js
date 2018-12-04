
const readRuleSet = require('./readRuleSet');
const mergeRuleSets = require('./mergeRuleSets');

function compileRuleSet(pRulesFile, pAlreadyVisited = new Set()) {
    if (pAlreadyVisited.has(pRulesFile)){
        throw new Error(`config is circular - ${Array.from(pAlreadyVisited).join(' -> ')} -> ${pRulesFile}.\n`);
    }
    pAlreadyVisited.add(pRulesFile);

    let lRetval = readRuleSet(pRulesFile);

    if (lRetval.hasOwnProperty("extends") && typeof lRetval.extends === "string"){
        lRetval = mergeRuleSets(lRetval, compileRuleSet(lRetval.extends, pAlreadyVisited));
    }
    return lRetval;
}

module.exports = compileRuleSet;
