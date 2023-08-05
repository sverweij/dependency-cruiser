import { strictEqual } from "node:assert";
import { describe, it } from "node:test";
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
    strictEqual(
      violatesRequiredRule(SIMPLE_RULE, { source: "does not match" }),
      false
    );
  });

  it("violates when the module matches and there's no dependencies", () => {
    strictEqual(
      violatesRequiredRule(SIMPLE_RULE, {
        source: "controllers/sprockets/fred-controller.ts",
        dependencies: [],
      }),
      true
    );
  });

  it("violates when the module matches and there's no matching dependencies", () => {
    strictEqual(
      violatesRequiredRule(SIMPLE_RULE, {
        source: "controllers/sprockets/fred-controller.ts",
        dependencies: [
          {
            resolved: "path",
            module: "path",
          },
        ],
      }),
      true
    );
  });

  it("passes when the module matches and there's a matching dependency", () => {
    strictEqual(
      violatesRequiredRule(SIMPLE_RULE, {
        source: "controllers/sprockets/fred-controller.ts",
        dependencies: [
          {
            resolved: "src/controllers/base-controller.ts",
            module: "../base-controller.ts",
          },
        ],
      }),
      false
    );
  });

  it("violates when the module matches and there's no matching dependency (group matching)", () => {
    strictEqual(
      violatesRequiredRule(GROUP_MATCHING_RULE, {
        source: "test/simsalabim.spec.js",
        dependencies: [
          {
            resolved: "src/hocuspocus.js",
            module: "~/src/hocuspocus.js",
          },
        ],
      }),
      true
    );
  });

  it("violates when the module matches and there's no dependencies (group matching)", () => {
    strictEqual(
      violatesRequiredRule(GROUP_MATCHING_RULE, {
        source: "test/simsalabim.spec.js",
        dependencies: [],
      }),
      true
    );
  });

  it("passes when the module matches and there's no matching dependency (group matching)", () => {
    strictEqual(
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
      }),
      false
    );
  });
});
