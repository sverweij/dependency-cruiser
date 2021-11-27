import { expect } from "chai";

import getStabilityMetrics from "../../../../src/enrich/derive/metrics/get-stability-metrics.js";

describe("enrich/derive/metrics/get-stability-metrics - folder stability metrics derivation", () => {
  it("no modules no metrics", () => {
    expect(getStabilityMetrics([])).to.deep.equal([]);
  });

  it("no dependencies no dependents", () => {
    expect(
      getStabilityMetrics([
        { source: "src/folder/index.js", dependencies: [], dependents: [] },
      ])
    ).to.deep.equal([
      {
        name: "src",
        moduleCount: 1,
        dependents: [],
        dependencies: [],
        afferentCouplings: 0,
        efferentCouplings: 0,
        instability: 0,
      },
      {
        name: "src/folder",
        moduleCount: 1,
        dependents: [],
        dependencies: [],
        afferentCouplings: 0,
        efferentCouplings: 0,
        instability: 0,
      },
    ]);
  });

  it("dependencies no dependents", () => {
    expect(
      getStabilityMetrics([
        {
          source: "src/folder/index.js",
          dependencies: [{ resolved: "src/other-folder/utensil.js" }],
          dependents: [],
        },
      ])
    ).to.deep.equal([
      {
        name: "src/folder",
        moduleCount: 1,
        dependents: [],
        dependencies: ["src/other-folder"],
        afferentCouplings: 0,
        efferentCouplings: 1,
        instability: 1,
      },
      {
        name: "src",
        moduleCount: 1,
        dependents: [],
        dependencies: [],
        afferentCouplings: 0,
        efferentCouplings: 0,
        instability: 0,
      },
    ]);
  });

  it("no dependencies but dependents", () => {
    expect(
      getStabilityMetrics([
        {
          source: "src/folder/index.js",
          dependencies: [],
          dependents: ["src/other-folder/utensil.js"],
        },
      ])
    ).to.deep.equal([
      {
        name: "src",
        moduleCount: 1,
        dependents: [],
        dependencies: [],
        afferentCouplings: 0,
        efferentCouplings: 0,
        instability: 0,
      },
      {
        name: "src/folder",
        moduleCount: 1,
        dependents: ["src/other-folder"],
        dependencies: [],
        afferentCouplings: 1,
        efferentCouplings: 0,
        instability: 0,
      },
    ]);
  });

  it("handling core modules", () => {
    expect(
      getStabilityMetrics([
        {
          source: "src/index.js",
          dependencies: [{ resolved: "fs" }],
          dependents: [],
        },
      ])
    ).to.deep.equal([
      {
        name: "src",
        moduleCount: 1,
        dependents: [],
        dependencies: ["fs"],
        afferentCouplings: 0,
        efferentCouplings: 1,
        instability: 1,
      },
    ]);
  });
});
