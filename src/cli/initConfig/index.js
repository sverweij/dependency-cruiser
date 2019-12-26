const $defaults = require("../defaults.json");
const createConfigFile = require("./createConfigFile");
const getUserInput = require("./getUserInput");
const { pnpIsEnabled, fileExists } = require("./helpers");

const TYPESCRIPT_CONFIG = `./${$defaults.TYPESCRIPT_CONFIG}`;
const WEBPACK_CONFIG = `./${$defaults.WEBPACK_CONFIG}`;
const ONESHOT_CONFIGS = {
  preset: {
    configType: "preset",
    preset: "dependency-cruiser/configs/recommended-strict",
    useTsConfig: fileExists(TYPESCRIPT_CONFIG),
    tsconfig: TYPESCRIPT_CONFIG,
    useYarnPnP: pnpIsEnabled(),
    useWebpackConfig: fileExists(WEBPACK_CONFIG),
    webpackConfig: WEBPACK_CONFIG
  },
  yes: {
    useTsConfig: fileExists(TYPESCRIPT_CONFIG),
    tsconfig: TYPESCRIPT_CONFIG,
    useYarnPnP: pnpIsEnabled(),
    useWebpackConfig: fileExists(WEBPACK_CONFIG),
    webpackConfig: WEBPACK_CONFIG
  }
};

module.exports = pInit => {
  /* istanbul ignore if */
  if (pInit === true) {
    getUserInput()
      .then(createConfigFile)
      .catch(pError => {
        process.stderr.write(`\n  ERROR: ${pError.message}\n`);
      });
  } else {
    // eslint-disable-next-line security/detect-object-injection
    createConfigFile(ONESHOT_CONFIGS[pInit] || {});
  }
};
