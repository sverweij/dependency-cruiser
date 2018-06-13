module.exports = (pWebpackConfigFilename) => {
    let lRetval = {};

    try {
        /* eslint global-require:0, security/detect-non-literal-require:0, import/no-dynamic-require:0 */
        const lWebpackConfig = require(pWebpackConfigFilename);

        if (lWebpackConfig.resolve){
            lRetval = lWebpackConfig.resolve;
        }
    } catch (pError){
        throw new Error(
            `The webpack config '${pWebpackConfigFilename}' seems to be not quite valid for use:\n${pError}\n`
        );
    }

    return lRetval;
};
