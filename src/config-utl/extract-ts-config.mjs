import typescript from "#utl/typescript-facade.mjs";

/**
 * Reads the file with name `pTSConfigFileName` and returns its parsed
 * contents as an object
 *
 * Silently fails if a supported version of the typescript compiler isn't available
 *
 * @param {string} pTSConfigFileName
 * @returns {import("typescript").ParsedCommandLine} tsconfig as an object
 * @throws {Error} when the tsconfig is invalid/ has errors
 * @throws {TypeError} when the tsconfig is unreadable
 */
export default function extractTSConfig(pTSConfigFileName) {
  let lReturnValue = {};

  if (typescript) {
    const lConfig = typescript.readConfigFile(pTSConfigFileName);

    if (typeof lConfig.error !== "undefined") {
      throw new TypeError(typescript.formatDiagnostics([lConfig.error]));
    }
    lReturnValue = typescript.parseJsonConfigFileContent(
      lConfig.config,
      pTSConfigFileName,
    );

    if (lReturnValue.errors.length > 0) {
      throw new Error(typescript.formatDiagnostics(lReturnValue.errors));
    }
  }

  return lReturnValue;
}
