import { join } from "node:path";
import { unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";
import symlinkDir from "symlink-dir";
import { expect } from "chai";
import normalizeResolveOptions from "../../src/main/resolve-options/normalize.js";
import { normalizeCruiseOptions } from "../../src/main/options/normalize.js";
import { createRequireJSON } from "../backwards.utl.mjs";
import getDependencies from "../../src/extract/get-dependencies.js";
import { runFixture } from "./run-get-dependencies-fixture.utl.mjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const requireJSON = createRequireJSON(import.meta.url);

const amdFixtures = requireJSON("./fixtures/amd.json");
const amdBangRequirejs = requireJSON("./fixtures/amd-bang-requirejs.json");
const amdBangCJSWrapper = requireJSON("./fixtures/amd-bang-CJSWrapper.json");

let symlinkDirectory = join(__dirname, "fixtures", "symlinked");

/* eslint-disable mocha/no-top-level-hooks */
before((pCallback) => {
  symlinkDir(
    join(__dirname, "fixtures", "symlinkTarget"),
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

describe("extract/getDependencies - AMD - ", () => {
  amdFixtures.forEach((pFixture) => runFixture(pFixture, "acorn"));
  // amdFixtures.forEach((pFixture) => runFixture(pFixture, "swc"));
  // amdFixtures.forEach((pFixture) => runFixture(pFixture, "tsc"));
});
describe("extract/getDependencies - AMD - with bangs", () => {
  it("splits extracts the module part of the plugin + module - regular requirejs", () => {
    const lOptions = normalizeCruiseOptions({ moduleSystems: ["amd"] });
    const lResolveOptions = normalizeResolveOptions(
      { bustTheCache: true },
      lOptions
    );

    expect(
      getDependencies(
        "test/extract/fixtures/amd-bangs/root_one.js",
        lOptions,
        lResolveOptions
      )
    ).to.deep.equal(amdBangRequirejs);
  });

  it("splits bang!./blabla into bang and ./blabla - CommonJS wrapper", () => {
    const lOptions = normalizeCruiseOptions({ moduleSystems: ["amd"] });
    const lResolveOptions = normalizeResolveOptions(
      { bustTheCache: true },
      lOptions
    );

    expect(
      getDependencies(
        "test/extract/fixtures/amd-bangs/simplified-commonjs-wrapper.js",
        lOptions,
        lResolveOptions
      )
    ).to.deep.equal(amdBangCJSWrapper);
  });
});
