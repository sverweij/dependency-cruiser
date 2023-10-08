import { deepEqual, equal } from "node:assert/strict";
import { lstatSync } from "node:fs";
import { normalizeCruiseOptions } from "../../src/main/options/normalize.mjs";
import p2p from "#utl/path-to-posix.mjs";
import gatherInitialSources from "#extract/gather-initial-sources.mjs";

// make the import pathToPosix the correct function profile
// (1 parameter exactly) for use in map
function pathToPosix(pPath) {
  return p2p(pPath);
}

const EMPTYOPTIONS = normalizeCruiseOptions({});

describe("[I] extract/gatherInitialSources", () => {
  it("one file stays one file", () => {
    deepEqual(
      gatherInitialSources(
        ["test/extract/__mocks__/cjs/root_one.js"],
        EMPTYOPTIONS,
      ).map(pathToPosix),
      ["test/extract/__mocks__/cjs/root_one.js"],
    );
  });

  it("two files from different folders", () => {
    deepEqual(
      gatherInitialSources(
        [
          "test/extract/__mocks__/cjs/root_one.js",
          "test/extract/__mocks__/ts/index.ts",
        ],
        EMPTYOPTIONS,
      ).map(pathToPosix),
      [
        "test/extract/__mocks__/cjs/root_one.js",
        "test/extract/__mocks__/ts/index.ts",
      ],
    );
  });

  it("expands the scannable files in a folder", () => {
    deepEqual(
      gatherInitialSources(["test/extract/__mocks__/ts"], EMPTYOPTIONS).map(
        pathToPosix,
      ),
      [
        "test/extract/__mocks__/ts/index.ts",
        "test/extract/__mocks__/ts/javascriptThing.js",
        "test/extract/__mocks__/ts/sub/index.ts",
        "test/extract/__mocks__/ts/sub/kaching.ts",
        "test/extract/__mocks__/ts/sub/willBeReExported.ts",
      ],
    );
  });

  it("expands and concats the scannable files in two folders", () => {
    deepEqual(
      gatherInitialSources(
        ["test/extract/__mocks__/ts", "test/extract/__mocks__/coffee"],
        EMPTYOPTIONS,
      ).map(pathToPosix),
      [
        "test/extract/__mocks__/coffee/index.coffee",
        "test/extract/__mocks__/coffee/javascriptThing.js",
        "test/extract/__mocks__/coffee/sub/index.coffee",
        "test/extract/__mocks__/coffee/sub/kaching.litcoffee",
        "test/extract/__mocks__/coffee/sub/willBeReExported.coffee.md",
        "test/extract/__mocks__/ts/index.ts",
        "test/extract/__mocks__/ts/javascriptThing.js",
        "test/extract/__mocks__/ts/sub/index.ts",
        "test/extract/__mocks__/ts/sub/kaching.ts",
        "test/extract/__mocks__/ts/sub/willBeReExported.ts",
      ],
    );
  });

  it("expands and concats the scannable files in two folders + a separate file", () => {
    deepEqual(
      gatherInitialSources(
        [
          "test/extract/__mocks__/ts",
          "test/extract/__mocks__/es6/imports-and-exports.js",
          "test/extract/__mocks__/coffee",
        ],
        EMPTYOPTIONS,
      ).map(pathToPosix),
      [
        "test/extract/__mocks__/coffee/index.coffee",
        "test/extract/__mocks__/coffee/javascriptThing.js",
        "test/extract/__mocks__/coffee/sub/index.coffee",
        "test/extract/__mocks__/coffee/sub/kaching.litcoffee",
        "test/extract/__mocks__/coffee/sub/willBeReExported.coffee.md",
        "test/extract/__mocks__/es6/imports-and-exports.js",
        "test/extract/__mocks__/ts/index.ts",
        "test/extract/__mocks__/ts/javascriptThing.js",
        "test/extract/__mocks__/ts/sub/index.ts",
        "test/extract/__mocks__/ts/sub/kaching.ts",
        "test/extract/__mocks__/ts/sub/willBeReExported.ts",
      ],
    );
  });

  it("filters the 'excluded' pattern from the collection", () => {
    deepEqual(
      gatherInitialSources(
        [
          "test/extract/__mocks__/ts",
          "test/extract/__mocks__/es6/imports-and-exports.js",
          "test/extract/__mocks__/coffee",
        ],
        { exclude: { path: "dex" } },
      ).map(pathToPosix),
      [
        "test/extract/__mocks__/coffee/javascriptThing.js",
        "test/extract/__mocks__/coffee/sub/kaching.litcoffee",
        "test/extract/__mocks__/coffee/sub/willBeReExported.coffee.md",
        "test/extract/__mocks__/es6/imports-and-exports.js",
        "test/extract/__mocks__/ts/javascriptThing.js",
        "test/extract/__mocks__/ts/sub/kaching.ts",
        "test/extract/__mocks__/ts/sub/willBeReExported.ts",
      ],
    );
  });

  it("filters the 'excluded' pattern from the collection - regexp", () => {
    deepEqual(
      gatherInitialSources(["test/extract/__mocks__/ts"], {
        exclude: { path: "^[a-z]+$" },
      }).map(pathToPosix),
      [
        "test/extract/__mocks__/ts/index.ts",
        "test/extract/__mocks__/ts/javascriptThing.js",
        "test/extract/__mocks__/ts/sub/index.ts",
        "test/extract/__mocks__/ts/sub/kaching.ts",
        "test/extract/__mocks__/ts/sub/willBeReExported.ts",
      ],
    );
  });

  it("expands glob patterns (**/*.js)", () => {
    deepEqual(
      gatherInitialSources(
        ["test/extract/__mocks__/gather-globbing/packages/**/*.js"],
        EMPTYOPTIONS,
      ).map(pathToPosix),
      [
        "test/extract/__mocks__/gather-globbing/packages/baldr/spec/bow.spec.js",
        "test/extract/__mocks__/gather-globbing/packages/baldr/spec/index.spec.js",
        "test/extract/__mocks__/gather-globbing/packages/baldr/src/bow.js",
        "test/extract/__mocks__/gather-globbing/packages/baldr/src/index.js",
        "test/extract/__mocks__/gather-globbing/packages/freyja/index.js",
        "test/extract/__mocks__/gather-globbing/packages/loki/script/hots.js",
        "test/extract/__mocks__/gather-globbing/packages/odin/src/deep/ly.js",
        "test/extract/__mocks__/gather-globbing/packages/odin/src/deep/ly.spec.js",
        "test/extract/__mocks__/gather-globbing/packages/odin/src/deep/ly/index.js",
        "test/extract/__mocks__/gather-globbing/packages/odin/src/deep/ly/nested.js",
        "test/extract/__mocks__/gather-globbing/packages/odin/test/index.spec.js",
      ],
    );
  });

  it("expands glob patterns (**/src/**/*.js)", () => {
    deepEqual(
      gatherInitialSources(
        ["test/extract/__mocks__/gather-globbing/**/src/**/*.js"],
        EMPTYOPTIONS,
      ).map(pathToPosix),
      [
        "test/extract/__mocks__/gather-globbing/packages/baldr/src/bow.js",
        "test/extract/__mocks__/gather-globbing/packages/baldr/src/index.js",
        "test/extract/__mocks__/gather-globbing/packages/odin/src/deep/ly.js",
        "test/extract/__mocks__/gather-globbing/packages/odin/src/deep/ly.spec.js",
        "test/extract/__mocks__/gather-globbing/packages/odin/src/deep/ly/index.js",
        "test/extract/__mocks__/gather-globbing/packages/odin/src/deep/ly/nested.js",
      ],
    );
  });

  it("filters out the stuff in the exclude pattern", () => {
    deepEqual(
      gatherInitialSources(["test/extract/__mocks__/gather-globbing/**/src"], {
        exclude: { path: "/deep/ly/" },
      }).map(pathToPosix),
      [
        "test/extract/__mocks__/gather-globbing/packages/baldr/src/bow.js",
        "test/extract/__mocks__/gather-globbing/packages/baldr/src/index.js",
        "test/extract/__mocks__/gather-globbing/packages/baldr/src/typo.ts",
        "test/extract/__mocks__/gather-globbing/packages/loki/src/fake/nothing.to.see.here.ts",
        "test/extract/__mocks__/gather-globbing/packages/loki/src/index.spec.ts",
        "test/extract/__mocks__/gather-globbing/packages/loki/src/index.ts",
        "test/extract/__mocks__/gather-globbing/packages/odin/src/deep/ly.js",
        "test/extract/__mocks__/gather-globbing/packages/odin/src/deep/ly.spec.js",
      ],
    );
  });

  it("filters out the stuff in the doNotFollow pattern", () => {
    deepEqual(
      gatherInitialSources(["test/extract/__mocks__/gather-globbing/**/src"], {
        doNotFollow: { path: "/deep/ly/" },
      }).map(pathToPosix),
      [
        "test/extract/__mocks__/gather-globbing/packages/baldr/src/bow.js",
        "test/extract/__mocks__/gather-globbing/packages/baldr/src/index.js",
        "test/extract/__mocks__/gather-globbing/packages/baldr/src/typo.ts",
        "test/extract/__mocks__/gather-globbing/packages/loki/src/fake/nothing.to.see.here.ts",
        "test/extract/__mocks__/gather-globbing/packages/loki/src/index.spec.ts",
        "test/extract/__mocks__/gather-globbing/packages/loki/src/index.ts",
        "test/extract/__mocks__/gather-globbing/packages/odin/src/deep/ly.js",
        "test/extract/__mocks__/gather-globbing/packages/odin/src/deep/ly.spec.js",
      ],
    );
  });

  it("only gathers stuff in the includeOnly pattern", () => {
    deepEqual(
      gatherInitialSources(
        ["test/extract/__mocks__/gather-globbing/packages"],
        {
          includeOnly: { path: "/loki/" },
        },
      ).map(pathToPosix),
      [
        "test/extract/__mocks__/gather-globbing/packages/loki/index.ts",
        "test/extract/__mocks__/gather-globbing/packages/loki/script/hots.js",
        "test/extract/__mocks__/gather-globbing/packages/loki/src/fake/nothing.to.see.here.ts",
        "test/extract/__mocks__/gather-globbing/packages/loki/src/index.spec.ts",
        "test/extract/__mocks__/gather-globbing/packages/loki/src/index.ts",
      ],
    );
  });

  it("also gathers files with extensions in the extra extensions to scan array", () => {
    deepEqual(
      gatherInitialSources(["test/extract/__mocks__/extra-extensions"], {
        extraExtensionsToScan: [".ratm", ".yolo"],
      }).map(pathToPosix),
      [
        "test/extract/__mocks__/extra-extensions/gathered.ratm",
        "test/extract/__mocks__/extra-extensions/in-the-name-of.ratm",
        "test/extract/__mocks__/extra-extensions/innocent-javascript.js",
        "test/extract/__mocks__/extra-extensions/not-parsed-when-in-extra-extensions.yolo",
      ],
    );
  });

  it("heeds the baseDir for regular folder paths", () => {
    deepEqual(
      gatherInitialSources(
        ["ly/"],
        normalizeCruiseOptions({
          baseDir:
            "test/extract/__mocks__/gather-globbing/packages/odin/src/deep",
        }),
      ).map(pathToPosix),
      ["ly/index.js", "ly/nested.js"],
    );
  });

  it("heeds the baseDir for regular files", () => {
    deepEqual(
      gatherInitialSources(
        ["ly.js", "ly.spec.js"],
        normalizeCruiseOptions({
          baseDir:
            "test/extract/__mocks__/gather-globbing/packages/odin/src/deep",
        }),
      ).map(pathToPosix),
      ["ly.js", "ly.spec.js"],
    );
  });

  it("heeds the baseDir for globs", () => {
    deepEqual(
      gatherInitialSources(
        ["**/src/**/*.js"],
        normalizeCruiseOptions({
          baseDir: "test/extract/__mocks__/gather-globbing",
        }),
      ).map(pathToPosix),
      [
        "packages/baldr/src/bow.js",
        "packages/baldr/src/index.js",
        "packages/odin/src/deep/ly.js",
        "packages/odin/src/deep/ly.spec.js",
        "packages/odin/src/deep/ly/index.js",
        "packages/odin/src/deep/ly/nested.js",
      ],
    );
  });

  it("filters invalid symlinks", () => {
    equal(
      lstatSync(
        "./test/extract/__mocks__/invalid-symlink/index.js",
      ).isSymbolicLink(),
      true,
    );
    deepEqual(
      gatherInitialSources(["test/extract/__mocks__/invalid-symlink"]),
      [],
    );
  });
});
