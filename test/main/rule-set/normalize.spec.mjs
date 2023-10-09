import { deepEqual } from "node:assert/strict";
import normalize from "#main/rule-set/normalize.mjs";

describe("[U] main/rule-set/normalize", () => {
  it("leaves the empty ruleset alone", () => {
    deepEqual(normalize({}), {});
  });

  it("allowed: adds allowedSeverity when it wasn't filled out; adds the 'not-in-allowed' name to the rule", () => {
    deepEqual(
      normalize({
        allowed: [
          {
            from: { path: ".+" },
            to: { path: ".+" },
          },
        ],
      }),
      {
        allowed: [
          {
            name: "not-in-allowed",
            from: { path: ".+" },
            to: { path: ".+" },
          },
        ],
        allowedSeverity: "warn",
      },
    );
  });

  it("allowed: leaves allowedSeverity alone when it wasn't filled; doesn't add severity, but does add name 'not-in-allowed' to the rule", () => {
    deepEqual(
      normalize({
        allowed: [
          {
            from: { path: ".+" },
            to: { path: ".+" },
          },
        ],
        allowedSeverity: "error",
      }),
      {
        allowed: [
          {
            name: "not-in-allowed",
            from: { path: ".+" },
            to: { path: ".+" },
          },
        ],
        allowedSeverity: "error",
      },
    );
  });

  it("corrects the severity to a default when it's not a recognized one", () => {
    deepEqual(
      normalize({
        forbidden: [
          {
            from: { path: ".+" },
            to: { path: ".+" },
            severity: "unrecognized",
            name: "all-ok",
          },
        ],
      }),
      {
        forbidden: [
          {
            scope: "module",
            from: { path: ".+" },
            to: { path: ".+" },
            severity: "warn",
            name: "all-ok",
          },
        ],
      },
    );
  });

  it("keeps the severity if it's a recognized one", () => {
    deepEqual(
      normalize({
        forbidden: [
          {
            from: { path: ".+" },
            to: { path: ".+" },
            severity: "error",
            name: "all-ok",
          },
        ],
      }),
      {
        forbidden: [
          {
            scope: "module",
            from: { path: ".+" },
            to: { path: ".+" },
            severity: "error",
            name: "all-ok",
          },
        ],
      },
    );
  });

  it("also works for 'forbidden' rules", () => {
    deepEqual(
      normalize({
        forbidden: [
          {
            from: { path: ".+" },
            to: { path: ".+" },
            severity: "error",
            name: "all-ok",
            comment: "this comment is kept",
          },
        ],
      }),
      {
        forbidden: [
          {
            scope: "module",
            from: { path: ".+" },
            to: { path: ".+" },
            severity: "error",
            name: "all-ok",
            comment: "this comment is kept",
          },
        ],
      },
    );
  });

  it("filters out forbidden rules with severity 'ignore'", () => {
    deepEqual(
      normalize({
        forbidden: [
          {
            from: { path: ".+" },
            to: { path: ".+" },
            severity: "ignore",
            name: "all-ok",
            comment: "this comment is kept",
          },
        ],
      }),
      {
        forbidden: [],
      },
    );
  });

  it("filters out required rules with severity 'ignore'", () => {
    deepEqual(
      normalize({
        required: [
          {
            from: { path: ".+" },
            to: { path: ".+" },
            severity: "ignore",
            name: "all-ok",
            comment: "this comment is kept",
          },
        ],
      }),
      {
        required: [],
      },
    );
  });

  it("removes the allowed rules & allowedSeverity when allowedSeverity === 'ignore'", () => {
    deepEqual(
      normalize({
        allowed: [
          {
            from: { path: ".+" },
            to: { path: ".+" },
          },
        ],
        allowedSeverity: "ignore",
      }),
      {},
    );
  });

  it("normalizes arrays of re's in paths to regular regular expressions (forbidden)", () => {
    deepEqual(
      normalize({
        forbidden: [
          {
            name: "regularize-regular",
            severity: "warn",
            from: {
              path: ["src", "bin"],
              pathNot: ["src/exceptions", "bin/aural"],
            },
            to: {
              path: ["super/exclusive", "donot/gohere", "norhere"],
              pathNot: ["super/exclusive/this-is-ok-though\\.js", "snorhere"],
            },
          },
        ],
      }),
      {
        forbidden: [
          {
            scope: "module",
            name: "regularize-regular",
            severity: "warn",
            from: {
              path: "src|bin",
              pathNot: "src/exceptions|bin/aural",
            },
            to: {
              path: "super/exclusive|donot/gohere|norhere",
              pathNot: "super/exclusive/this-is-ok-though\\.js|snorhere",
            },
          },
        ],
      },
    );
  });

  it("normalizes arrays of re's in paths to regular regular expressions (required)", () => {
    deepEqual(
      normalize({
        required: [
          {
            name: "regularize-regular",
            severity: "warn",
            from: {
              path: ["src", "bin"],
              pathNot: ["src/exceptions", "bin/aural"],
            },
            to: {
              path: ["super/exclusive", "donot/gohere", "norhere"],
            },
          },
        ],
      }),
      {
        required: [
          {
            scope: "module",
            name: "regularize-regular",
            severity: "warn",
            from: {
              path: "src|bin",
              pathNot: "src/exceptions|bin/aural",
            },
            to: {
              path: "super/exclusive|donot/gohere|norhere",
            },
          },
        ],
      },
    );
  });

  it("normalizes arrays of re's in paths to regular regular expressions (allowed)", () => {
    deepEqual(
      normalize({
        allowed: [
          {
            from: {
              path: ["src", "bin"],
              pathNot: ["src/exceptions", "bin/aural"],
            },
            to: {
              path: ["super/exclusive", "donot/gohere", "norhere"],
              pathNot: ["super/exclusive/this-is-ok-though\\.js", "snorhere"],
            },
          },
        ],
      }),
      {
        allowed: [
          {
            name: "not-in-allowed",
            from: {
              path: "src|bin",
              pathNot: "src/exceptions|bin/aural",
            },
            to: {
              path: "super/exclusive|donot/gohere|norhere",
              pathNot: "super/exclusive/this-is-ok-though\\.js|snorhere",
            },
          },
        ],
        allowedSeverity: "warn",
      },
    );
  });

  it("normalizes arrays of re's in licenses to regular regular expressions", () => {
    deepEqual(
      normalize({
        forbidden: [
          {
            name: "license-thing",
            severity: "warn",
            from: {},
            to: {
              licenseNot: ["MIT", "ISC", "Apache-2\\.0"],
            },
          },
        ],
        allowed: [
          {
            from: {},
            to: {
              license: ["MIT", "ISC", "Apache-2\\.0"],
            },
          },
        ],
      }),
      {
        forbidden: [
          {
            scope: "module",
            name: "license-thing",
            severity: "warn",
            from: {},
            to: {
              licenseNot: "MIT|ISC|Apache-2\\.0",
            },
          },
        ],
        allowed: [
          {
            name: "not-in-allowed",
            from: {},
            to: {
              license: "MIT|ISC|Apache-2\\.0",
            },
          },
        ],
        allowedSeverity: "warn",
      },
    );
  });

  it("normalizes arrays of re's in exoticRequires to regular regular expressions", () => {
    deepEqual(
      normalize({
        forbidden: [
          {
            name: "exotic-require-thing",
            severity: "warn",
            from: {},
            to: {
              exoticRequireNot: ["want", "need", "mustHave"],
            },
          },
        ],
        allowed: [
          {
            from: {},
            to: {
              exoticRequire: ["want", "need", "mustHave"],
            },
          },
        ],
      }),
      {
        forbidden: [
          {
            scope: "module",
            name: "exotic-require-thing",
            severity: "warn",
            from: {},
            to: {
              exoticRequireNot: "want|need|mustHave",
            },
          },
        ],
        allowed: [
          {
            name: "not-in-allowed",
            from: {},
            to: {
              exoticRequire: "want|need|mustHave",
            },
          },
        ],
        allowedSeverity: "warn",
      },
    );
  });
});
