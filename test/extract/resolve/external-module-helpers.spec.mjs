import { expect } from "chai";
import has from "lodash/has.js";
import clearCaches from "../../../src/extract/clear-caches.mjs";
import {
  getPackageJson,
  getPackageRoot,
  getLicense,
  dependencyIsDeprecated,
} from "../../../src/extract/resolve/external-module-helpers.mjs";
import normalizeResolveOptions from "../../../src/main/resolve-options/normalize.mjs";
import { normalizeCruiseOptions } from "../../../src/main/options/normalize.mjs";

const BASIC_RESOLVE_OPTIONS = await normalizeResolveOptions(
  {},
  normalizeCruiseOptions({})
);
const RESOLVE_OPTIONS_HEEDING_EXPORTS = await normalizeResolveOptions(
  { exportsFields: ["exports"], conditionNames: ["require", "imports"] },
  normalizeCruiseOptions({})
);
describe("[U] extract/resolve/externalModuleHelpers.getPackageJson", () => {
  beforeEach(() => {
    clearCaches();
  });
  it("returns null if the module does not exist", () => {
    expect(
      getPackageJson(
        "./module-does-not-exist",
        process.cwd(),
        BASIC_RESOLVE_OPTIONS
      )
    ).to.be.null;
  });

  it("returns null if there's no package.json for the module (no basePath specified)", () => {
    expect(
      getPackageJson(
        "test/extract/fixtures/deprecated-node-module/require-something-deprecated",
        process.cwd(),
        BASIC_RESOLVE_OPTIONS
      )
    ).to.be.null;
  });

  it("returns null if there's no package.json for the module (basePath specified)", () => {
    expect(
      getPackageJson(
        "./require-something-deprecated",
        "./fixtures/deprecated-node-module/",
        BASIC_RESOLVE_OPTIONS
      )
    ).to.be.null;
  });

  it("returns a package.json when there is one (root)", () => {
    let lPackageJson = getPackageJson(
      "chai",
      process.cwd(),
      BASIC_RESOLVE_OPTIONS
    );

    expect(lPackageJson).to.be.not.null;
    expect(has(lPackageJson, "name")).to.be.true;
    expect(lPackageJson.name).to.equal("chai");
  });

  it("returns a package.json when there is one (root) - base dir defaults to current working dir", () => {
    let lPackageJson = getPackageJson("chai", null, BASIC_RESOLVE_OPTIONS);

    expect(lPackageJson).to.be.not.null;
    expect(has(lPackageJson, "name")).to.be.true;
    expect(lPackageJson.name).to.equal("chai");
  });

  it("returns a package.json when there is one ('local' node_modules)", () => {
    let lPackageJson = getPackageJson(
      "deprecated-at-the-start-for-test-purposes",
      "./test/extract/resolve/__mocks__/deprecated-node-module/",
      BASIC_RESOLVE_OPTIONS
    );

    expect(lPackageJson).to.be.not.null;
    expect(has(lPackageJson, "name")).to.be.true;
    expect(lPackageJson.name).to.equal(
      "deprecated-at-the-start-for-test-purposes"
    );
  });

  it("returns a package.json even when it's not specified in the node modules exports and the regular resolver is supposed to heed those exports", () => {
    let lPackageJson = getPackageJson(
      "testinga-two",
      "./test/extract/resolve/__mocks__/unreadable-package-json-because-not-exported",
      RESOLVE_OPTIONS_HEEDING_EXPORTS
    );

    expect(lPackageJson).to.be.not.null;
    expect(has(lPackageJson, "name")).to.be.true;
    expect(lPackageJson.description).to.equal("testinga 2");
  });
});

describe("[U] extract/resolve/externalModuleHelpers.getPackageRoot", () => {
  it("returns undefined if called without parameters", () => {
    expect(typeof getPackageRoot()).to.equal("undefined");
  });

  it("returns null if called with null", () => {
    expect(getPackageRoot(null)).to.equal(null);
  });

  it("locals unchanged: './localThing' => './localThing'", () => {
    expect(getPackageRoot("./localThing")).to.equal("./localThing");
  });

  it("returns the module name unchanged if called with a module name without a '/'", () => {
    expect(getPackageRoot("lodash")).to.equal("lodash");
  });

  it("returns the 'root' of the name when called with a module name with a '/'", () => {
    expect(getPackageRoot("lodash/fp")).to.equal("lodash");
  });

  it("@scoped/bla => @scoped/bla", () => {
    expect(getPackageRoot("@scoped/bla")).to.equal("@scoped/bla");
  });

  it("@scoped/bla/subthing => @scoped/bla", () => {
    expect(getPackageRoot("@scoped/bla/subthing/sub/bla.json")).to.equal(
      "@scoped/bla"
    );
  });

  it("@scoped => @scoped (note: weird edge case - shouldn't occur)", () => {
    expect(getPackageRoot("@scoped")).to.equal("@scoped");
  });
});

describe("[U] extract/resolve/externalModuleHelpers.getLicense", () => {
  it("returns '' if the module does not exist", () => {
    expect(
      getLicense("this-module-does-not-exist", ".", BASIC_RESOLVE_OPTIONS)
    ).to.equal("");
  });

  it("returns '' if the module does exist but has no associated package.json", () => {
    expect(
      getLicense(
        "./test/extract/resolve/fixtures/no-package-json",
        ".",
        BASIC_RESOLVE_OPTIONS
      )
    ).to.equal("");
  });

  it("returns '' if the module does exist, has a package.json, but no license field", () => {
    expect(
      getLicense(
        "no-license",
        "./test/extract/resolve/fixtures/licenses/",
        BASIC_RESOLVE_OPTIONS
      )
    ).to.equal("");
  });

  it("returns '' if the module exists, has a package.json, and a license field that is a boolean", () => {
    expect(
      getLicense(
        "boolean-license",
        "./test/extract/resolve/fixtures/licenses/",
        BASIC_RESOLVE_OPTIONS
      )
    ).to.equal("");
  });

  it("returns '' if the module exists, has a package.json, and a license field that is an object", () => {
    expect(
      getLicense(
        "object-license",
        "./test/extract/resolve/fixtures/licenses/",
        BASIC_RESOLVE_OPTIONS
      )
    ).to.equal("");
  });

  it("returns '' package.json has a licenses field that is an array (and no license field)", () => {
    expect(
      getLicense(
        "array-licenses",
        "./test/extract/resolve/fixtures/licenses/",
        BASIC_RESOLVE_OPTIONS
      )
    ).to.equal("");
  });

  it("returns the license if the module exists, has a package.json, and a string license field", () => {
    expect(
      getLicense(
        "GPL-license",
        "./test/extract/resolve/__mocks__/licenses/",
        BASIC_RESOLVE_OPTIONS
      )
    ).to.equal("GPL-3.0");
  });
});

describe("[U] extract/resolve/externalModuleHelpers.dependencyIsDeprecated", () => {
  it("returns false if the module does not exist", () => {
    expect(
      dependencyIsDeprecated(
        "this-module-does-not-exist",
        ".",
        BASIC_RESOLVE_OPTIONS
      )
    ).to.equal(false);
  });
});

/* eslint no-unused-expressions: 0 */
