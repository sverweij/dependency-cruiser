import { join } from "node:path";
import { unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";
import symlinkDir from "symlink-dir";
import { expect } from "chai";
import normalizeResolveOptions from "../../src/main/resolve-options/normalize.mjs";
import { normalizeCruiseOptions } from "../../src/main/options/normalize.mjs";
import { createRequireJSON } from "../backwards.utl.mjs";
import getDependencies from "../../src/extract/get-dependencies.mjs";
import { runFixture } from "./run-get-dependencies-fixture.utl.mjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const requireJSON = createRequireJSON(import.meta.url);

const amdFixtures = requireJSON("./__fixtures__/amd.json");
const amdBangRequirejs = requireJSON("./__fixtures__/amd-bang-requirejs.json");
const amdBangCJSWrapper = requireJSON(
  "./__fixtures__/amd-bang-CJSWrapper.json"
);

let symlinkDirectory = join(__dirname, "__mocks__", "symlinked");

/* eslint-disable mocha/no-top-level-hooks */
before((pCallback) => {
  symlinkDir(
    join(__dirname, "__mocks__", "symlinkTarget"),
    symlinkDirectory
  ).then(
    () => pCallback(),
    (pError) => pCallback(pError)
  );
});

after(() => {
  try {
    unlinkSync(symlinkDirectory);
  } catch (pError) {
    // just swallow the error, there's nothing we can do about it
  }
});

describe("[I] extract/getDependencies - AMD - ", () => {
  amdFixtures.forEach((pFixture) => runFixture(pFixture, "acorn"));
  // amdFixtures.forEach((pFixture) => runFixture(pFixture, "swc"));
  // amdFixtures.forEach((pFixture) => runFixture(pFixture, "tsc"));
});
describe("[I] extract/getDependencies - AMD - with bangs", () => {
  it("splits extracts the module part of the plugin + module - regular requirejs", async () => {
    const lOptions = normalizeCruiseOptions({ moduleSystems: ["amd"] });
    const lResolveOptions = await normalizeResolveOptions(
      { bustTheCache: true },
      lOptions
    );

    expect(
      getDependencies(
        "test/extract/__mocks__/amd-bangs/root_one.js",
        lOptions,
        lResolveOptions
      )
    ).to.deep.equal(amdBangRequirejs);
  });

  it("splits bang!./blabla into bang and ./blabla - CommonJS wrapper", async () => {
    const lOptions = normalizeCruiseOptions({ moduleSystems: ["amd"] });
    const lResolveOptions = await normalizeResolveOptions(
      { bustTheCache: true },
      lOptions
    );

    expect(
      getDependencies(
        "test/extract/__mocks__/amd-bangs/simplified-commonjs-wrapper.js",
        lOptions,
        lResolveOptions
      )
    ).to.deep.equal(amdBangCJSWrapper);
  });
});
