import { expect } from "chai";
import summarizeFolders from "../../src/enrich/summarize/summarize-folders.js";

const FIXTURE_WITHOUT_VIOLATIONS = [
  {
    name: "src",
    dependencies: [],
    dependents: [
      {
        name: "bin",
      },
    ],
    moduleCount: 165,
    afferentCouplings: 10,
    efferentCouplings: 0,
    instability: 0,
  },
  {
    name: "src/enrich",
    dependencies: [
      {
        name: "src/validate",
        instability: 0.625,
        valid: true,
      },
      {
        name: "src/graph-utl",
        instability: 0,
        valid: true,
      },
      {
        name: "src/utl",
        instability: 0,
        valid: true,
      },
    ],
    dependents: [
      {
        name: "src/main",
      },
    ],
    moduleCount: 25,
    afferentCouplings: 2,
    efferentCouplings: 11,
    instability: 0.8461538461538461,
  },
];
const FIXTURE_WITH_VIOLATION = [
  {
    name: "src",
    dependencies: [],
    dependents: [
      {
        name: "bin",
      },
    ],
    moduleCount: 165,
    afferentCouplings: 10,
    efferentCouplings: 0,
    instability: 0,
  },
  {
    name: "src/cli",
    dependencies: [
      {
        name: "src/config-utl",
        instability: 0.4444444444444444,
        valid: true,
      },
      {
        name: "src/main",
        instability: 0.7894736842105263,
        valid: false,
        rules: [
          {
            severity: "info",
            name: "sdp-folder-level",
          },
          {
            severity: "info",
            name: "non-sdp-rule",
          },
        ],
      },
      {
        name: "src/utl",
        instability: 0,
        valid: true,
      },
      {
        name: "src",
        instability: 0,
        valid: true,
      },
      {
        name: "src/config-utl/extract-depcruise-config",
        instability: 0.6666666666666666,
        valid: true,
      },
    ],
    dependents: [
      {
        name: "bin",
      },
    ],
    moduleCount: 23,
    afferentCouplings: 7,
    efferentCouplings: 14,
    instability: 0.6666666666666666,
  },
];

const SDP_RULE_SET = {
  forbidden: [
    {
      name: "sdp-folder-level",
      from: {},
      to: {
        moreUnstable: true,
      },
    },
    {
      name: "non-sdp-rule",
      from: {},
      to: {},
    },
  ],
};

describe("[I] enrich/summarize/summarize-folders", () => {
  it("returns an empty array when presented with an empty array of folders", () => {
    expect(summarizeFolders([], SDP_RULE_SET)).to.deep.equal([]);
  });

  it("returns an empty array when presented with an array of folders that have no violations on them", () => {
    expect(
      summarizeFolders(FIXTURE_WITHOUT_VIOLATIONS, SDP_RULE_SET)
    ).to.deep.equal([]);
  });

  it("returns a summary of the violations when presented with an array of folders with violations", () => {
    expect(
      summarizeFolders(FIXTURE_WITH_VIOLATION, SDP_RULE_SET)
    ).to.deep.equal([
      {
        type: "instability",
        from: "src/cli",
        to: "src/main",
        rule: {
          name: "sdp-folder-level",
          severity: "info",
        },
        metrics: {
          from: {
            instability: 0.6666666666666666,
          },
          to: {
            instability: 0.7894736842105263,
          },
        },
      },
      {
        type: "folder",
        from: "src/cli",
        to: "src/main",
        rule: {
          name: "non-sdp-rule",
          severity: "info",
        },
      },
    ]);
  });
});
