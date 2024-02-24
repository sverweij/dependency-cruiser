import { readFile } from "node:fs/promises";

import { extname } from "node:path";
import json5 from "json5";
import tryImport from "semver-try-require";
import makeAbsolute from "./make-absolute.mjs";
import meta from "#meta.cjs";

async function getJSConfig(pBabelConfigFileName) {
  let lReturnValue = {};

  try {
    const { default: lModule } = await import(
      `file://${makeAbsolute(pBabelConfigFileName)}`
    );
    lReturnValue = lModule;
  } catch (pError) {
    throw new Error(
      `${
        `Encountered an error while parsing babel config '${pBabelConfigFileName}':` +
        `\n\n          ${pError}`
      }\n\n         At this time dependency-cruiser only supports babel configurations\n         in either commonjs or json5.\n`,
    );
  }

  if (typeof lReturnValue === "function") {
    // Function format configs not supported yet. Will need calling the
    // function with a bunch of params (lReturnValue = lReturnValue(APIPAPI))
    throw new TypeError(
      `The babel config '${pBabelConfigFileName}' returns a function. At this time\n` +
        `         dependency-cruiser doesn't support that yet.`,
    );
  }
  return lReturnValue;
}

async function getJSON5Config(pBabelConfigFileName) {
  let lReturnValue = {};

  try {
    lReturnValue = json5.parse(await readFile(pBabelConfigFileName, "utf8"));
  } catch (pError) {
    throw new Error(
      `Encountered an error while parsing the babel config '${pBabelConfigFileName}':` +
        `\n\n          ${pError}\n`,
    );
  }

  if (pBabelConfigFileName.endsWith("package.json")) {
    lReturnValue = lReturnValue?.babel ?? {};
  }
  return lReturnValue;
}

async function getConfig(pBabelConfigFileName) {
  const lExtensionToParseFunction = new Map([
    [".js", getJSConfig],
    [".cjs", getJSConfig],
    [".mjs", getJSConfig],
    ["", getJSON5Config],
    [".json", getJSON5Config],
    [".json5", getJSON5Config],
  ]);
  const lExtension = extname(pBabelConfigFileName);

  if (!lExtensionToParseFunction.has(lExtension)) {
    throw new Error(
      `${`The babel config '${pBabelConfigFileName}' is in a format ('${lExtension}')\n`}         dependency-cruiser doesn't support yet.\n`,
    );
  }
  // eslint-disable-next-line no-return-await
  return await lExtensionToParseFunction.get(lExtension)(pBabelConfigFileName);
}

/**
 * Reads the file with name `pBabelConfigFileName` and returns its parsed
 * contents as an object
 *
 * Silently fails if a supported @babel/core version can't be found
 *
 * @param {string} pBabelConfigFileName
 * @return {object} babel config as an object
 * @throws {Error} when the babel config has an unknown extension OR
 *                 when the babel config is invalid OR
 *                 when dependency-cruiser can't yet process it
 */
export default async function extractBabelConfig(pBabelConfigFileName) {
  let lReturnValue = {};
  const babel = await tryImport("@babel/core", meta.supportedTranspilers.babel);

  if (babel) {
    const lConfig = {
      ...(await getConfig(pBabelConfigFileName)),
      // under some circumstances babel (and/ or its plugins) really likes to
      // have a filename to go with the config - so we pass it
      filename: pBabelConfigFileName,
    };
    lReturnValue = {
      ...babel.loadOptions(lConfig),
      // according to the babel documentation a config parsed & expanded through
      // loadOptions can be passed to the parser. With some plugins/ presets
      // this does not seem to be true anymore, though
      ...(lConfig.presets ? { presets: lConfig.presets } : {}),
    };
  }

  return lReturnValue;
}
