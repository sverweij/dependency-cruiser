// @ts-check
import { PACKAGE_MANIFEST as _PACKAGE_MANIFEST } from "../defaults.mjs";
import normalizeInitOptions from "./normalize-init-options.mjs";
import buildConfig from "./build-config.mjs";
import writeConfig from "./write-config.mjs";
import getUserInput from "./get-user-input.mjs";
import {
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
} from "./environment-helpers.mjs";
import { writeRunScriptsToManifest } from "./write-run-scripts-to-manifest.mjs";

const PACKAGE_MANIFEST = `./${_PACKAGE_MANIFEST}`;

/**
 * Create a initialization configuration based on guessed defaults
 * (e.g. a tsconfig exists => use it and assume typescript is used)
 *
 * @param {import("./types").OneShotConfigIDType} pOneShotConfigId
 * @return {import("./types").IPartialInitConfig} an initialization configuration
 */
function getOneShotConfig(pOneShotConfigId) {
  /** @type {import("./types").IPartialInitConfig} */
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
    specifyResolutionExtensions: true,
  };
  /** @type {Record<import("./types").OneShotConfigIDType, import("./types").IPartialInitConfig>} */
  const lOneShotConfigs = {
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
  return lOneShotConfigs[pOneShotConfigId] || lBaseConfig;
}

/**
 *
 * @param {import("./types").IInitConfig} pNormalizedInitConfig
 */
function manifestIsUpdatable(pNormalizedInitConfig) {
  return (
    pNormalizedInitConfig.updateManifest &&
    pNormalizedInitConfig.sourceLocation.length > 0
  );
}

/**
 * @param {boolean|import("./types").OneShotConfigIDType} pInit
 * @param {string=} pConfigFileName
 */
export default function initConfig(pInit, pConfigFileName) {
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
  } else if (pInit !== false) {
    const lNormalizedInitConfig = normalizeInitOptions(getOneShotConfig(pInit));
    const lConfigFileName = pConfigFileName || getDefaultConfigFileName();

    if (!fileExists(lConfigFileName)) {
      writeConfig(buildConfig(lNormalizedInitConfig), lConfigFileName);
    }

    if (manifestIsUpdatable(lNormalizedInitConfig)) {
      writeRunScriptsToManifest(lNormalizedInitConfig);
    }
  }
}
