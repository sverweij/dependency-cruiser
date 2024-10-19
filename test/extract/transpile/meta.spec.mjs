import { deepEqual } from "node:assert/strict";
import { validRange } from "semver";
import {
  getAvailableTranspilers,
  scannableExtensions,
} from "#extract/transpile/meta.mjs";

describe("[U] extract/transpile/meta", () => {
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
