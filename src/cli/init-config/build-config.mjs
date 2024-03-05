// @ts-check
import { folderNameArrayToRE } from "./utl.mjs";
import configTemplate from "./config-template.mjs";

/**
 * @param {string} pString
 * @returns {string}
 */
function quote(pString) {
  return `"${pString}"`;
}

/**
 * @param {string[]=} pExtensions
 * @returns {string}
 */
function extensionsToString(pExtensions) {
  if (pExtensions) {
    return `[${pExtensions.map(quote).join(", ")}]`;
  }
  return "";
}

/**
 * @param {import("./types.js").IInitConfig} pInitOptions
 * @returns {string}
 */
function buildNotToTestRule(pInitOptions) {
  const lNotToTestRule = `{
      name: 'not-to-test',
      comment:
        "This module depends on code within a folder that should only contain tests. As tests don't " +
        "implement functionality this is odd. Either you're writing a test outside the test folder " +
        "or there's something in the test folder that isn't a test.",
      severity: 'error',
      from: {
        pathNot: '{{testLocationRE}}'
      },
      to: {
        path: '{{testLocationRE}}'
      }
    },`;
  return pInitOptions.hasTestsOutsideSource
    ? lNotToTestRule.replace(
        /{{testLocationRE}}/g,
        folderNameArrayToRE(pInitOptions?.testLocation ?? []),
      )
    : "";
}

/**
 * @param {import("./types.js").IInitConfig} pInitOptions
 * @returns {string}
 */
function buildTsPreCompilationDepsAttribute(pInitOptions) {
  return pInitOptions.tsPreCompilationDeps
    ? "tsPreCompilationDeps: true,"
    : "// tsPreCompilationDeps: false,";
}

/**
 * @param {import("./types.js").IInitConfig} pInitOptions
 * @returns {string}
 */
function buildCombinedDependenciesAttribute(pInitOptions) {
  return pInitOptions.combinedDependencies
    ? "combinedDependencies: true,"
    : "// combinedDependencies: false,";
}

/**
 * @param {import("./types.js").IInitConfig} pInitOptions
 * @returns {string}
 */
function buildTsOrJsConfigAttribute(pInitOptions) {
  if (pInitOptions.useTsConfig) {
    return `tsConfig: {
      fileName: '${pInitOptions.tsConfig}'
    },`;
  }
  if (pInitOptions.useJsConfig) {
    return `tsConfig: {
      fileName: '${pInitOptions.jsConfig}'
    },`;
  }
  return `// tsConfig: {
    //   fileName: 'tsconfig.json'
    // },`;
}

/**
 * @param {import("./types.js").IInitConfig} pInitOptions
 * @returns {string}
 */
function buildWebpackConfigAttribute(pInitOptions) {
  return pInitOptions.webpackConfig
    ? `webpackConfig: {
      fileName: '${pInitOptions.webpackConfig}',
      // env: {},
      // arguments: {}
    },`
    : `// webpackConfig: {
    //  fileName: 'webpack.config.js',
    //  env: {},
    //  arguments: {}
    // },`;
}

/**
 * @param {import("./types.js").IInitConfig} pInitOptions
 * @returns {string}
 */
function buildBabelConfigAttribute(pInitOptions) {
  return pInitOptions.babelConfig
    ? `babelConfig: {
      fileName: '${pInitOptions.babelConfig}'
    },`
    : `// babelConfig: {
    //   fileName: '.babelrc',
    // },`;
}

/**
 * @param {import("./types.js").IInitConfig} pInitOptions
 * @returns {string}
 */
function buildExtensionsAttribute(pInitOptions) {
  return pInitOptions.specifyResolutionExtensions
    ? `extensions: ${extensionsToString(pInitOptions.resolutionExtensions)},`
    : `// extensions: [".js", ".jsx", ".ts", ".tsx", ".d.ts"],`;
}

/**
 * @param {import("./types.js").IInitConfig} pInitOptions
 * @returns {string}
 */
function buildMainFieldsAttribute(pInitOptions) {
  if (pInitOptions.isTypeModule) {
    return `mainFields: ["module", "main", "types", "typings"],`;
  }
  return `
      // if you migrate to ESM (or are in an ESM environment already) you will want to
      // have "module" in the list of mainFields, like so:
      // mainFields: ["module", "main", "types", "typings"],
      mainFields: ["main", "types", "typings"],`;
}

/**
 * Creates a .dependency-cruiser config with a set of basic validations
 * to the current directory.
 *
 * @param {import("./types.js").IInitConfig} pInitOptions ('Normalized') options that influence the shape of
 *                  the configuration
 * @returns {string} the configuration as a string
 */
export default function buildConfig(pInitOptions) {
  return configTemplate
    .replace(
      /{{sourceLocationRE}}/g,
      folderNameArrayToRE(pInitOptions.sourceLocation),
    )
    .replace(
      /{{resolutionExtensionsAsString}}/g,
      extensionsToString(pInitOptions.resolutionExtensions),
    )
    .replace("{{notToTestRule}}", buildNotToTestRule(pInitOptions))
    .replace(
      "{{tsPreCompilationDepsAttribute}}",
      buildTsPreCompilationDepsAttribute(pInitOptions),
    )
    .replace(
      "{{combinedDependenciesAttribute}}",
      buildCombinedDependenciesAttribute(pInitOptions),
    )
    .replace(
      "{{tsOrJsConfigAttribute}}",
      buildTsOrJsConfigAttribute(pInitOptions),
    )
    .replace(
      "{{webpackConfigAttribute}}",
      buildWebpackConfigAttribute(pInitOptions),
    )
    .replace(
      "{{babelConfigAttribute}}",
      buildBabelConfigAttribute(pInitOptions),
    )
    .replace("{{extensionsAttribute}}", buildExtensionsAttribute(pInitOptions))
    .replace("{{mainFieldsAttribute}}", buildMainFieldsAttribute(pInitOptions))
    .replace("{{version}}", pInitOptions.version)
    .replace("{{date}}", pInitOptions.date);
}
