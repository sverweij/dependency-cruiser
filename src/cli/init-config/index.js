const $defaults = require("../defaults");
const normalizeInitOptions = require("./normalize-init-options");
const buildConfig = require("./build-config");
const writeConfig = require("./write-config");
const getUserInput = require("./get-user-input");
const {
  isLikelyMonoRepo,
  fileExists,
  hasBabelConfigCandidates,
  getBabelConfigCandidates,
  hasWebpackConfigCandidates,
  getWebpackConfigCandidates,
  hasTSConfigCandidates,
  getTSConfigCandidates,
  getDefaultConfigFileName,
  hasJSConfigCandidates,
  getJSConfigCandidates,
} = require("./environment-helpers");
const {
  writeRunScriptsToManifest,
} = require("./write-run-scripts-to-manifest");

const PACKAGE_MANIFEST = `./${$defaults.PACKAGE_MANIFEST}`;

/**
 * Create a initialization configuration based on guessed defaults
 * (e.g. a tsconfig exists => use it and assume typescript is used)
 *
 * @param {import("../../../types/init-config").OneShotConfigIDType} pOneShotConfigId
 * @return {import("../../../types/init-config").IPartialInitConfig} an initialization configuration
 */
function getOneshotConfig(pOneShotConfigId) {
  /** @type {"../../../types/init-config").IPartialInitConfig} */
  const lBaseConfig = {
    isMonoRepo: isLikelyMonoRepo(),
    combinedDependencies: false,
    useJsConfig: hasJSConfigCandidates() && !hasTSConfigCandidates(),
    jsConfig: getJSConfigCandidates().shift(),
    useTsConfig: hasTSConfigCandidates(),
    tsConfig: getTSConfigCandidates().shift(),
    tsPreCompilationDeps: hasTSConfigCandidates(),
    useWebpackConfig: hasWebpackConfigCandidates(),
    webpackConfig: getWebpackConfigCandidates().shift(),
    useBabelConfig: hasBabelConfigCandidates(),
    babelConfig: getBabelConfigCandidates().shift(),
  };
  const lOneshotConfigs = {
    preset: {
      configType: "preset",
      preset: "dependency-cruiser/configs/recommended-strict",
      ...lBaseConfig,
    },
    yes: lBaseConfig,
    "experimental-scripts": {
      updateManifest: fileExists(PACKAGE_MANIFEST),
      ...lBaseConfig,
    },
  };

  // eslint-disable-next-line security/detect-object-injection
  return lOneshotConfigs[pOneShotConfigId] || lBaseConfig;
}

/**
 *
 * @param {import("../../../types/init-config").IInitConfig} pNormalizedInitConfig
 */
function manifestIsUpdateable(pNormalizedInitConfig) {
  return (
    pNormalizedInitConfig.updateManifest &&
    pNormalizedInitConfig.sourceLocation.length > 0
  );
}

module.exports = (pInit) => {
  /* c8 ignore start */
  if (pInit === true) {
    getUserInput()
      .then(normalizeInitOptions)
      .then(buildConfig)
      .then(writeConfig)
      .catch((pError) => {
        process.stderr.write(`\n  ERROR: ${pError.message}\n`);
      });
    /* c8 ignore stop */
  } else {
    const lNormalizedInitConfig = normalizeInitOptions(getOneshotConfig(pInit));
    if (!fileExists(getDefaultConfigFileName())) {
      writeConfig(buildConfig(lNormalizedInitConfig));
    }

    if (manifestIsUpdateable(lNormalizedInitConfig)) {
      writeRunScriptsToManifest(lNormalizedInitConfig);
    }
  }
};
