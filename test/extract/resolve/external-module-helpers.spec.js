const { expect } = require("chai");
const _has = require("lodash/has");
const clearCaches = require("../../../src/extract/clear-caches");
const externalModuleHelpers = require("../../../src/extract/resolve/external-module-helpers");
const normalizeResolveOptions = require("../../../src/main/resolve-options/normalize");
const {
  normalizeCruiseOptions,
} = require("../../../src/main/options/normalize");

const BASIC_RESOLVE_OPTIONS = normalizeResolveOptions(
  {},
  normalizeCruiseOptions({})
);
const RESOLVE_OPTIONS_HEEDING_EXPORTS = normalizeResolveOptions(
  { exportsFields: ["exports"], conditionNames: ["require", "imports"] },
  normalizeCruiseOptions({})
);
describe("extract/resolve/externalModuleHelpers.getPackageJson", () => {
  beforeEach(() => {
    clearCaches();
  });
  it("returns null if the module does not exist", () => {
    expect(
      externalModuleHelpers.getPackageJson(
        "./module-does-not-exist",
        process.cwd(),
        BASIC_RESOLVE_OPTIONS
      )
    ).to.be.null;
  });

  it("returns null if there's no package.json for the module (no basePath specified)", () => {
    expect(
      externalModuleHelpers.getPackageJson(
        "test/extract/fixtures/deprecated-node-module/require-something-deprecated",
        process.cwd(),
        BASIC_RESOLVE_OPTIONS
      )
    ).to.be.null;
  });

  it("returns null if there's no package.json for the module (basePath specified)", () => {
    expect(
      externalModuleHelpers.getPackageJson(
        "./require-something-deprecated",
        "./fixtures/deprecated-node-module/",
        BASIC_RESOLVE_OPTIONS
      )
    ).to.be.null;
  });

  it("returns a package.json when there is one (root)", () => {
    let lPackageJson = externalModuleHelpers.getPackageJson(
      "chai",
      process.cwd(),
      BASIC_RESOLVE_OPTIONS
    );

    expect(lPackageJson).to.be.not.null;
    expect(_has(lPackageJson, "name")).to.be.true;
    expect(lPackageJson.name).to.equal("chai");
  });

  it("returns a package.json when there is one ('local' node_modules)", () => {
    let lPackageJson = externalModuleHelpers.getPackageJson(
      "deprecated-at-the-start-for-test-purposes",
      "./test/main/fixtures/cruise-reporterless/deprecated-node-module/",
      BASIC_RESOLVE_OPTIONS
    );

    expect(lPackageJson).to.be.not.null;
    expect(_has(lPackageJson, "name")).to.be.true;
    expect(lPackageJson.name).to.equal(
      "deprecated-at-the-start-for-test-purposes"
    );
  });

  it("returns a package.json even when it's not specified in the node modules exports and the regular resolver is supposed to heed those exports", () => {
    let lPackageJson = externalModuleHelpers.getPackageJson(
      "testinga-two",
      "./test/extract/resolve/fixtures/unreadable-package-json-because-not-exported",
      RESOLVE_OPTIONS_HEEDING_EXPORTS
    );

    expect(lPackageJson).to.be.not.null;
    expect(_has(lPackageJson, "name")).to.be.true;
    expect(lPackageJson.description).to.equal("testinga 2");
  });
});

describe("extract/resolve/externalModuleHelpers.getPackageRoot", () => {
  it("returns undefined if called without parameters", () => {
    //  deepcode ignore MissingArgument: we're testing exactly this behavior
    expect(typeof externalModuleHelpers.getPackageRoot()).to.equal("undefined");
  });

  it("returns null if called with null", () => {
    expect(externalModuleHelpers.getPackageRoot(null)).to.equal(null);
  });

  it("locals unchanged: './localThing' => './localThing'", () => {
    expect(externalModuleHelpers.getPackageRoot("./localThing")).to.equal(
      "./localThing"
    );
  });

  it("returns the module name unchanged if called with a module name without a '/'", () => {
    expect(externalModuleHelpers.getPackageRoot("lodash")).to.equal("lodash");
  });

  it("returns the 'root' of the name when called with a module name with a '/'", () => {
    expect(externalModuleHelpers.getPackageRoot("lodash/fp")).to.equal(
      "lodash"
    );
  });

  it("@scoped/bla => @scoped/bla", () => {
    expect(externalModuleHelpers.getPackageRoot("@scoped/bla")).to.equal(
      "@scoped/bla"
    );
  });

  it("@scoped/bla/subthing => @scoped/bla", () => {
    expect(
      externalModuleHelpers.getPackageRoot("@scoped/bla/subthing/sub/bla.json")
    ).to.equal("@scoped/bla");
  });

  it("@scoped => @scoped (note: weird edge case - shouldn't occur)", () => {
    expect(externalModuleHelpers.getPackageRoot("@scoped")).to.equal("@scoped");
  });
});

describe("extract/resolve/externalModuleHelpers.getLicense", () => {
  it("returns '' if the module does not exist", () => {
    expect(
      externalModuleHelpers.getLicense(
        "this-module-does-not-exist",
        ".",
        BASIC_RESOLVE_OPTIONS
      )
    ).to.equal("");
  });

  it("returns '' if the module does exist but has no associated package.json", () => {
    expect(
      externalModuleHelpers.getLicense(
        "./test/extract/resolve/fixtures/no-package-json",
        ".",
        BASIC_RESOLVE_OPTIONS
      )
    ).to.equal("");
  });

  it("returns '' if the module does exist, has a package.json, but no license field", () => {
    expect(
      externalModuleHelpers.getLicense(
        "no-license",
        "./test/extract/resolve/fixtures/licenses/",
        BASIC_RESOLVE_OPTIONS
      )
    ).to.equal("");
  });

  it("returns '' if the module exists, has a package.json, and a license field that is a boolean", () => {
    expect(
      externalModuleHelpers.getLicense(
        "boolean-license",
        "./test/extract/resolve/fixtures/licenses/",
        BASIC_RESOLVE_OPTIONS
      )
    ).to.equal("");
  });

  it("returns '' if the module exists, has a package.json, and a license field that is an object", () => {
    expect(
      externalModuleHelpers.getLicense(
        "object-license",
        "./test/extract/resolve/fixtures/licenses/",
        BASIC_RESOLVE_OPTIONS
      )
    ).to.equal("");
  });

  it("returns '' package.json has a licenses field that is an array (and no license field)", () => {
    expect(
      externalModuleHelpers.getLicense(
        "array-licenses",
        "./test/extract/resolve/fixtures/licenses/",
        BASIC_RESOLVE_OPTIONS
      )
    ).to.equal("");
  });

  it("returns the license if the module exists, has a package.json, and a string license field", () => {
    expect(
      externalModuleHelpers.getLicense(
        "GPL-license",
        "./test/extract/resolve/fixtures/licenses/",
        BASIC_RESOLVE_OPTIONS
      )
    ).to.equal("GPL-3.0");
  });
});

describe("extract/resolve/externalModuleHelpers.dependencyIsDeprecated", () => {
  it("returns false if the module does not exist", () => {
    expect(
      externalModuleHelpers.dependencyIsDeprecated(
        "this-module-does-not-exist",
        ".",
        BASIC_RESOLVE_OPTIONS
      )
    ).to.equal(false);
  });
});

/* eslint no-unused-expressions: 0 */
