import { readFileSync } from "node:fs";
import { parse, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { deepEqual, equal, throws } from "node:assert/strict";
import { getManifest } from "#extract/resolve/get-manifest.mjs";

const rootPackageJson = JSON.parse(
  readFileSync(
    fileURLToPath(new URL("../../../package.json", import.meta.url)),
    "utf8",
  ),
);

const FIXTUREDIR = "test/extract/resolve/__fixtures__";
const WORKINGDIR = process.cwd();

describe("[I] extract/resolve/get-manifest - classic strategy", () => {
  afterEach("tear down", () => {
    process.chdir(WORKINGDIR);
  });

  it("returns 'null' if the package.json does not exist over there", () => {
    process.chdir("test/extract/resolve/__fixtures__/no-package-json-here");
    equal(getManifest(parse(process.cwd()).root), null);
  });

  it("returns 'null' if the package.json is invalid", () => {
    equal(getManifest(join(FIXTUREDIR, "invalid-package-json")), null);
  });

  it("returns '{}' if the package.json is empty (which is - strictly speaking - not allowed", () => {
    deepEqual(getManifest(join(FIXTUREDIR, "empty-package-json")), {});
  });

  it("returns an object with the package.json", () => {
    deepEqual(getManifest(join(FIXTUREDIR, "minimal-package-json")), {
      name: "the-absolute-bare-minimum-package-json",
      version: "481.0.0",
    });
  });

  it("looks up the closest package.json", () => {
    deepEqual(
      getManifest(join(FIXTUREDIR, "no-package-json")),
      rootPackageJson,
    );
  });
});

describe("[I] extract/resolve/get-manifest - combined dependencies strategy", () => {
  afterEach("tear down", () => {
    process.chdir(WORKINGDIR);
  });

  it("returns 'null' if the package.json does not exist over there", () => {
    process.chdir("test/extract/resolve/__fixtures__/no-package-json-here");
    equal(getManifest(process.cwd(), process.cwd(), true), null);
  });

  it("returns 'null' if the package.json is invalid", () => {
    equal(
      getManifest(
        join(FIXTUREDIR, "invalid-package-json"),
        join(FIXTUREDIR),
        true,
      ),
      null,
    );
  });

  it("returns the deps if the package.json exists in the baseDir", () => {
    process.chdir("test/extract/resolve/__fixtures__/package-json-in-here");
    deepEqual(getManifest(process.cwd(), process.cwd(), true), {
      dependencies: {
        modash: "11.11.11",
      },
    });
  });

  it("returns the combined deps if there's a package.json in both base and sub package", () => {
    process.chdir("test/extract/resolve/__fixtures__/two-level-package-jsons");
    deepEqual(
      getManifest(
        join(process.cwd(), "packages", "subthing"),
        process.cwd(),
        true,
      ),
      {
        dependencies: {
          "base-only": "1.0.0",
          "base-and-subthing": "1.2.3-subthing",
          "subthing-only": "11.11.11",
        },
        devDependencies: {
          esdoorn: "4.2.1",
          snorkel: "1.2.1",
        },
        bundledDependencies: [
          "subthing-only",
          "base-and-subthing",
          "base-only",
        ],
      },
    );
  });

  it("returns the combined deps if there's a package.json in both base and sub package - subdir of sub", () => {
    process.chdir("test/extract/resolve/__fixtures__/two-level-package-jsons");
    deepEqual(
      getManifest(
        join(process.cwd(), "packages", "subthing", "src", "somefunctionality"),
        process.cwd(),
        true,
      ),
      {
        dependencies: {
          "base-only": "1.0.0",
          "base-and-subthing": "1.2.3-subthing",
          "subthing-only": "11.11.11",
        },
        devDependencies: {
          esdoorn: "4.2.1",
          snorkel: "1.2.1",
        },
        bundledDependencies: [
          "subthing-only",
          "base-and-subthing",
          "base-only",
        ],
      },
    );
  });

  it("passing a non-matching or non-existing basedir doesn't make combining dependencies loop eternaly", () => {
    process.chdir(
      "test/extract/resolve/__fixtures__/amok-prevention-non-exist",
    );
    throws(() => {
      getManifest(process.cwd(), "bullocks-or-non-valid-basedir", true);
    }, /Unusual baseDir passed to package reading function/);
  });

  it("passing a basedir that weirdly ends in '/' doesn't make combining dependencies loop eternaly", () => {
    process.chdir(
      "test/extract/resolve/__fixtures__/amok-prevention-bogus-sub",
    );
    throws(() => {
      getManifest(process.cwd(), `${dirname(process.cwd())}/`, true);
    }, /Unusual baseDir passed to package reading function/);
  });
});
