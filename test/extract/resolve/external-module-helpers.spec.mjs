import { ok, strictEqual } from "node:assert";
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
  normalizeCruiseOptions({}),
);
const RESOLVE_OPTIONS_HEEDING_EXPORTS = await normalizeResolveOptions(
  { exportsFields: ["exports"], conditionNames: ["require", "imports"] },
  normalizeCruiseOptions({}),
);
describe("[U] extract/resolve/externalModuleHelpers.getPackageJson", () => {
  beforeEach(() => {
    clearCaches();
  });
  it("returns null if the module does not exist", () => {
    strictEqual(
      getPackageJson(
        "./module-does-not-exist",
        process.cwd(),
        BASIC_RESOLVE_OPTIONS,
      ),
      null,
    );
  });

  it("returns null if there's no package.json for the module (no basePath specified)", () => {
    strictEqual(
      getPackageJson(
        "test/extract/fixtures/deprecated-node-module/require-something-deprecated",
        process.cwd(),
        BASIC_RESOLVE_OPTIONS,
      ),
      null,
    );
  });

  it("returns null if there's no package.json for the module (basePath specified)", () => {
    strictEqual(
      getPackageJson(
        "./require-something-deprecated",
        "./fixtures/deprecated-node-module/",
        BASIC_RESOLVE_OPTIONS,
      ),
      null,
    );
  });

  it("returns a package.json when there is one (root)", () => {
    let lPackageJson = getPackageJson(
      "acorn",
      process.cwd(),
      BASIC_RESOLVE_OPTIONS,
    );

    ok(lPackageJson);
    strictEqual(lPackageJson.hasOwnProperty("name"), true);
    strictEqual(lPackageJson.name, "acorn");
  });

  it("returns a package.json when there is one (root) - base dir defaults to current working dir", () => {
    let lPackageJson = getPackageJson("acorn", null, BASIC_RESOLVE_OPTIONS);

    ok(lPackageJson);
    strictEqual(lPackageJson.hasOwnProperty("name"), true);
    strictEqual(lPackageJson.name, "acorn");
  });

  it("returns a package.json when there is one ('local' node_modules)", () => {
    let lPackageJson = getPackageJson(
      "deprecated-at-the-start-for-test-purposes",
      "./test/extract/resolve/__mocks__/deprecated-node-module/",
      BASIC_RESOLVE_OPTIONS,
    );

    ok(lPackageJson);
    strictEqual(lPackageJson.hasOwnProperty("name"), true);
    strictEqual(lPackageJson.name, "deprecated-at-the-start-for-test-purposes");
  });

  it("returns a package.json even when it's not specified in the node modules exports and the regular resolver is supposed to heed those exports", () => {
    let lPackageJson = getPackageJson(
      "testinga-two",
      "./test/extract/resolve/__mocks__/unreadable-package-json-because-not-exported",
      RESOLVE_OPTIONS_HEEDING_EXPORTS,
    );

    ok(lPackageJson);
    strictEqual(lPackageJson.hasOwnProperty("name"), true);
    strictEqual(lPackageJson.description, "testinga 2");
  });
});

describe("[U] extract/resolve/externalModuleHelpers.getPackageRoot", () => {
  it("returns undefined if called without parameters", () => {
    strictEqual(typeof getPackageRoot(), "undefined");
  });

  it("returns null if called with null", () => {
    strictEqual(getPackageRoot(null), null);
  });

  it("locals unchanged: './localThing' => './localThing'", () => {
    strictEqual(getPackageRoot("./localThing"), "./localThing");
  });

  it("returns the module name unchanged if called with a module name without a '/'", () => {
    strictEqual(getPackageRoot("lodash"), "lodash");
  });

  it("returns the 'root' of the name when called with a module name with a '/'", () => {
    strictEqual(getPackageRoot("lodash/fp"), "lodash");
  });

  it("@scoped/bla => @scoped/bla", () => {
    strictEqual(getPackageRoot("@scoped/bla"), "@scoped/bla");
  });

  it("@scoped/bla/subthing => @scoped/bla", () => {
    strictEqual(
      getPackageRoot("@scoped/bla/subthing/sub/bla.json"),
      "@scoped/bla",
    );
  });

  it("@scoped => @scoped (note: weird edge case - shouldn't occur)", () => {
    strictEqual(getPackageRoot("@scoped"), "@scoped");
  });
});

describe("[U] extract/resolve/externalModuleHelpers.getLicense", () => {
  it("returns '' if the module does not exist", () => {
    strictEqual(
      getLicense("this-module-does-not-exist", ".", BASIC_RESOLVE_OPTIONS),
      "",
    );
  });

  it("returns '' if the module does exist but has no associated package.json", () => {
    strictEqual(
      getLicense(
        "./test/extract/resolve/fixtures/no-package-json",
        ".",
        BASIC_RESOLVE_OPTIONS,
      ),
      "",
    );
  });

  it("returns '' if the module does exist, has a package.json, but no license field", () => {
    strictEqual(
      getLicense(
        "no-license",
        "./test/extract/resolve/fixtures/licenses/",
        BASIC_RESOLVE_OPTIONS,
      ),
      "",
    );
  });

  it("returns '' if the module exists, has a package.json, and a license field that is a boolean", () => {
    strictEqual(
      getLicense(
        "boolean-license",
        "./test/extract/resolve/fixtures/licenses/",
        BASIC_RESOLVE_OPTIONS,
      ),
      "",
    );
  });

  it("returns '' if the module exists, has a package.json, and a license field that is an object", () => {
    strictEqual(
      getLicense(
        "object-license",
        "./test/extract/resolve/fixtures/licenses/",
        BASIC_RESOLVE_OPTIONS,
      ),
      "",
    );
  });

  it("returns '' package.json has a licenses field that is an array (and no license field)", () => {
    strictEqual(
      getLicense(
        "array-licenses",
        "./test/extract/resolve/fixtures/licenses/",
        BASIC_RESOLVE_OPTIONS,
      ),
      "",
    );
  });

  it("returns the license if the module exists, has a package.json, and a string license field", () => {
    strictEqual(
      getLicense(
        "GPL-license",
        "./test/extract/resolve/__mocks__/licenses/",
        BASIC_RESOLVE_OPTIONS,
      ),
      "GPL-3.0",
    );
  });
});

describe("[U] extract/resolve/externalModuleHelpers.dependencyIsDeprecated", () => {
  it("returns false if the module does not exist", () => {
    strictEqual(
      dependencyIsDeprecated(
        "this-module-does-not-exist",
        ".",
        BASIC_RESOLVE_OPTIONS,
      ),
      false,
    );
  });
});

/* eslint no-unused-expressions: 0 */
