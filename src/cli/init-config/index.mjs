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
  isTypeModule,
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
    isTypeModule: isTypeModule(),
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
  /** @type {Map<import("./types").OneShotConfigIDType, import("./types").IPartialInitConfig>} */
  const lOneShotConfigs = new Map([
    ["yes", lBaseConfig],
    [
      "x-scripts",
      {
        updateManifest: fileExists(PACKAGE_MANIFEST),
        ...lBaseConfig,
      },
    ],
  ]);

  return lOneShotConfigs.get(pOneShotConfigId) || lBaseConfig;
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
 * @param {{stdout: NodeJS.WritableStream, stderr: NodeJS.WritableStream}=} pStreams
 */
export default function initConfig(pInit, pConfigFileName, pStreams) {
  const lStreams = {
    stdout: process.stdout,
    stderr: process.stderr,
    ...pStreams,
  };
  /* c8 ignore start */
  if (pInit === true) {
    getUserInput()
      .then(normalizeInitOptions)
      .then(buildConfig)
      .then(writeConfig)
      .catch((pError) => {
        lStreams.stderr.write(`\n  ERROR: ${pError.message}\n`);
      });
    /* c8 ignore stop */
  } else if (pInit !== false) {
    const lNormalizedInitConfig = normalizeInitOptions(getOneShotConfig(pInit));
    const lConfigFileName = pConfigFileName || getDefaultConfigFileName();

    if (manifestIsUpdatable(lNormalizedInitConfig)) {
      // if we're going to update the manifest, no need to complain about
      // a .dependency-cruiser that might already exist, because writing
      // run scripts to the manifest could still work AOK.
      if (!fileExists(lConfigFileName)) {
        writeConfig(
          buildConfig(lNormalizedInitConfig),
          lConfigFileName,
          lStreams.stdout,
        );
      }
      writeRunScriptsToManifest(lNormalizedInitConfig, {
        outStream: lStreams.stdout,
      });
    } else {
      writeConfig(
        buildConfig(lNormalizedInitConfig),
        lConfigFileName,
        lStreams.stdout,
      );
    }
  }
}
