/* eslint-disable n/no-process-env */
import { fileURLToPath } from "node:url";
import { existsSync, realpathSync, readFileSync } from "node:fs";
import { join, relative, sep, resolve, dirname } from "node:path";
import { homedir } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const IS_WINDOWS = process.platform === "win32";

function isPathInside(pChildPath, pParentPath) {
  const lRelation = relative(pParentPath, pChildPath);
  return Boolean(
    lRelation &&
    lRelation !== ".." &&
    !lRelation.startsWith(`..${sep}`) &&
    lRelation !== resolve(pChildPath),
  );
}

/**
 * Read the `prefix` value from an npmrc file without depending on the `ini`
 * package. npmrc files use a simple `key = value` format.
 *
 * @param {string} pFilePath
 * @param {(pFilePath: string, pEncoding: string) => string} [pReadFile]
 * @returns {string|null}
 */
export function readNpmrcPrefix(pFilePath, pReadFile = readFileSync) {
  try {
    // {0,64} in stead of
    const lMatch = /^prefix\s{0,64}=\s{0,64}(?<prefix>.+)$/m.exec(
      pReadFile(pFilePath, "utf8"),
    );
    return lMatch ? lMatch.groups.prefix : null;
  } catch {
    return null;
  }
}

export function getGlobalNpmrcPath(pRuntime = {}) {
  const lEnvironment = pRuntime.environment ?? process.env;
  const lExecPath = pRuntime.execPath ?? process.execPath;
  const lIsWindows = pRuntime.isWindows ?? IS_WINDOWS;

  if (lIsWindows && lEnvironment.APPDATA) {
    return join(lEnvironment.APPDATA, "/npm/etc/npmrc");
  }
  // Homebrew special case: `$(brew --prefix)/lib/node_modules/npm/npmrc`
  if (lExecPath.includes("/Cellar/node")) {
    const lHomebrewPrefix = lExecPath.slice(
      0,
      lExecPath.indexOf("/Cellar/node"),
    );
    return join(lHomebrewPrefix, "/lib/node_modules/npm/npmrc");
  }
  if (lExecPath.endsWith("/bin/node")) {
    return join(dirname(dirname(lExecPath)), "/etc/npmrc");
  }

  return null;
}

function getNpmConfigPrefixFromEnvironment(pEnvironment) {
  return Object.keys(pEnvironment).reduce(
    (pPrefix, pName) =>
      // eslint-disable-next-line security/detect-object-injection
      /^npm_config_prefix$/i.test(pName) ? pEnvironment[pName] : pPrefix,
    null,
  );
}

// eslint-disable-next-line max-statements
export function getNpmPrefix(pRuntime = {}) {
  const lEnvironment = pRuntime.environment ?? process.env;
  const lHomeDirectory = pRuntime.homeDirectory ?? homedir();
  const lExecPath = pRuntime.execPath ?? process.execPath;
  const lIsWindows = pRuntime.isWindows ?? IS_WINDOWS;
  const lReadNpmrcPrefix = pRuntime.readNpmrcPrefix ?? readNpmrcPrefix;
  const lGetGlobalNpmrcPath = pRuntime.getGlobalNpmrcPath ?? getGlobalNpmrcPath;

  // npm_config_prefix env var (case-insensitive, set by npm when running scripts)
  const lEnvironmentPrefix = getNpmConfigPrefixFromEnvironment(lEnvironment);
  if (lEnvironmentPrefix) {
    return resolve(lEnvironmentPrefix);
  }

  const lHomePrefix = lReadNpmrcPrefix(join(lHomeDirectory, ".npmrc"));
  if (lHomePrefix) {
    return lHomePrefix;
  }

  if (lEnvironment.PREFIX) {
    return lEnvironment.PREFIX;
  }

  const lGlobalNpmrcPath = lGetGlobalNpmrcPath({
    environment: lEnvironment,
    execPath: lExecPath,
    isWindows: lIsWindows,
  });
  if (lGlobalNpmrcPath) {
    const lGlobalPrefix = lReadNpmrcPrefix(lGlobalNpmrcPath);
    if (lGlobalPrefix) {
      return lGlobalPrefix;
    }
  }

  if (lIsWindows) {
    return lEnvironment.APPDATA
      ? join(lEnvironment.APPDATA, "npm")
      : dirname(lExecPath);
  }
  return dirname(dirname(lExecPath));
}

export function getNpmGlobalPackagesDirectory(pRuntime = {}) {
  const lGetNpmPrefix = pRuntime.getNpmPrefix ?? getNpmPrefix;
  const lIsWindows = pRuntime.isWindows ?? IS_WINDOWS;

  return join(
    lGetNpmPrefix(),
    lIsWindows ? "node_modules" : "lib/node_modules",
  );
}

export function getYarnWindowsDirectory(pRuntime = {}) {
  const lEnvironment = pRuntime.environment ?? process.env;
  const lIsWindows = pRuntime.isWindows ?? IS_WINDOWS;
  const lExists = pRuntime.exists ?? existsSync;

  if (lIsWindows && lEnvironment.LOCALAPPDATA) {
    const lDirectory = join(lEnvironment.LOCALAPPDATA, "Yarn");
    if (lExists(lDirectory)) {
      return lDirectory;
    }
  }
  return false;
}

export function getYarnPrefix(pRuntime = {}) {
  const lEnvironment = pRuntime.environment ?? process.env;
  const lHomeDirectory = pRuntime.homeDirectory ?? homedir();
  const lGetYarnWindowsDirectory =
    pRuntime.getYarnWindowsDirectory ?? getYarnWindowsDirectory;
  const lExists = pRuntime.exists ?? existsSync;
  const lGetNpmPrefix = pRuntime.getNpmPrefix ?? getNpmPrefix;
  const lIsWindows = pRuntime.isWindows ?? IS_WINDOWS;

  if (lEnvironment.PREFIX) {
    return lEnvironment.PREFIX;
  }

  const lWindowsDirectory = lGetYarnWindowsDirectory({
    environment: lEnvironment,
    isWindows: lIsWindows,
    exists: lExists,
  });
  if (lWindowsDirectory) {
    return lWindowsDirectory;
  }

  const lConfigPrefix = join(lHomeDirectory, ".config/yarn");
  if (lExists(lConfigPrefix)) {
    return lConfigPrefix;
  }

  const lHomePrefix = join(lHomeDirectory, ".yarn-config");
  if (lExists(lHomePrefix)) {
    return lHomePrefix;
  }

  return lGetNpmPrefix();
}

export function getYarnGlobalPackagesDirectory(pRuntime = {}) {
  const lGetYarnPrefix = pRuntime.getYarnPrefix ?? getYarnPrefix;
  const lGetYarnWindowsDirectory =
    pRuntime.getYarnWindowsDirectory ?? getYarnWindowsDirectory;
  const lEnvironment = pRuntime.environment ?? process.env;
  const lIsWindows = pRuntime.isWindows ?? IS_WINDOWS;
  const lExists = pRuntime.exists ?? existsSync;
  const lYarnPrefix = resolve(lGetYarnPrefix());

  return join(
    lYarnPrefix,
    lGetYarnWindowsDirectory({
      environment: lEnvironment,
      isWindows: lIsWindows,
      exists: lExists,
    })
      ? "Data/global/node_modules"
      : "global/node_modules",
  );
}

export function isInstalledGloballyForPath(pCurrentDirectory, pRuntime = {}) {
  const lGetYarnGlobalPackagesDirectory =
    pRuntime.getYarnGlobalPackagesDirectory ?? getYarnGlobalPackagesDirectory;
  const lGetNpmGlobalPackagesDirectory =
    pRuntime.getNpmGlobalPackagesDirectory ?? getNpmGlobalPackagesDirectory;
  const lRealpath = pRuntime.realpath ?? realpathSync;

  return (
    isPathInside(pCurrentDirectory, lGetYarnGlobalPackagesDirectory()) ||
    isPathInside(pCurrentDirectory, lRealpath(lGetNpmGlobalPackagesDirectory()))
  );
}

const isInstalledGlobally = (() => {
  try {
    return isInstalledGloballyForPath(__dirname);
  } catch {
    return false;
  }
})();

export default isInstalledGlobally;
