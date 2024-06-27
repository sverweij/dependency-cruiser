const { equal, deepEqual } = require("node:assert/strict");
const { join } = require("node:path");
const { unlinkSync } = require("node:fs");
const symlinkDir = require("symlink-dir");
const semver = require("semver");
// eslint-disable-next-line node/no-extraneous-require
const rcMock = require("rc");
// eslint-disable-next-line node/no-extraneous-require
const betaMock = require("beta");
const tryRequire = require("#utl/try-require.cjs");

describe("[U] utl/tryRequire", () => {
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
        `Symlinking in before trigger failed in test '[U] utl/tryRequire': ${pError}`,
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
        `Unlinking in after trigger failed in test '[U] utl/tryRequire': ${pError}`,
      );
    }
  });
  it("returns false for unresolvable modules", () => {
    equal(tryRequire("thispackage-is-not-there"), false);
  });

  it("returns the module if it is resolvable", () => {
    deepEqual(tryRequire("semver"), semver);
  });

  it("returns the module if it is resolvable and satisfies specified semver", () => {
    deepEqual(tryRequire("semver", ">=5.0.0 <8.0.0"), semver);
  });

  it("returns the module if it is resolvable and satisfies specified semver (with rc postfix)", () => {
    deepEqual(tryRequire("rc", ">=2.0.0 <4.0.0"), rcMock);
  });

  it("returns false if it is resolvable but does not satisfy specified semver (with rc postfix)", () => {
    equal(tryRequire("rc", ">=2.0.0 <3.0.0"), false);
  });

  it("returns the module if it is resolvable and satisfies specified semver (with beta postfix)", () => {
    deepEqual(tryRequire("beta", ">=2.0.0 <4.0.0"), betaMock);
  });

  it("returns false if it is resolvable but does not satisfy specified semver (with beta postfix)", () => {
    equal(tryRequire("beta", ">=2.0.0 <3.0.0"), false);
  });

  it("returns false if it is resolvable but doesn't satisfy the specified semver", () => {
    equal(tryRequire("semver", "<5.0.0"), false);
  });
});
