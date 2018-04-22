const validate          = require('../validate');

function addValidation (pToDep, pValidate, pRuleSet, pFrom) {
    return Object.assign(
        {},
        pToDep,
        validate(
            pValidate,
            pRuleSet,
            pFrom,
            pToDep
        )
    );
}

/**
 * Runs through all dependencies, validates them
 * - when there's a transgression: adds it
 * - when everything is hunky-dory: adds the dependency is valid
 *
 * @param  {Object} pModules [description]
 * @param  {Object} pValidate [description]
 * @param  {Object} pRuleSet [description]
 * @return {Object}               the same dependencies, but for each
 *                                of them added whether or not it is
 *                                part of
 */
module.exports = (pModules, pValidate, pRuleSet) => pModules.map(
    pModule => Object.assign(
        {},
        pModule,
        {
            dependencies: pModule.dependencies.map(
                pToDep => addValidation(pToDep, pValidate, pRuleSet, pModule.source)
            )
        }
    )
);
