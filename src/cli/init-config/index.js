const $defaults = require("../defaults.json");
const normalizeInitOptions = require("./normalize-init-options");
const buildConfig = require("./build-config");
const writeConfig = require("./write-config");
const getUserInput = require("./get-user-input");
const {
  isLikelyMonoRepo,
  pnpIsEnabled,
  fileExists,
  getFirstExistingFileName,
} = require("./environment-helpers");
const { writeRunScriptsToManifest } = require("./add-run-scripts-to-manifest");

const TYPESCRIPT_CONFIG = `./${$defaults.TYPESCRIPT_CONFIG}`;
const WEBPACK_CONFIG = `./${$defaults.WEBPACK_CONFIG}`;
const BABEL_CONFIG_NAME_SEARCH_ARRAY = $defaults.BABEL_CONFIG_NAME_SEARCH_ARRAY;
const PACKAGE_MANIFEST = `./${$defaults.PACKAGE_MANIFEST}`;

function getOneshotConfig(pOneShotConfigId) {
  const BASE_CONFIG = {
    isMonoRepo: isLikelyMonoRepo(),
    useTsConfig: fileExists(TYPESCRIPT_CONFIG),
    tsConfig: TYPESCRIPT_CONFIG,
    tsPreCompilationDeps: fileExists(TYPESCRIPT_CONFIG),
    useYarnPnP: pnpIsEnabled(),
    useWebpackConfig: fileExists(WEBPACK_CONFIG),
    webpackConfig: WEBPACK_CONFIG,
    useBabelConfig: Boolean(
      getFirstExistingFileName(BABEL_CONFIG_NAME_SEARCH_ARRAY)
    ),
    babelConfig: getFirstExistingFileName(BABEL_CONFIG_NAME_SEARCH_ARRAY),
  };
  const ONESHOT_CONFIGS = {
    preset: {
      configType: "preset",
      preset: "dependency-cruiser/configs/recommended-strict",
      ...BASE_CONFIG,
    },
    yes: BASE_CONFIG,
    "experimental-scripts": {
      updateManifest: fileExists(PACKAGE_MANIFEST),
      ...BASE_CONFIG,
    },
  };

  // eslint-disable-next-line security/detect-object-injection
  return ONESHOT_CONFIGS[pOneShotConfigId] || {};
}

function manifestIsUpdateable(pNormalizedInitConfig) {
  return (
    pNormalizedInitConfig.updateManifest &&
    pNormalizedInitConfig.sourceLocation.length > 0
  );
}

module.exports = (pInit) => {
  /* istanbul ignore if */
  if (pInit === true) {
    getUserInput()
      .then(normalizeInitOptions)
      .then(buildConfig)
      .then(writeConfig)
      .catch((pError) => {
        process.stderr.write(`\n  ERROR: ${pError.message}\n`);
      });
  } else {
    const lNormalizedInitConfig = normalizeInitOptions(getOneshotConfig(pInit));

    writeConfig(buildConfig(lNormalizedInitConfig));
    if (manifestIsUpdateable(lNormalizedInitConfig)) {
      writeRunScriptsToManifest(lNormalizedInitConfig);
    }
  }
};
