/* eslint-disable n/no-process-env */
import { fileURLToPath } from "node:url";
import { existsSync, realpathSync, readFileSync } from "node:fs";
import { join, relative, sep, resolve, dirname } from "node:path";
import { homedir } from "node:os";

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
    // {0,64} in stead of * as 64 chars seems like a reasonable upper limit
    const lMatch = /^prefix\s{0,64}=\s{0,64}(?<prefix>.+)$/m.exec(
      pReadFile(pFilePath, "utf8"),
    );
    return lMatch ? lMatch.groups.prefix : null;
  } catch {
    return null;
  }
}

export function getGlobalNpmrcPath(pRuntime = {}) {
  if (pRuntime.isWindows && pRuntime.environment.APPDATA) {
    return join(pRuntime.environment.APPDATA, "/npm/etc/npmrc");
  }
  // Homebrew special case: `$(brew --prefix)/lib/node_modules/npm/npmrc`
  if (pRuntime.execPath.includes("/Cellar/node")) {
    const lHomebrewPrefix = pRuntime.execPath.slice(
      0,
      pRuntime.execPath.indexOf("/Cellar/node"),
    );
    return join(lHomebrewPrefix, "/lib/node_modules/npm/npmrc");
  }
  if (pRuntime.execPath.endsWith("/bin/node")) {
    return join(dirname(dirname(pRuntime.execPath)), "/etc/npmrc");
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

export function getNpmPrefix(pRuntime = {}) {
  // npm_config_prefix env var (case-insensitive, set by npm when running scripts)
  const lEnvironmentPrefix = getNpmConfigPrefixFromEnvironment(
    pRuntime.environment,
  );
  if (lEnvironmentPrefix) {
    return resolve(lEnvironmentPrefix);
  }

  const lHomePrefix = pRuntime.readNpmrcPrefix(
    join(pRuntime.homeDirectory, ".npmrc"),
  );
  if (lHomePrefix) {
    return lHomePrefix;
  }

  if (pRuntime.environment.PREFIX) {
    return pRuntime.environment.PREFIX;
  }

  const lGlobalNpmrcPath = pRuntime.getGlobalNpmrcPath({
    environment: pRuntime.environment,
    execPath: pRuntime.execPath,
    isWindows: pRuntime.isWindows,
  });
  if (lGlobalNpmrcPath) {
    const lGlobalPrefix = pRuntime.readNpmrcPrefix(lGlobalNpmrcPath);
    if (lGlobalPrefix) {
      return lGlobalPrefix;
    }
  }

  if (pRuntime.isWindows) {
    return pRuntime.environment.APPDATA
      ? join(pRuntime.environment.APPDATA, "npm")
      : dirname(pRuntime.execPath);
  }
  return dirname(dirname(pRuntime.execPath));
}

export function getNpmGlobalPackagesDirectory(pRuntime = {}) {
  return join(
    pRuntime.getNpmPrefix(),
    pRuntime.isWindows ? "node_modules" : "lib/node_modules",
  );
}

export function getYarnWindowsDirectory(pRuntime = {}) {
  if (pRuntime.isWindows && pRuntime.environment.LOCALAPPDATA) {
    const lDirectory = join(pRuntime.environment.LOCALAPPDATA, "Yarn");
    if (pRuntime.exists(lDirectory)) {
      return lDirectory;
    }
  }
  return false;
}

export function getYarnPrefix(pRuntime = {}) {
  if (pRuntime.environment.PREFIX) {
    return pRuntime.environment.PREFIX;
  }

  const lWindowsDirectory = pRuntime.getYarnWindowsDirectory({
    environment: pRuntime.environment,
    isWindows: pRuntime.isWindows,
    exists: pRuntime.exists,
  });
  if (lWindowsDirectory) {
    return lWindowsDirectory;
  }

  const lConfigPrefix = join(pRuntime.homeDirectory, ".config/yarn");
  if (pRuntime.exists(lConfigPrefix)) {
    return lConfigPrefix;
  }

  const lHomePrefix = join(pRuntime.homeDirectory, ".yarn-config");
  if (pRuntime.exists(lHomePrefix)) {
    return lHomePrefix;
  }

  return pRuntime.getNpmPrefix();
}

export function getYarnGlobalPackagesDirectory(pRuntime = {}) {
  const lYarnPrefix = resolve(pRuntime.getYarnPrefix());

  return join(
    lYarnPrefix,
    pRuntime.getYarnWindowsDirectory({
      environment: pRuntime.environment,
      isWindows: pRuntime.isWindows,
      exists: pRuntime.exists,
    })
      ? "Data/global/node_modules"
      : "global/node_modules",
  );
}

// eslint-disable-next-line complexity
export function isInstalledGloballyForPath(pCurrentDirectory, pRuntime = {}) {
  const lRuntime = {
    getYarnPrefix: pRuntime.getYarnPrefix ?? getYarnPrefix,
    getYarnGlobalPackagesDirectory:
      pRuntime.getYarnGlobalPackagesDirectory ?? getYarnGlobalPackagesDirectory,
    getYarnWindowsDirectory:
      pRuntime.getYarnWindowsDirectory ?? getYarnWindowsDirectory,
    getNpmGlobalPackagesDirectory:
      pRuntime.getNpmGlobalPackagesDirectory ?? getNpmGlobalPackagesDirectory,
    getNpmPrefix: pRuntime.getNpmPrefix ?? getNpmPrefix,
    readNpmrcPrefix: pRuntime.readNpmrcPrefix ?? readNpmrcPrefix,
    getGlobalNpmrcPath: pRuntime.getGlobalNpmrcPath ?? getGlobalNpmrcPath,
    execPath: pRuntime.execPath ?? process.execPath,
    homeDirectory: pRuntime.homeDirectory ?? homedir(),
    environment: pRuntime.environment ?? process.env,
    isWindows: pRuntime.isWindows ?? process.platform === "win32",
    exists: pRuntime.exists ?? existsSync,
    realPath: pRuntime.realpath ?? realpathSync,
  };

  return (
    isPathInside(
      pCurrentDirectory,
      lRuntime.getYarnGlobalPackagesDirectory(),
    ) ||
    isPathInside(
      pCurrentDirectory,
      lRuntime.realPath(lRuntime.getNpmGlobalPackagesDirectory()),
    )
  );
}

export function isInstalledGlobally() {
  try {
    return isInstalledGloballyForPath(dirname(fileURLToPath(import.meta.url)));
  } catch {
    return false;
  }
}
