const isModuleOnlyRule = require('./isModuleOnlyRule');

function match(pModule){
    return pRule => (
        pModule.orphan === true &&
            pRule.from.orphan === true
    ) && (!pRule.from.path ||
                pModule.source.match(pRule.from.path)
    ) && (!pRule.from.pathNot ||
            !(pModule.source.match(pRule.from.pathNot))
    );
}
const isInteresting = pRule => isModuleOnlyRule(pRule);

module.exports = {
    match,
    isInteresting
};
