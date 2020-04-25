const path = require("path");
const tryRequire = require("semver-try-require");
const _get = require("lodash/get");
const $package = require("../../package.json");

const typescript = tryRequire(
  "typescript",
  _get($package, "supportedTranspilers.typescript", null)
);

const FORMAT_DIAGNOSTICS_HOST = {
  getCanonicalFileName(pFileName) {
    let lReturnValue = pFileName.toLowerCase();

    /* istanbul ignore next - depends on the platform which branch is taken */
    if (_get(typescript, "sys.useCaseSensitiveFileNames", false)) {
      lReturnValue = pFileName;
    }
    return lReturnValue;
  },
  getCurrentDirectory() {
    return process.cwd();
  },
  getNewLine() {
    return "\n";
  },
};

module.exports = function parseConfig(pTSConfigFileName) {
  let lReturnValue = {};

  /* istanbul ignore else */
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
      path.dirname(pTSConfigFileName),
      {},
      pTSConfigFileName
    );

    if (lReturnValue.errors.length !== 0) {
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
