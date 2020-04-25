const expect = require("chai").expect;
const normalize = require("../../../src/main/rule-set/normalize");

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
});
