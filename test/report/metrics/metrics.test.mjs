/* eslint-disable security/detect-non-literal-regexp */
/* eslint-disable no-regex-spaces */
import { EOL } from "node:os";
import { doesNotMatch, match, strictEqual } from "node:assert";
import { describe, it } from "node:test";
import metrics from "../../../src/report/metrics.mjs";
import cruiseResultWithMetricsForModulesAndFolders from "./__mocks/cruise-result-with-metrics-for-modules-and-folders.mjs";

describe("[I] report/metrics", () => {
  it("errors when the input doesn't contain a 'folders' section", () => {
    const lResult = metrics({ modules: [] });

    strictEqual(lResult.exitCode, 1);
    match(lResult.output, /ERROR/);
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

    strictEqual(lResult.exitCode, 0);
    match(lResult.output, /src       1      1      1    50%/);
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

    strictEqual(lResult.exitCode, 0);
    doesNotMatch(lResult.output, /src       1      1      1    50%/);
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

    strictEqual(lResult.exitCode, 0);
    match(
      lResult.output,
      new RegExp(
        `src/mies.js      1      1      1    50%${EOL}src/aap.js       1      1      3    25%${EOL}src/noot.js`
      )
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

    strictEqual(lResult.exitCode, 0);
    match(
      lResult.output,
      new RegExp(
        `src/aap.js       1      1      3    25%${EOL}src/mies.js      1      1      1    50%${EOL}src/noot.js`
      )
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

    strictEqual(lResult.exitCode, 0);
    doesNotMatch(
      lResult.output,
      new RegExp(
        `src/mies.js      1      1      1     50%${EOL}src/aap.js       1      1      3     25%${EOL}src/noot.js`
      )
    );
  });

  it("ignores folders for which we can't calculate metrics (e.g. because they were in donotfollow)", () => {
    const lResult = metrics(cruiseResultWithMetricsForModulesAndFolders, {
      hideModules: true,
    });

    strictEqual(lResult.exitCode, 0);
    match(lResult.output, /src\/report/);
    doesNotMatch(lResult.output, /node_modules/);
  });
});
