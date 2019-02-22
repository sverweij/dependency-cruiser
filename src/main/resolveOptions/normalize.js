const _get = require('lodash/get');

module.exports =  (pResolveOptions, pOptions) => Object.assign(
    {
        symlinks: pOptions.preserveSymlinks,
        tsConfig: _get(pOptions, "ruleSet.options.tsConfig.fileName", null),

        /* squirel the combinedDependencies thing into the resolve options
            - they're not for enhanced resolve, but they are for what we consider
            resolve options ...
            */
        combinedDependencies: pOptions.combinedDependencies
    },
    pResolveOptions || {}
);
