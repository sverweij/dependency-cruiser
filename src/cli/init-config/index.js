const $defaults = require("../defaults.json");
const normalizeInitOptions = require("./normalize-init-options");
const buildConfig = require("./build-config");
const writeConfig = require("./write-config");
const getUserInput = require("./get-user-input");
const {
  isLikelyMonoRepo,
  pnpIsEnabled,
  fileExists,
  hasBabelConfigCandidates,
  getBabelConfigCandidates,
  hasWebpackConfigCandidates,
  getWebpackConfigCandidates,
  hasTSConfigCandidates,
  getTSConfigCandidates,
} = require("./environment-helpers");
const {
  writeRunScriptsToManifest,
} = require("./write-run-scripts-to-manifest");

const PACKAGE_MANIFEST = `./${$defaults.PACKAGE_MANIFEST}`;

function getOneshotConfig(pOneShotConfigId) {
  const BASE_CONFIG = {
    isMonoRepo: isLikelyMonoRepo(),
    combinedDependencies: false,
    useTsConfig: hasTSConfigCandidates(),
    tsConfig: getTSConfigCandidates().shift(),
    tsPreCompilationDeps: hasTSConfigCandidates(),
    useYarnPnP: pnpIsEnabled(),
    useWebpackConfig: hasWebpackConfigCandidates(),
    webpackConfig: getWebpackConfigCandidates().shift(),
    useBabelConfig: hasBabelConfigCandidates(),
    babelConfig: getBabelConfigCandidates().shift(),
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
  return ONESHOT_CONFIGS[pOneShotConfigId] || BASE_CONFIG;
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
    if (!fileExists($defaults.DEFAULT_CONFIG_FILE_NAME)) {
      writeConfig(buildConfig(lNormalizedInitConfig));
    }

    if (manifestIsUpdateable(lNormalizedInitConfig)) {
      writeRunScriptsToManifest(lNormalizedInitConfig);
    }
  }
};
