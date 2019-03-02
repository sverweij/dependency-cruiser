const createConfigFile = require('./createConfigFile');
const getUserInput     = require('./getUserInput');
const {pnpIsEnabled} = require('./helpers');

const ONESHOT_CONFIGS = {
    "json": {
        configFormat: ".json",
        configType: "preset",
        preset: "dependency-cruiser/configs/recommended-strict",
        useYarnPnP: pnpIsEnabled()
    },
    "js": {
        configFormat: ".js",
        configType: "preset",
        preset: "dependency-cruiser/configs/recommended-strict",
        useYarnPnP: pnpIsEnabled()
    }
};

module.exports = (pInit) => {
    /* istanbul ignore if */
    if (pInit === true){
        getUserInput().then(
            createConfigFile
        ).catch(
            pError => {
                process.stderr.write(`\n  ERROR: ${pError.message}\n`);
            }
        );
    } else {
        /* eslint security/detect-object-injection:0 */
        createConfigFile(ONESHOT_CONFIGS[pInit] || {});
    }
};
