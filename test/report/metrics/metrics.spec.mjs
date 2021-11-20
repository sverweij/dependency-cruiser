import { EOL } from "node:os";
import { expect } from "chai";
import metrics from "../../../src/report/metrics.js";

describe("report/metrics", () => {
  it("errors when the input doesn't contain a 'folders' section", () => {
    const lResult = metrics({ modules: [] });

    expect(lResult.exitCode).to.equal(1);
    expect(lResult.output).to.contain("ERROR");
  });

  it("emits folder metrics", () => {
    const lResult = metrics({
      modules: [],
      folders: [
        {
          name: "src",
          moduleCount: 1,
          afferentCouplings: 1,
          efferentCouplings: 1,
          instability: 0.5,
        },
      ],
    });

    expect(lResult.exitCode).to.equal(0);
    expect(lResult.output).to.contain("src      1     1     1  0.5");
  });

  it("emits module metrics (sorted)", () => {
    const lResult = metrics({
      modules: [
        {
          source: "src/noot.js",
          dependencies: [],
          dependents: ["two"],
          instability: 0,
        },
        {
          source: "src/aap.js",
          dependencies: ["one", "two", "three"],
          dependents: ["four"],
          instability: 0.25,
        },
        {
          source: "src/mies.js",
          dependencies: ["one"],
          dependents: ["two"],
          instability: 0.5,
        },
      ],
      folders: [],
    });

    expect(lResult.exitCode).to.equal(0);
    expect(lResult.output).to.contain(
      `src/mies.js     1     1     1  0.5 ${EOL}src/aap.js      1     1     3  0.25${EOL}src/noot`
    );
  });
});
