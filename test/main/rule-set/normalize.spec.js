const expect = require("chai").expect;
const normalize = require("~/src/main/rule-set/normalize");

describe("main/rule-set/normalize", () => {
  it("leaves the empty ruleset alone", () => {
    expect(normalize({})).to.deep.equal({});
  });

  it("allowed: adds allowedSeverity when it wasn't filled out; adds the 'not-in-allowed' name to the rule", () => {
    expect(
      normalize({
        allowed: [
          {
            from: ".+",
            to: ".+",
          },
        ],
      })
    ).to.deep.equal({
      allowed: [
        {
          name: "not-in-allowed",
          from: ".+",
          to: ".+",
        },
      ],
      allowedSeverity: "warn",
    });
  });

  it("allowed: leaves allowedSeverity alone when it wasn't filled; doesn't add severity, but does add name 'not-in-allowed' to the rule", () => {
    expect(
      normalize({
        allowed: [
          {
            from: ".+",
            to: ".+",
          },
        ],
        allowedSeverity: "error",
      })
    ).to.deep.equal({
      allowed: [
        {
          name: "not-in-allowed",
          from: ".+",
          to: ".+",
        },
      ],
      allowedSeverity: "error",
    });
  });

  it("corrects the severity to a default when it's not a recognized one", () => {
    expect(
      normalize({
        forbidden: [
          {
            from: ".+",
            to: ".+",
            severity: "unrecognized",
            name: "all-ok",
          },
        ],
      })
    ).to.deep.equal({
      forbidden: [
        {
          from: ".+",
          to: ".+",
          severity: "warn",
          name: "all-ok",
        },
      ],
    });
  });

  it("keeps the severity if it's a recognized one", () => {
    expect(
      normalize({
        forbidden: [
          {
            from: ".+",
            to: ".+",
            severity: "error",
            name: "all-ok",
          },
        ],
      })
    ).to.deep.equal({
      forbidden: [
        {
          from: ".+",
          to: ".+",
          severity: "error",
          name: "all-ok",
        },
      ],
    });
  });

  it("also works for 'forbidden' rules", () => {
    expect(
      normalize({
        forbidden: [
          {
            from: ".+",
            to: ".+",
            severity: "error",
            name: "all-ok",
            comment: "this comment is kept",
          },
        ],
      })
    ).to.deep.equal({
      forbidden: [
        {
          from: ".+",
          to: ".+",
          severity: "error",
          name: "all-ok",
          comment: "this comment is kept",
        },
      ],
    });
  });

  it("filters out forbidden rules with severity 'ignore'", () => {
    expect(
      normalize({
        forbidden: [
          {
            from: ".+",
            to: ".+",
            severity: "ignore",
            name: "all-ok",
            comment: "this comment is kept",
          },
        ],
      })
    ).to.deep.equal({
      forbidden: [],
    });
  });

  it("removes the allowed rules & allowedSeverity when allowedSeverity === 'ignore'", () => {
    expect(
      normalize({
        allowed: [
          {
            from: ".+",
            to: ".+",
          },
        ],
        allowedSeverity: "ignore",
      })
    ).to.deep.equal({});
  });

  it("normalizes arrays of re's in paths to regular regular expressions (forbidden)", () => {
    expect(
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
      })
    ).to.deep.equal({
      forbidden: [
        {
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
    });
  });

  it("normalizes arrays of re's in paths to regular regular expressions (allowed)", () => {
    expect(
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
      })
    ).to.deep.equal({
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
    });
  });

  it("normalizes arrays of re's in licenses to regular regular expressions", () => {
    expect(
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
      })
    ).to.deep.equal({
      forbidden: [
        {
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
    });
  });

  it("normalizes arrays of re's in exoticRequires to regular regular expressions", () => {
    expect(
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
      })
    ).to.deep.equal({
      forbidden: [
        {
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
    });
  });
});
