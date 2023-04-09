import { EOL } from "node:os";
import { expect } from "chai";
import metrics from "../../../src/report/metrics.mjs";
import cruiseResultWithMetricsForModulesAndFolders from "./__mocks/cruise-result-with-metrics-for-modules-and-folders.mjs";

describe("[I] report/metrics", () => {
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
    expect(lResult.output).to.contain("src       1      1      1    50%");
  });

  it("does not emit folder metrics when asked to hide them", () => {
    const lResult = metrics(
      {
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
      },
      { hideFolders: true }
    );

    expect(lResult.exitCode).to.equal(0);
    expect(lResult.output).to.not.contain("src       1      1      1    50%");
  });

  it("emits module metrics (sorted by instability by default)", () => {
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
      `src/mies.js      1      1      1    50%${EOL}src/aap.js       1      1      3    25%${EOL}src/noot.js`
    );
  });

  it("emits module metrics (sorted by name)", () => {
    const lResult = metrics(
      {
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
      },
      { orderBy: "name" }
    );

    expect(lResult.exitCode).to.equal(0);
    expect(lResult.output).to.contain(
      `src/aap.js       1      1      3    25%${EOL}src/mies.js      1      1      1    50%${EOL}src/noot.js`
    );
  });

  it("emits no module metrics when asked to hide them", () => {
    const lResult = metrics(
      {
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
      },
      { hideModules: true }
    );

    expect(lResult.exitCode).to.equal(0);
    expect(lResult.output).to.not.contain(
      `src/mies.js      1      1      1     50%${EOL}src/aap.js       1      1      3     25%${EOL}src/noot.js`
    );
  });

  it("ignores folders for which we can't calculate metrics (e.g. because they were in donotfollow)", () => {
    const lResult = metrics(cruiseResultWithMetricsForModulesAndFolders, {
      hideModules: true,
    });

    expect(lResult.exitCode).to.equal(0);
    expect(lResult.output).to.contain("src");
    expect(lResult.output).to.contain("src/report");
    expect(lResult.output).to.not.contain("node_modules");
  });
});
