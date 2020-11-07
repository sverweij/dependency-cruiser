const path = require("path");
const fs = require("fs");
const symlinkDir = require("symlink-dir");
const { expect } = require("chai");
const normalizeResolveOptions = require("../../src/main/resolve-options/normalize");
const { normalizeCruiseOptions } = require("../../src/main/options/normalize");
const getDependencies = require("../../src/extract/get-dependencies");
const cjsFixtures = require("./fixtures/cjs.json");
const es6Fixtures = require("./fixtures/es6.json");
const amdFixtures = require("./fixtures/amd.json");
const tsFixtures = require("./fixtures/ts.json");
const coffeeFixtures = require("./fixtures/coffee.json");

const amdBangRequirejs = require("./fixtures/amd-bang-requirejs.json");
const amdBangCJSWrapper = require("./fixtures/amd-bang-CJSWrapper.json");

let symlinkDirectory = path.join(__dirname, "fixtures", "symlinked");

function runFixture(pFixture) {
  const lOptions = {};

  if (pFixture.input.baseDir) {
    lOptions.baseDir = pFixture.input.baseDir;
  }
  if (pFixture.input.moduleSystems) {
    lOptions.moduleSystems = pFixture.input.moduleSystems;
  }
  if (typeof pFixture.input.preserveSymlinks !== "undefined") {
    lOptions.preserveSymlinks = pFixture.input.preserveSymlinks;
  }

  it(pFixture.title, () => {
    expect(
      getDependencies(
        pFixture.input.fileName,
        normalizeCruiseOptions(lOptions),
        normalizeResolveOptions(
          { bustTheCache: true },
          normalizeCruiseOptions(lOptions)
        )
      )
    ).to.deep.equal(pFixture.expected);
  });
}

/* eslint-disable mocha/no-top-level-hooks */
before((pCallback) => {
  symlinkDir(
    path.join(__dirname, "fixtures", "symlinkTarget"),
    symlinkDirectory
  ).then(
    () => pCallback(),
    (pError) => pCallback(pError)
  );
});

after(() => {
  try {
    fs.unlinkSync(symlinkDirectory);
  } catch (pError) {
    // just swallow the error, there's nothing we can do about it
  }
});

describe("extract/getDependencies - CommonJS - ", () =>
  cjsFixtures.forEach(runFixture));
describe("extract/getDependencies - CommonJS - with bangs", () => {
  it("strips the inline loader prefix from the module name when resolving", () => {
    const lOptions = normalizeCruiseOptions({ moduleSystems: ["cjs"] });
    const lResolveOptions = normalizeResolveOptions(
      { bustTheCache: true },
      lOptions
    );

    expect(
      getDependencies(
        "test/extract/fixtures/cjs-bangs/index.js",
        lOptions,
        lResolveOptions
      )
    ).to.deep.equal([
      {
        resolved: "test/extract/fixtures/cjs-bangs/dependency.js",
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
    ]);
  });

  it("strips multiple inline loader prefixes from the module name when resolving", () => {
    const lOptions = normalizeCruiseOptions({ moduleSystems: ["cjs"] });
    const lResolveOptions = normalizeResolveOptions(
      { bustTheCache: true },
      lOptions
    );

    expect(
      getDependencies(
        "test/extract/fixtures/cjs-multi-bangs/index.js",
        lOptions,
        lResolveOptions
      )
    ).to.deep.equal([
      {
        resolved: "test/extract/fixtures/cjs-multi-bangs/dependency.js",
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
    ]);
  });
});

describe("extract/getDependencies - ES6 - ", () =>
  es6Fixtures.forEach(runFixture));
describe("extract/getDependencies - AMD - ", () =>
  amdFixtures.forEach(runFixture));
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

describe("extract/getDependencies - TypeScript - ", () =>
  tsFixtures.forEach(runFixture));
describe("extract/getDependencies - CoffeeScript - ", () =>
  coffeeFixtures.forEach(runFixture));

describe("extract/getDependencies - Error scenarios - ", () => {
  it("Does not raise an exception on syntax errors (because we're on the loose parser)", () => {
    const lOptions = normalizeCruiseOptions({});
    const lResolveOptions = normalizeResolveOptions(
      { bustTheCache: true },
      lOptions
    );

    expect(() =>
      getDependencies(
        "test/extract/fixtures/syntax-error.js",
        lOptions,
        lResolveOptions
      )
    ).to.not.throw(
      "Extracting dependencies ran afoul of... Unexpected token (1:3)"
    );
  });
  it("Raises an exception on non-existing files", () => {
    expect(() => {
      getDependencies("non-existing-file.md", normalizeCruiseOptions({}), {});
    }).to.throw(
      "Extracting dependencies ran afoul of...\n\n  ENOENT: no such file or directory, open "
    );
  });
});

describe("extract/getDependencies - even when require gets non-string arguments, extract doesn't break", () => {
  const lOptions = normalizeCruiseOptions({});
  const lResolveOptions = normalizeResolveOptions(
    { bustTheCache: true },
    lOptions
  );

  it("Just skips require(481)", () => {
    expect(
      getDependencies(
        "./test/extract/fixtures/cjs-require-non-strings/require-a-number.js",
        lOptions,
        lResolveOptions
      ).length
    ).to.equal(1);
  });

  it("Just skips require(a function)", () => {
    expect(
      getDependencies(
        "./test/extract/fixtures/cjs-require-non-strings/require-a-function.js",
        lOptions,
        lResolveOptions
      ).length
    ).to.equal(1);
  });

  it("Just skips require(an iife)", () => {
    expect(
      getDependencies(
        "./test/extract/fixtures/cjs-require-non-strings/require-an-iife.js",
        normalizeCruiseOptions({}),
        {}
      ).length
    ).to.equal(1);
  });
});

describe("extract/getDependencies - include", () => {
  it("returns no dependencies when the includeOnly pattern is erroneous", () => {
    const lOptions = normalizeCruiseOptions({
      includeOnly: "will-not-match-dependencies-for-this-file",
    });
    const lResolveOptions = normalizeResolveOptions(
      { bustTheCache: true },
      lOptions
    );

    expect(
      getDependencies(
        "./test/extract/fixtures/include/src/index.js",
        lOptions,
        lResolveOptions
      )
    ).to.deep.equal([]);
  });

  it('only includes dependencies matching the passed "includeOnly" (1)', () => {
    const lOptions = normalizeCruiseOptions({ includeOnly: "/src/" });
    const lResolveOptions = normalizeResolveOptions(
      { bustTheCache: true },
      lOptions
    );

    expect(
      getDependencies(
        "./test/extract/fixtures/include/src/index.js",
        lOptions,
        lResolveOptions
      )
    ).to.deep.equal([
      {
        coreModule: false,
        couldNotResolve: false,
        dependencyTypes: ["local"],
        dynamic: false,
        followable: true,
        exoticallyRequired: false,
        matchesDoNotFollow: false,
        module: "./bla",
        moduleSystem: "cjs",
        resolved: "test/extract/fixtures/include/src/bla.js",
      },
    ]);
  });

  it('only includes dependencies matching the passed "includeOnly" (2)', () => {
    const lOptions = normalizeCruiseOptions({ includeOnly: "include" });
    const lResolveOptions = normalizeResolveOptions(
      { bustTheCache: true },
      lOptions
    );

    expect(
      getDependencies(
        "./test/extract/fixtures/include/src/index.js",
        lOptions,
        lResolveOptions
      )
    ).to.deep.equal([
      {
        coreModule: false,
        couldNotResolve: false,
        dependencyTypes: ["local"],
        dynamic: false,
        followable: true,
        exoticallyRequired: false,
        matchesDoNotFollow: false,
        module: "../di",
        moduleSystem: "cjs",
        resolved: "test/extract/fixtures/include/di.js",
      },
      {
        coreModule: false,
        couldNotResolve: false,
        dependencyTypes: ["local"],
        dynamic: false,
        followable: true,
        exoticallyRequired: false,
        matchesDoNotFollow: false,
        module: "./bla",
        moduleSystem: "cjs",
        resolved: "test/extract/fixtures/include/src/bla.js",
      },
    ]);
  });

  it("annotates the exotic require", () => {
    const lOptions = normalizeCruiseOptions({ exoticRequireStrings: ["need"] });
    const lResolveOptions = normalizeResolveOptions(
      { bustTheCache: true },
      lOptions
    );

    expect(
      getDependencies(
        "./test/extract/fixtures/exotic-require/index.js",
        lOptions,
        lResolveOptions
      )
    ).to.deep.equal([
      {
        coreModule: false,
        couldNotResolve: false,
        dependencyTypes: ["local"],
        dynamic: false,
        followable: true,
        exoticallyRequired: true,
        matchesDoNotFollow: false,
        module: "./required-with-need",
        moduleSystem: "cjs",
        exoticRequire: "need",
        resolved: "test/extract/fixtures/exotic-require/required-with-need.js",
      },
    ]);
  });

  it("adds a preCompilationOnly attribute when tsPreCompilationDeps === 'specify'", () => {
    const lOptions = normalizeCruiseOptions({
      tsPreCompilationDeps: "specify",
    });
    const lResolveOptions = normalizeResolveOptions(
      { bustTheCache: true },
      lOptions
    );

    expect(
      getDependencies(
        "./test/extract/fixtures/specifyTsPreCompilationDeps/index.ts",
        lOptions,
        lResolveOptions
      )
    ).to.deep.equal([
      {
        coreModule: false,
        couldNotResolve: false,
        dependencyTypes: ["local"],
        dynamic: false,
        followable: true,
        exoticallyRequired: false,
        matchesDoNotFollow: false,
        module: "./pre-compilation-only",
        moduleSystem: "es6",
        preCompilationOnly: true,
        resolved:
          "test/extract/fixtures/specifyTsPreCompilationDeps/pre-compilation-only.d.ts",
      },
      {
        coreModule: false,
        couldNotResolve: false,
        dependencyTypes: ["local"],
        dynamic: false,
        followable: true,
        exoticallyRequired: false,
        matchesDoNotFollow: false,
        module: "./real-deal",
        moduleSystem: "es6",
        preCompilationOnly: false,
        resolved:
          "test/extract/fixtures/specifyTsPreCompilationDeps/real-deal.ts",
      },
    ]);
  });
});
