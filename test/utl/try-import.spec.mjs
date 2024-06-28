import { equal, deepEqual } from "node:assert/strict";
import { join } from "node:path";
import { unlinkSync } from "node:fs";
import semver from "semver";
import symlinkDir from "symlink-dir";
import * as noDefaultExportMock from "no-default-export";

// eslint-disable-next-line node/no-extraneous-import
import betaMock from "beta";
// eslint-disable-next-line node/no-extraneous-import
import rcMock from "rc";
import tryImport from "#utl/try-import.mjs";

describe("[U] utl/tryImport", () => {
  before(() => {
    try {
      symlinkDir.sync(
        join("test", "utl", "node_modules", "no-default-export"),
        join("node_modules", "no-default-export"),
      );
      symlinkDir.sync(
        join("test", "utl", "node_modules", "beta"),
        join("node_modules", "beta"),
      );
      symlinkDir.sync(
        join("test", "utl", "node_modules", "rc"),
        join("node_modules", "rc"),
      );
    } catch (pError) {
      // eslint-disable-next-line no-console
      console.error(
        `Symlinking in before trigger failed in test '[U] utl/tryImport': ${pError}`,
      );
    }
  });

  after(() => {
    try {
      unlinkSync("node_modules/no-default-export");
      unlinkSync("node_modules/beta");
      unlinkSync("node_modules/rc");
    } catch (pError) {
      // eslint-disable-next-line no-console
      console.error(
        `Unlinking in after trigger failed in test '[U] utl/tryImport': ${pError}`,
      );
    }
  });

  it("returns false for unresolvable modules", async () => {
    equal(await tryImport("thispackage-is-not-there", ">=0.0.0"), false);
  });

  it("returns the module if it is resolvable", async () => {
    deepEqual(await tryImport("semver", ">=0.0.0"), semver);
  });

  it("returns the module if it is resolvable and doesn't have a default export", async () => {
    equal(await tryImport("no-default-export"), noDefaultExportMock);
  });

  it("returns the module if it is resolvable and satisfies specified semver", async () => {
    deepEqual(await tryImport("semver", ">=5.0.0 <8.0.0"), semver);
  });

  it("returns the module if it is resolvable and satisfies specified semver (with rc postfix)", async () => {
    deepEqual(await tryImport("rc", ">=2.0.0 <4.0.0"), rcMock);
  });

  it("returns false if it is resolvable but does not satisfy specified semver (with rc postfix)", async () => {
    equal(await tryImport("rc", ">=2.0.0 <3.0.0"), false);
  });

  it("returns the module if it is resolvable and satisfies specified semver (with beta postfix)", async () => {
    deepEqual(await tryImport("beta", ">=2.0.0 <4.0.0"), betaMock);
  });

  it("returns false if it is resolvable but does not satisfy specified semver (with beta postfix)", async () => {
    equal(await tryImport("beta", ">=2.0.0 <3.0.0"), false);
  });

  it("returns false if it is resolvable but doesn't satisfy the specified semver", async () => {
    equal(await tryImport("semver", "<5.0.0"), false);
  });
});
