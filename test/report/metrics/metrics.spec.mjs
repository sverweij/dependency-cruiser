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
    expect(lResult.output).to.contain("src     1     1     1  0.5");
  });
});
