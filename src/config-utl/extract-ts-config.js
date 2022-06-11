const path = require("path");
const tryRequire = require("semver-try-require");
const get = require("lodash/get");
const { supportedTranspilers } = require("../../src/meta.js");

const typescript = tryRequire("typescript", supportedTranspilers.typescript);

const FORMAT_DIAGNOSTICS_HOST = {
  getCanonicalFileName(pFileName) {
    let lReturnValue = pFileName.toLowerCase();

    // depends on the platform which branch is taken, hence the c8 ignore
    /* c8 ignore start */
    if (get(typescript, "sys.useCaseSensitiveFileNames", false)) {
      lReturnValue = pFileName;
    }
    /* c8 ignore stop */
    return lReturnValue;
  },
  getCurrentDirectory() {
    return process.cwd();
  },
  getNewLine() {
    return "\n";
  },
};

/**
 * Reads the file with name `pTSConfigFileName` and returns its parsed
 * contents as an object
 *
 * Silently fails if a supported version of the typescript compiler isn't available
 *
 * @param {string} pTSConfigFileName
 * @return {any} tsconfig as an object
 * @throws {Error} when the tsconfig is invalid/ jas errors
 * @throws {TypeError} when the tsconfig is unreadable
 */
module.exports = function extractTSConfig(pTSConfigFileName) {
  let lReturnValue = {};

  if (typescript) {
    const lConfig = typescript.readConfigFile(
      pTSConfigFileName,
      typescript.sys.readFile
    );

    if (typeof lConfig.error !== "undefined") {
      throw new TypeError(
        typescript.formatDiagnostics([lConfig.error], FORMAT_DIAGNOSTICS_HOST)
      );
    }
    lReturnValue = typescript.parseJsonConfigFileContent(
      lConfig.config,
      typescript.sys,
      path.dirname(path.resolve(pTSConfigFileName)),
      {},
      pTSConfigFileName
    );

    if (lReturnValue.errors.length > 0) {
      throw new Error(
        typescript.formatDiagnostics(
          lReturnValue.errors,
          FORMAT_DIAGNOSTICS_HOST
        )
      );
    }
    // lRetval.fileNames; // all files included in the project
    // lRetval.options; // CompilerOptions
  }

  return lReturnValue;
};
