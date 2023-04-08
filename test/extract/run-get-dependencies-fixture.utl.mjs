import { expect } from "chai";
import getDependencies from "../../src/extract/get-dependencies.mjs";
import { normalizeCruiseOptions } from "../../src/main/options/normalize.mjs";
import normalizeResolveOptions from "../../src/main/resolve-options/normalize.mjs";

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
    expect(
      getDependencies(
        pFixture.input.fileName,
        normalizeCruiseOptions(lOptions),
        await normalizeResolveOptions(
          { bustTheCache: true, resolveLicenses: true },
          normalizeCruiseOptions(lOptions)
        )
      )
    ).to.deep.equal(pFixture.expected);
  });
}
