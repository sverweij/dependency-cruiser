import { expect } from "chai";
import validate from "../../src/validate/index.mjs";
import parseRuleSet from "./parse-ruleset.utl.mjs";

describe("[I] validate/index dependency - cycle via", () => {
  const lCycleViaRuleSet = parseRuleSet({
    forbidden: [
      {
        from: {},
        to: {
          circular: true,
          via: "^tmp/ab\\.js$",
        },
      },
    ],
  });

  it("a => ba => bb => bc => a doesn't get flagged when none of them is in a via", () => {
    expect(
      validate.dependency(
        lCycleViaRuleSet,
        { source: "tmp/a.js" },
        {
          resolved: "tmp/ba.js",
          circular: true,
          cycle: ["tmp/ba.js", "tmp/bb.js", "tmp/bc.js", "tmp/a.js"],
        }
      )
    ).to.deep.equal({
      valid: true,
    });
  });

  it("a => aa => ab => ac => a get flagged when one of them is in a via", () => {
    expect(
      validate.dependency(
        lCycleViaRuleSet,
        { source: "tmp/a.js" },
        {
          resolved: "tmp/aa.js",
          circular: true,
          cycle: ["tmp/aa.js", "tmp/ab.js", "tmp/ac.js", "tmp/a.js"],
        }
      )
    ).to.deep.equal({
      valid: false,
      rules: [{ name: "unnamed", severity: "warn" }],
    });
  });

  it("a => aa => ab => ac => a get flagged when all of them are in a via", () => {
    const lRuleSet = parseRuleSet({
      forbidden: [
        {
          from: {},
          to: {
            circular: true,
            via: "^tmp/[^.]+\\.js$",
          },
        },
      ],
    });
    expect(
      validate.dependency(
        lRuleSet,
        { source: "tmp/a.js" },
        {
          resolved: "tmp/aa.js",
          circular: true,
          cycle: ["tmp/aa.js", "tmp/ab.js", "tmp/ac.js", "tmp/a.js"],
        }
      )
    ).to.deep.equal({
      valid: false,
      rules: [{ name: "unnamed", severity: "warn" }],
    });
  });
});

describe("[I] validate/index dependency - cycle via - with group matching", () => {
  const lCycleViaRuleSet = parseRuleSet({
    forbidden: [
      {
        from: {
          path: "^([^/]+)",
        },
        to: {
          circular: true,
          via: "^$1/ab\\.js$",
        },
      },
    ],
  });

  it("a => ba => bb => bc => a doesn't get flagged when none of them is in a via", () => {
    expect(
      validate.dependency(
        lCycleViaRuleSet,
        { source: "tmp/a.js" },
        {
          resolved: "tmp/ba.js",
          circular: true,
          cycle: ["tmp/ba.js", "tmp/bb.js", "tmp/bc.js", "tmp/a.js"],
        }
      )
    ).to.deep.equal({
      valid: true,
    });
  });

  it("a => ba => bb => bc => a doesn't get flagged when none of them is in a via (group match)", () => {
    expect(
      validate.dependency(
        lCycleViaRuleSet,
        { source: "tmp/a.js" },
        {
          resolved: "tmp/ba.js",
          circular: true,
          cycle: ["tmp/ba.js", "not-tmp/ab.js", "tmp/bc.js", "tmp/a.js"],
        }
      )
    ).to.deep.equal({
      valid: true,
    });
  });

  it("a => aa => ab => ac => a get flagged when one of them is in a via", () => {
    expect(
      validate.dependency(
        lCycleViaRuleSet,
        { source: "tmp/a.js" },
        {
          resolved: "tmp/aa.js",
          circular: true,
          cycle: ["tmp/aa.js", "tmp/ab.js", "tmp/ac.js", "tmp/a.js"],
        }
      )
    ).to.deep.equal({
      valid: false,
      rules: [{ name: "unnamed", severity: "warn" }],
    });
  });

  it("a => aa => ab => ac => a get flagged when all of them are in a via", () => {
    const lRuleSet = parseRuleSet({
      forbidden: [
        {
          from: {},
          to: {
            circular: true,
            via: "^tmp/[^.]+\\.js$",
          },
        },
      ],
    });
    expect(
      validate.dependency(
        lRuleSet,
        { source: "tmp/a.js" },
        {
          resolved: "tmp/aa.js",
          circular: true,
          cycle: ["tmp/aa.js", "tmp/ab.js", "tmp/ac.js", "tmp/a.js"],
        }
      )
    ).to.deep.equal({
      valid: false,
      rules: [{ name: "unnamed", severity: "warn" }],
    });
  });
});

describe("[I] validate/index dependency - cycle viaOnly", () => {
  const lCycleViaRuleSet = parseRuleSet({
    forbidden: [
      {
        from: {},
        to: {
          circular: true,
          viaOnly: "^tmp/ab\\.js$",
        },
      },
    ],
  });

  it("a => ba => bb => bc => a doesn't get flagged when the cycle doesn't go via the viaOnly", () => {
    expect(
      validate.dependency(
        lCycleViaRuleSet,
        { source: "tmp/a.js" },
        {
          resolved: "tmp/ba.js",
          circular: true,
          cycle: ["tmp/ba.js", "tmp/bb.js", "tmp/bc.js", "tmp/a.js"],
        }
      )
    ).to.deep.equal({
      valid: true,
    });
  });

  it("a => aa => ab => ac => does not get flagged when only some of them are not in the viaOnly", () => {
    expect(
      validate.dependency(
        lCycleViaRuleSet,
        { source: "tmp/a.js" },
        {
          resolved: "tmp/aa.js",
          circular: true,
          cycle: ["tmp/aa.js", "tmp/ab.js", "tmp/ac.js", "tmp/a.js"],
        }
      )
    ).to.deep.equal({
      valid: true,
    });
  });

  it("a => ab a gets flagged becaue all of the via's in the cycle are in the viaOnly", () => {
    expect(
      validate.dependency(
        lCycleViaRuleSet,
        { source: "tmp/a.js" },
        {
          resolved: "tmp/aa.js",
          circular: true,
          cycle: ["tmp/ab.js", "tmp/a.js"],
        }
      )
    ).to.deep.equal({
      valid: true,
    });
  });

  it("a => aa => ab => ac => a get flagged when all of them are in a viaOnly", () => {
    const lRuleSet = parseRuleSet({
      forbidden: [
        {
          from: {},
          to: {
            circular: true,
            via: "^tmp/[^.]+\\.js$",
          },
        },
      ],
    });
    expect(
      validate.dependency(
        lRuleSet,
        { source: "tmp/a.js" },
        {
          resolved: "tmp/aa.js",
          circular: true,
          cycle: ["tmp/aa.js", "tmp/ab.js", "tmp/ac.js", "tmp/a.js"],
        }
      )
    ).to.deep.equal({
      valid: false,
      rules: [{ name: "unnamed", severity: "warn" }],
    });
  });
});
describe("[I] validate/index dependency - cycle viaOnly - with group matching", () => {
  const lCycleViaRuleSet = parseRuleSet({
    forbidden: [
      {
        from: {
          path: "^([^/]+)/.+",
        },
        to: {
          circular: true,
          viaOnly: "^($1)/ab\\.js$",
        },
      },
    ],
  });

  it("a => ba => bb => bc => a doesn't get flagged when the cycle doesn't go via the viaOnly", () => {
    expect(
      validate.dependency(
        lCycleViaRuleSet,
        { source: "tmp/a.js" },
        {
          resolved: "tmp/ba.js",
          circular: true,
          cycle: ["tmp/ba.js", "tmp/bb.js", "tmp/bc.js", "tmp/a.js"],
        }
      )
    ).to.deep.equal({
      valid: true,
    });
  });

  it("a => aa => ab => ac => does not get flagged when only some of them are not in the viaOnly", () => {
    expect(
      validate.dependency(
        lCycleViaRuleSet,
        { source: "tmp/a.js" },
        {
          resolved: "tmp/aa.js",
          circular: true,
          cycle: ["tmp/aa.js", "tmp/ab.js", "tmp/ac.js", "tmp/a.js"],
        }
      )
    ).to.deep.equal({
      valid: true,
    });
  });

  it("a => ab a gets flagged becaue all of the via's in the cycle are in the viaOnly", () => {
    expect(
      validate.dependency(
        lCycleViaRuleSet,
        { source: "tmp/a.js" },
        {
          resolved: "tmp/aa.js",
          circular: true,
          cycle: ["tmp/ab.js", "tmp/a.js"],
        }
      )
    ).to.deep.equal({
      valid: true,
    });
  });

  it("a => aa => ab => ac => a get flagged when all of them are in a viaOnly", () => {
    const lRuleSet = parseRuleSet({
      forbidden: [
        {
          from: {},
          to: {
            circular: true,
            viaOnly: "^tmp/[^.]+\\.js$",
          },
        },
      ],
    });
    expect(
      validate.dependency(
        lRuleSet,
        { source: "tmp/a.js" },
        {
          resolved: "tmp/aa.js",
          circular: true,
          cycle: ["tmp/aa.js", "tmp/ab.js", "tmp/ac.js", "tmp/a.js"],
        }
      )
    ).to.deep.equal({
      valid: false,
      rules: [{ name: "unnamed", severity: "warn" }],
    });
  });
  it("a => aa => ab => ac => a get flagged when all of them are in a viaOnly presented as an array", () => {
    const lRuleSet = parseRuleSet({
      forbidden: [
        {
          from: {},
          to: {
            circular: true,
            viaOnly: ["somethingelse", "^tmp/[^.]+\\.js$"],
          },
        },
      ],
    });
    expect(
      validate.dependency(
        lRuleSet,
        { source: "tmp/a.js" },
        {
          resolved: "tmp/aa.js",
          circular: true,
          cycle: ["tmp/aa.js", "tmp/ab.js", "tmp/ac.js", "tmp/a.js"],
        }
      )
    ).to.deep.equal({
      valid: false,
      rules: [{ name: "unnamed", severity: "warn" }],
    });
  });
});
