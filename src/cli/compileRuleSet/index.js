const path          = require('path');
const resolve       = require('../../extract/resolve/resolve');
const readRuleSet   = require('./readRuleSet');
const mergeRuleSets = require('./mergeRuleSets');

/* eslint no-use-before-define: 0 */
function processExtends(pRetval, pAlreadyVisited, pBaseDir) {
    if (typeof pRetval.extends === "string") {
        pRetval = mergeRuleSets(
            pRetval,
            compileRuleSet(pRetval.extends, pAlreadyVisited, pBaseDir)
        );
    }

    if (Array.isArray(pRetval.extends)) {
        pRetval = pRetval.extends.reduce(
            (pAll, pExtends) =>
                mergeRuleSets(
                    pAll,
                    compileRuleSet(pExtends, pAlreadyVisited, pBaseDir)
                ),
            pRetval
        );
    }
    Reflect.deleteProperty(pRetval, 'extends');
    return pRetval;
}

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
        lRetval = processExtends(lRetval, pAlreadyVisited, lBaseDir);
    }

    return lRetval;
}

module.exports = compileRuleSet;
