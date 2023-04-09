import { expect } from "chai";
import violatesRequiredRule from "../../src/validate/violates-required-rule.mjs";

const SIMPLE_RULE = {
  module: {
    path: "controllers/[^/]+/.+-controller\\.ts$",
  },
  to: {
    path: "controllers/base-controller\\.ts$",
  },
};

const GROUP_MATCHING_RULE = {
  comment: "spec files should depend on the module they're testing",
  // note that a rule that goes the other way 'round (each file in src has at
  // least one associated spec file) could potentially be _super_ useful
  module: {
    path: "test/(.+)(\\.spec)\\.js$",
  },
  to: {
    path: "src/$1.js$",
  },
};
describe("[I] validate/violates-required-rule", () => {
  it("does not violate when the module does not match", () => {
    expect(
      violatesRequiredRule(SIMPLE_RULE, { source: "does not match" })
    ).to.equal(false);
  });

  it("violates when the module matches and there's no dependencies", () => {
    expect(
      violatesRequiredRule(SIMPLE_RULE, {
        source: "controllers/sprockets/fred-controller.ts",
        dependencies: [],
      })
    ).to.equal(true);
  });

  it("violates when the module matches and there's no matching dependencies", () => {
    expect(
      violatesRequiredRule(SIMPLE_RULE, {
        source: "controllers/sprockets/fred-controller.ts",
        dependencies: [
          {
            resolved: "path",
            module: "path",
          },
        ],
      })
    ).to.equal(true);
  });

  it("passes when the module matches and there's a matching dependency", () => {
    expect(
      violatesRequiredRule(SIMPLE_RULE, {
        source: "controllers/sprockets/fred-controller.ts",
        dependencies: [
          {
            resolved: "src/controllers/base-controller.ts",
            module: "../base-controller.ts",
          },
        ],
      })
    ).to.equal(false);
  });

  it("violates when the module matches and there's no matching dependency (group matching)", () => {
    expect(
      violatesRequiredRule(GROUP_MATCHING_RULE, {
        source: "test/simsalabim.spec.js",
        dependencies: [
          {
            resolved: "src/hocuspocus.js",
            module: "~/src/hocuspocus.js",
          },
        ],
      })
    ).to.equal(true);
  });

  it("violates when the module matches and there's no dependencies (group matching)", () => {
    expect(
      violatesRequiredRule(GROUP_MATCHING_RULE, {
        source: "test/simsalabim.spec.js",
        dependencies: [],
      })
    ).to.equal(true);
  });

  it("passes when the module matches and there's no matching dependency (group matching)", () => {
    expect(
      violatesRequiredRule(GROUP_MATCHING_RULE, {
        source: "test/simsalabim.spec.js",
        dependencies: [
          {
            resolved: "src/hocuspocus.js",
            module: "~/src/hocuspocus.js",
          },
          {
            resolved: "src/simsalabim.js",
            module: "~/src/simsalabim.js",
          },
        ],
      })
    ).to.equal(false);
  });
});
