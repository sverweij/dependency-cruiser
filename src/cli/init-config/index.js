const $defaults = require("../defaults.json");
const createConfigFile = require("./create-config-file");
const getUserInput = require("./get-user-input");
const { pnpIsEnabled, fileExists } = require("./helpers");

const TYPESCRIPT_CONFIG = `./${$defaults.TYPESCRIPT_CONFIG}`;
const WEBPACK_CONFIG = `./${$defaults.WEBPACK_CONFIG}`;

function getOneshotConfig(pInit) {
  const ONESHOT_CONFIGS = {
    preset: {
      configType: "preset",
      preset: "dependency-cruiser/configs/recommended-strict",
      useTsConfig: fileExists(TYPESCRIPT_CONFIG),
      tsConfig: TYPESCRIPT_CONFIG,
      tsPreCompilationDeps: fileExists(TYPESCRIPT_CONFIG),
      useYarnPnP: pnpIsEnabled(),
      useWebpackConfig: fileExists(WEBPACK_CONFIG),
      webpackConfig: WEBPACK_CONFIG
    },
    yes: {
      useTsConfig: fileExists(TYPESCRIPT_CONFIG),
      tsConfig: TYPESCRIPT_CONFIG,
      tsPreCompilationDeps: fileExists(TYPESCRIPT_CONFIG),
      useYarnPnP: pnpIsEnabled(),
      useWebpackConfig: fileExists(WEBPACK_CONFIG),
      webpackConfig: WEBPACK_CONFIG
    }
  };

  // eslint-disable-next-line security/detect-object-injection
  return ONESHOT_CONFIGS[pInit] || {};
}

module.exports = pInit => {
  /* istanbul ignore if */
  if (pInit === true) {
    getUserInput()
      .then(createConfigFile)
      .catch(pError => {
        process.stderr.write(`\n  ERROR: ${pError.message}\n`);
      });
  } else {
    createConfigFile(getOneshotConfig(pInit));
  }
};
