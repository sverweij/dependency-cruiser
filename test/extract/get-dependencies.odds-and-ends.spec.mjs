import { expect } from "chai";
import normalizeResolveOptions from "../../src/main/resolve-options/normalize.js";
import { normalizeCruiseOptions } from "../../src/main/options/normalize.js";
import { createRequireJSON } from "../backwards.utl.mjs";
import getDependencies from "../../src/extract/get-dependencies.js";
import { runFixture } from "./run-get-dependencies-fixture.utl.mjs";

const requireJSON = createRequireJSON(import.meta.url);

const coffeeFixtures = requireJSON("./__fixtures__/coffee.json");
const vueFixtures = requireJSON("./__fixtures__/vue.json");

/* eslint-disable mocha/no-top-level-hooks */

describe("[I] extract/getDependencies - Vue with TypeScript - ", () => {
  vueFixtures.forEach((pFixture) => runFixture(pFixture, "tsc"));
});
describe("[I] extract/getDependencies - CoffeeScript - ", () => {
  coffeeFixtures.forEach((pFixture) => runFixture(pFixture));
});

describe("[I] extract/getDependencies - Error scenarios - ", () => {
  it("Does not raise an exception on syntax errors (because we're on the loose parser)", () => {
    const lOptions = normalizeCruiseOptions({});
    const lResolveOptions = normalizeResolveOptions(
      { bustTheCache: true },
      lOptions
    );

    expect(() =>
      getDependencies(
        "test/extract/__mocks__/syntax-error.js",
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

describe("[I] extract/getDependencies - even when require gets non-string arguments, extract doesn't break", () => {
  const lOptions = normalizeCruiseOptions({});
  const lResolveOptions = normalizeResolveOptions(
    { bustTheCache: true },
    lOptions
  );

  it("Just skips require(481)", () => {
    expect(
      getDependencies(
        "./test/extract/__mocks__/cjs-require-non-strings/require-a-number.js",
        lOptions,
        lResolveOptions
      ).length
    ).to.equal(1);
  });

  it("Just skips require(a function)", () => {
    expect(
      getDependencies(
        "./test/extract/__mocks__/cjs-require-non-strings/require-a-function.js",
        lOptions,
        lResolveOptions
      ).length
    ).to.equal(1);
  });

  it("Just skips require(an iife)", () => {
    expect(
      getDependencies(
        "./test/extract/__mocks__/cjs-require-non-strings/require-an-iife.js",
        normalizeCruiseOptions({}),
        {}
      ).length
    ).to.equal(1);
  });
});

describe("[I] extract/getDependencies - include", () => {
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
        "./test/extract/__mocks__/include/src/index.js",
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
        "./test/extract/__mocks__/include/src/index.js",
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
        resolved: "test/extract/__mocks__/include/src/bla.js",
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
        "./test/extract/__mocks__/include/src/index.js",
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
        resolved: "test/extract/__mocks__/include/di.js",
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
        resolved: "test/extract/__mocks__/include/src/bla.js",
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
        "./test/extract/__mocks__/exotic-require/index.js",
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
        resolved: "test/extract/__mocks__/exotic-require/required-with-need.js",
      },
    ]);
  });

  it("does not parse files matching extensions in the extraExtensionsToScan array", () => {
    const lOptions = normalizeCruiseOptions({
      extraExtensionsToScan: [".bentknee", ".yolo"],
    });
    const lResolveOptions = normalizeResolveOptions(
      { bustTheCache: true },
      lOptions
    );

    expect(
      getDependencies(
        "./test/extract/__mocks__/extra-extensions/not-parsed-when-in-extra-extensions.yolo",
        lOptions,
        lResolveOptions
      )
    ).to.deep.equal([]);
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
        "./test/extract/__mocks__/specifyTsPreCompilationDeps/index.ts",
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
          "test/extract/__mocks__/specifyTsPreCompilationDeps/pre-compilation-only.d.ts",
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
          "test/extract/__mocks__/specifyTsPreCompilationDeps/real-deal.ts",
      },
    ]);
  });
});
