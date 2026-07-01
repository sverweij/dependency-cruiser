import { equal } from "node:assert/strict";
import {
  readNpmrcPrefix,
  getGlobalNpmrcPath,
  getNpmPrefix,
  getNpmGlobalPackagesDirectory,
  getYarnWindowsDirectory,
  getYarnPrefix,
  getYarnGlobalPackagesDirectory,
  isInstalledGloballyForPath,
} from "#cli/utl/is-installed-globally.mjs";

describe("[U] cli/utl/is-installed-globally npm", () => {
  it("readNpmrcPrefix extracts prefix", () => {
    const lPrefix = readNpmrcPrefix(
      "/irrelevant/.npmrc",
      () => "registry = https://example.com\nprefix = /tmp/npm\n",
    );

    equal(lPrefix, "/tmp/npm");
  });

  it("readNpmrcPrefix returns null when read fails", () => {
    const lPrefix = readNpmrcPrefix("/irrelevant/.npmrc", () => {
      throw new Error("nope");
    });

    equal(lPrefix, null);
  });

  it("getGlobalNpmrcPath resolves windows appdata path", () => {
    equal(
      getGlobalNpmrcPath({
        environment: { APPDATA: "/tmp/appdata" },
        execPath: "/bin/node",
        isWindows: true,
      }),
      "/tmp/appdata/npm/etc/npmrc",
    );
  });

  it("getGlobalNpmrcPath resolves homebrew path", () => {
    equal(
      getGlobalNpmrcPath({
        environment: {},
        execPath: "/opt/homebrew/Cellar/node/26.2.0/bin/node",
        isWindows: false,
      }),
      "/opt/homebrew/lib/node_modules/npm/npmrc",
    );
  });

  it("getGlobalNpmrcPath resolves unix node path", () => {
    equal(
      getGlobalNpmrcPath({
        environment: {},
        execPath: "/usr/local/bin/node",
        isWindows: false,
      }),
      "/usr/local/etc/npmrc",
    );
  });

  it("getGlobalNpmrcPath returns null when no strategy matches", () => {
    equal(
      getGlobalNpmrcPath({
        environment: {},
        execPath: "/usr/local/sbin/node",
        isWindows: false,
      }),
      null,
    );
  });

  it("getNpmPrefix prefers npm_config_prefix from env", () => {
    const lPrefix = getNpmPrefix({
      environment: { NPM_CONFIG_PREFIX: "/tmp/npm-prefix" },
      homeDirectory: "/home/test",
      execPath: "/usr/local/bin/node",
      isWindows: false,
      readNpmrcPrefix: () => null,
      getGlobalNpmrcPath: () => null,
    });

    equal(lPrefix, "/tmp/npm-prefix");
  });

  it("getNpmPrefix uses home npmrc when present", () => {
    const lPrefix = getNpmPrefix({
      environment: {},
      homeDirectory: "/home/test",
      execPath: "/usr/local/bin/node",
      isWindows: false,
      readNpmrcPrefix: (pPath) =>
        pPath.endsWith(".npmrc") ? "/home/test/npm-home" : null,
      getGlobalNpmrcPath: () => null,
    });

    equal(lPrefix, "/home/test/npm-home");
  });

  it("getNpmPrefix uses PREFIX env as fallback", () => {
    const lPrefix = getNpmPrefix({
      environment: { PREFIX: "/tmp/prefix" },
      homeDirectory: "/home/test",
      execPath: "/usr/local/bin/node",
      isWindows: false,
      readNpmrcPrefix: () => null,
      getGlobalNpmrcPath: () => null,
    });

    equal(lPrefix, "/tmp/prefix");
  });

  it("getNpmPrefix uses global npmrc prefix", () => {
    const lPrefix = getNpmPrefix({
      environment: {},
      homeDirectory: "/home/test",
      execPath: "/usr/local/bin/node",
      isWindows: false,
      readNpmrcPrefix: (pPath) =>
        pPath === "/usr/local/etc/npmrc" ? "/tmp/npm-global" : null,
      getGlobalNpmrcPath: () => "/usr/local/etc/npmrc",
    });

    equal(lPrefix, "/tmp/npm-global");
  });

  it("getNpmPrefix has windows fallback", () => {
    const lPrefix = getNpmPrefix({
      environment: { APPDATA: "/tmp/appdata" },
      homeDirectory: "/home/test",
      execPath: "/custom/node",
      isWindows: true,
      readNpmrcPrefix: () => null,
      getGlobalNpmrcPath: () => null,
    });

    equal(lPrefix, "/tmp/appdata/npm");
  });

  it("getNpmPrefix has unix fallback", () => {
    const lPrefix = getNpmPrefix({
      environment: {},
      homeDirectory: "/home/test",
      execPath: "/usr/local/bin/node",
      isWindows: false,
      readNpmrcPrefix: () => null,
      getGlobalNpmrcPath: () => null,
    });

    equal(lPrefix, "/usr/local");
  });

  it("getNpmGlobalPackagesDirectory builds windows path", () => {
    equal(
      getNpmGlobalPackagesDirectory({
        getNpmPrefix: () => "/tmp/npm",
        isWindows: true,
      }),
      "/tmp/npm/node_modules",
    );
  });

  it("getNpmGlobalPackagesDirectory builds unix path", () => {
    equal(
      getNpmGlobalPackagesDirectory({
        getNpmPrefix: () => "/tmp/npm",
        isWindows: false,
      }),
      "/tmp/npm/lib/node_modules",
    );
  });
});

describe("[U] cli/utl/is-installed-globally yarn", () => {
  it("getYarnWindowsDirectory returns existing windows directory", () => {
    equal(
      getYarnWindowsDirectory({
        environment: { LOCALAPPDATA: "/tmp/localappdata" },
        isWindows: true,
        exists: () => true,
      }),
      "/tmp/localappdata/Yarn",
    );
  });

  it("getYarnWindowsDirectory returns false when not available", () => {
    equal(
      getYarnWindowsDirectory({
        environment: {},
        isWindows: false,
        exists: () => true,
      }),
      false,
    );
  });

  it("getYarnPrefix prefers PREFIX env", () => {
    equal(
      getYarnPrefix({
        environment: { PREFIX: "/tmp/yarn-prefix" },
        homeDirectory: "/home/test",
        getYarnWindowsDirectory: () => false,
        exists: () => false,
        getNpmPrefix: () => "/tmp/npm",
        isWindows: false,
      }),
      "/tmp/yarn-prefix",
    );
  });

  it("getYarnPrefix prefers yarn windows directory", () => {
    equal(
      getYarnPrefix({
        environment: {},
        homeDirectory: "/home/test",
        getYarnWindowsDirectory: () => "/tmp/yarn-win",
        exists: () => false,
        getNpmPrefix: () => "/tmp/npm",
        isWindows: true,
      }),
      "/tmp/yarn-win",
    );
  });

  it("getYarnPrefix uses config directory when present", () => {
    equal(
      getYarnPrefix({
        environment: {},
        homeDirectory: "/home/test",
        getYarnWindowsDirectory: () => false,
        exists: (pPath) => pPath === "/home/test/.config/yarn",
        getNpmPrefix: () => "/tmp/npm",
        isWindows: false,
      }),
      "/home/test/.config/yarn",
    );
  });

  it("getYarnPrefix uses home yarn-config when present", () => {
    equal(
      getYarnPrefix({
        environment: {},
        homeDirectory: "/home/test",
        getYarnWindowsDirectory: () => false,
        exists: (pPath) => pPath === "/home/test/.yarn-config",
        getNpmPrefix: () => "/tmp/npm",
        isWindows: false,
      }),
      "/home/test/.yarn-config",
    );
  });

  it("getYarnPrefix falls back to npm prefix", () => {
    equal(
      getYarnPrefix({
        environment: {},
        homeDirectory: "/home/test",
        getYarnWindowsDirectory: () => false,
        exists: () => false,
        getNpmPrefix: () => "/tmp/npm-fallback",
        isWindows: false,
      }),
      "/tmp/npm-fallback",
    );
  });

  it("getYarnGlobalPackagesDirectory picks windows style folder", () => {
    equal(
      getYarnGlobalPackagesDirectory({
        getYarnPrefix: () => "/tmp/yarn",
        getYarnWindowsDirectory: () => "/tmp/yarn-win",
        environment: {},
        isWindows: true,
        exists: () => true,
      }),
      "/tmp/yarn/Data/global/node_modules",
    );
  });

  it("getYarnGlobalPackagesDirectory picks unix style folder", () => {
    equal(
      getYarnGlobalPackagesDirectory({
        getYarnPrefix: () => "/tmp/yarn",
        getYarnWindowsDirectory: () => false,
        environment: {},
        isWindows: false,
        exists: () => false,
      }),
      "/tmp/yarn/global/node_modules",
    );
  });
});

describe("[U] cli/utl/is-installed-globally detection", () => {
  it("isInstalledGloballyForPath returns true for yarn global path", () => {
    equal(
      isInstalledGloballyForPath(
        "/tmp/yarn/global/node_modules/dependency-cruiser/src/cli/utl",
        {
          getYarnGlobalPackagesDirectory: () => "/tmp/yarn/global/node_modules",
          getNpmGlobalPackagesDirectory: () => "/tmp/npm/lib/node_modules",
          realpath: () => "/tmp/npm/lib/node_modules",
        },
      ),
      true,
    );
  });

  it("isInstalledGloballyForPath returns true for npm global path", () => {
    equal(
      isInstalledGloballyForPath(
        "/tmp/npm/lib/node_modules/dependency-cruiser/src/cli/utl",
        {
          getYarnGlobalPackagesDirectory: () => "/tmp/yarn/global/node_modules",
          getNpmGlobalPackagesDirectory: () => "/tmp/npm/lib/node_modules",
          realpath: () => "/tmp/npm/lib/node_modules",
        },
      ),
      true,
    );
  });

  it("isInstalledGloballyForPath returns false when outside global paths", () => {
    equal(
      isInstalledGloballyForPath("/tmp/project/src/cli/utl", {
        getYarnGlobalPackagesDirectory: () => "/tmp/yarn/global/node_modules",
        getNpmGlobalPackagesDirectory: () => "/tmp/npm/lib/node_modules",
        realpath: () => "/tmp/npm/lib/node_modules",
      }),
      false,
    );
  });
});
