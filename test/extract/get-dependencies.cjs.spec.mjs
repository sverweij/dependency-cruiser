import { deepEqual } from "node:assert/strict";
import { join } from "node:path";
import { unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";
import symlinkDir from "symlink-dir";
import { createRequireJSON } from "../backwards.utl.mjs";
import normalizeResolveOptions from "#main/resolve-options/normalize.mjs";
import { normalizeCruiseOptions } from "#main/options/normalize.mjs";
import getDependencies from "#extract/get-dependencies.mjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const requireJSON = createRequireJSON(import.meta.url);

const cjsFixtures = requireJSON("./__fixtures__/cjs.json");

let symlinkDirectory = join(__dirname, "__mocks__", "symlinked");

function runFixture(pFixture, pParser = "acorn") {
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

/* eslint-disable mocha/no-top-level-hooks */
before((pCallback) => {
  symlinkDir(
    join(__dirname, "__mocks__", "symlinkTarget"),
    symlinkDirectory,
  ).then(
    () => pCallback(),
    (pError) => pCallback(pError),
  );
});

after(() => {
  try {
    unlinkSync(symlinkDirectory);
  } catch (pError) {
    // just swallow the error, there's nothing we can do about it
  }
});

describe("[I] extract/getDependencies - CommonJS - ", () => {
  // @TODO feature/adds-more-granularity-to-dependency-types - re-enable acorn & swc when they're implemented
  // cjsFixtures.forEach((pFixture) => runFixture(pFixture, "acorn"));
  // cjsFixtures.forEach((pFixture) => runFixture(pFixture, "swc"));
  cjsFixtures.forEach((pFixture) => runFixture(pFixture, "tsc"));
});

describe("[I] extract/getDependencies - CommonJS - with bangs", () => {
  it("strips the inline loader prefix from the module name when resolving", async () => {
    const lOptions = normalizeCruiseOptions({ moduleSystems: ["cjs"] });
    const lResolveOptions = await normalizeResolveOptions(
      { bustTheCache: true },
      lOptions,
    );

    deepEqual(
      getDependencies(
        "test/extract/__mocks__/cjs-bangs/index.js",
        lOptions,
        lResolveOptions,
      ),
      [
        {
          resolved: "test/extract/__mocks__/cjs-bangs/dependency.js",
          coreModule: false,
          dependencyTypes: ["local"],
          dynamic: false,
          followable: true,
          exoticallyRequired: false,
          matchesDoNotFollow: false,
          couldNotResolve: false,
          module: "ieeeeeeeee!./dependency",
          moduleSystem: "cjs",
        },
      ],
    );
  });

  it("strips multiple inline loader prefixes from the module name when resolving", async () => {
    const lOptions = normalizeCruiseOptions({ moduleSystems: ["cjs"] });
    const lResolveOptions = await normalizeResolveOptions(
      { bustTheCache: true },
      lOptions,
    );

    deepEqual(
      getDependencies(
        "test/extract/__mocks__/cjs-multi-bangs/index.js",
        lOptions,
        lResolveOptions,
      ),
      [
        {
          resolved: "test/extract/__mocks__/cjs-multi-bangs/dependency.js",
          coreModule: false,
          dependencyTypes: ["local"],
          dynamic: false,
          followable: true,
          exoticallyRequired: false,
          matchesDoNotFollow: false,
          couldNotResolve: false,
          module: "!!aap!noot!mies!./dependency",
          moduleSystem: "cjs",
        },
      ],
    );
  });
});
