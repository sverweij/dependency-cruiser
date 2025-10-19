import { deepEqual } from "node:assert/strict";
import { validRange } from "semver";
import {
  allExtensions,
  getAvailableTranspilers,
  scannableExtensions,
} from "#extract/transpile/meta.mjs";

describe("[U] extract/transpile/meta", () => {
  it("returns all extensions with their availability", () => {
    const lExtensions = allExtensions;
    deepEqual(Array.isArray(lExtensions), true);
    deepEqual(lExtensions.length > 0, true);

    lExtensions.forEach((pExtension) => {
      deepEqual(
        typeof pExtension.extension,
        "string",
        `extension is not a string: ${pExtension.extension}`,
      );
      deepEqual(
        typeof pExtension.available,
        "boolean",
        `available is not a boolean: ${pExtension.available}`,
      );
      deepEqual(
        pExtension.extension.startsWith("."),
        true,
        `extension should start with a dot: ${pExtension.extension}`,
      );
    });
  });

  it("tells which extensions can be scanned", () => {
    deepEqual(scannableExtensions, [
      ".js",
      ".cjs",
      ".mjs",
      ".jsx",
      ".ts",
      ".tsx",
      ".d.ts",
      ".cts",
      ".d.cts",
      ".mts",
      ".d.mts",
      ".vue",
      ".svelte",
      ".coffee",
      ".litcoffee",
      ".coffee.md",
      ".csx",
      ".cjsx",
    ]);
  });

  it("returns the available transpilers", () => {
    const lTranspilers = getAvailableTranspilers();
    deepEqual(Array.isArray(lTranspilers), true);
    deepEqual(lTranspilers.length > 0, true);

    lTranspilers.forEach((pTranspiler) => {
      deepEqual(
        typeof pTranspiler.name,
        "string",
        `name is not a string: ${pTranspiler.name}`,
      );
      deepEqual(
        typeof pTranspiler.version,
        "string",
        `version is not a string: ${pTranspiler.version}`,
      );
      deepEqual(
        validRange(pTranspiler.version),
        pTranspiler.version,
        `version is not a valid semver range: ${pTranspiler.version}`,
      );
      deepEqual(
        typeof pTranspiler.currentVersion,
        "string",
        `version is not a string: ${pTranspiler.version}`,
      );
      deepEqual(
        typeof pTranspiler.available,
        "boolean",
        `available is not a boolean: ${pTranspiler.available}`,
      );
      // eslint-disable-next-line no-magic-numbers
      deepEqual(Object.keys(pTranspiler).length, 4);
    });
  });
});
