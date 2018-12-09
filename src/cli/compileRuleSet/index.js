const path          = require('path');
const resolve       = require('../../extract/resolve/resolve');
const readRuleSet   = require('./readRuleSet');
const mergeRuleSets = require('./mergeRuleSets');

function compileRuleSet(pRulesFile, pAlreadyVisited = new Set(), pBaseDir = process.cwd()) {

    const lResolvedFileName = resolve(
        pRulesFile,
        pBaseDir,
        {
            extensions: [".js", ".json"]
        },
        'cli'
    );
    const lBaseDir = path.dirname(lResolvedFileName);

    if (pAlreadyVisited.has(lResolvedFileName)){
        throw new Error(`config is circular - ${Array.from(pAlreadyVisited).join(' -> ')} -> ${lResolvedFileName}.\n`);
    }
    pAlreadyVisited.add(lResolvedFileName);

    let lRetval = readRuleSet(lResolvedFileName, pBaseDir);

    if (lRetval.hasOwnProperty("extends")) {
        if (typeof lRetval.extends === "string"){
            lRetval = mergeRuleSets(lRetval, compileRuleSet(lRetval.extends, pAlreadyVisited, lBaseDir));
        }
        if (Array.isArray(lRetval.extends)){
            lRetval = lRetval.extends.reduce(
                (pAll, pExtends) => mergeRuleSets(pAll, compileRuleSet(pExtends, pAlreadyVisited, lBaseDir)),
                lRetval
            );
        }
        Reflect.deleteProperty(lRetval, 'extends');
    }

    return lRetval;
}

module.exports = compileRuleSet;
