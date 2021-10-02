const fs = require("fs");
const path = require("path");
const { builtinModules } = require("module");
const memoize = require("lodash/memoize");
const pathToPosix = require("../utl/path-to-posix");

const fileExists = memoize((pFile) => {
  try {
    fs.accessSync(pFile, fs.R_OK);
  } catch (pError) {
    return false;
  }

  return true;
});

function guessPath(pBaseDirectory, pFileDirectory, pStrippedModuleName) {
  return pathToPosix(
    path.relative(
      pBaseDirectory,
      path.join(pFileDirectory, pStrippedModuleName)
    )
  );
}

function guessLikelyPath(pBaseDirectory, pFileDirectory, pStrippedModuleName) {
  return (
    [".js", ""]
      .map((pExtension) =>
        guessPath(
          pBaseDirectory,
          pFileDirectory,
          `${pStrippedModuleName}${pExtension}`
        )
      )
      .find(fileExists) || pStrippedModuleName
  );
}

module.exports = function resolveAMD(
  pStrippedModuleName,
  pBaseDirectory,
  pFileDirectory
) {
  // lookups:
  // - [x] could be relative in the end (implemented)
  // - [ ] require.config kerfuffle (command line, html, file, ...)
  // - [ ] maybe use mrjoelkemp/module-lookup-amd ?
  // - [ ] or https://github.com/jaredhanson/amd-resolve ?
  // - [x] funky plugins (json!wappie, ./screeching-cat!sabertooth)
  const lResolvedPath = guessLikelyPath(
    pBaseDirectory,
    pFileDirectory,
    pStrippedModuleName
  );

  return {
    resolved: lResolvedPath,
    coreModule: builtinModules.includes(pStrippedModuleName),
    followable: fileExists(lResolvedPath) && lResolvedPath.endsWith(".js"),
    couldNotResolve:
      !builtinModules.includes(pStrippedModuleName) &&
      !fileExists(lResolvedPath),
  };
};

module.exports.clearCache = () => {
  fileExists.cache.clear();
};
