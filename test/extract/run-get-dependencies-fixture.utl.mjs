import { deepEqual } from "node:assert/strict";
import { normalizeCruiseOptions } from "#main/options/normalize.mjs";
import normalizeResolveOptions from "#main/resolve-options/normalize.mjs";
import getDependencies from "#extract/get-dependencies.mjs";

/* eslint-disable mocha/no-exports */
export function runFixture(pFixture, pParser = "acorn") {
  const lOptions = {
    parser: pParser,
  };

  if (pFixture.input.baseDir) {
    lOptions.baseDir = pFixture.input.baseDir;
  }
  if (pFixture.input.moduleSystems) {
    lOptions.moduleSystems = pFixture.input.moduleSystems;
  }
  if (typeof pFixture.input.preserveSymlinks !== "undefined") {
    lOptions.preserveSymlinks = pFixture.input.preserveSymlinks;
  }

  it(`${pFixture.title} (with '${pParser}' as parser)`, async () => {
    deepEqual(
      getDependencies(
        pFixture.input.fileName,
        normalizeCruiseOptions(lOptions),
        await normalizeResolveOptions(
          { bustTheCache: true, resolveLicenses: true },
          normalizeCruiseOptions(lOptions),
        ),
      ),
      pFixture.expected,
    );
  });
}
