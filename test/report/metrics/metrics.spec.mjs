/* eslint-disable security/detect-non-literal-regexp */
/* eslint-disable no-regex-spaces */
import { EOL } from "node:os";
import { doesNotMatch, match, equal } from "node:assert/strict";
import cruiseResultWithMetricsForModulesAndFolders from "./__mocks/cruise-result-with-metrics-for-modules-and-folders.mjs";
import metrics from "#report/metrics.mjs";

describe("[I] report/metrics", () => {
  it("errors when the input doesn't contain a 'folders' section", () => {
    const lResult = metrics({ modules: [] });

    equal(lResult.exitCode, 1);
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

    equal(lResult.exitCode, 0);
    match(lResult.output, /folder  src        1      1      1    50%/);
  });

  it("emits folder metrics and experimental stats when they're in the input", () => {
    const lResult = metrics({
      modules: [],
      folders: [
        {
          name: "src",
          moduleCount: 1,
          afferentCouplings: 1,
          efferentCouplings: 1,
          instability: 0.5,
          experimentalStats: {
            size: 100,
            topLevelStatementCount: 300,
          },
        },
      ],
    });

    equal(lResult.exitCode, 0);
    match(
      lResult.output,
      /folder  src        1      1      1    50%         100    300/,
    );
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
      { hideFolders: true },
    );

    equal(lResult.exitCode, 0);
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

    equal(lResult.exitCode, 0);
    match(
      lResult.output,
      new RegExp(
        `module  src/mies.js       1      1      1    50%${EOL}module  src/aap.js        1      1      3    25%${EOL}module  src/noot.js`,
      ),
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
      { orderBy: "name" },
    );

    equal(lResult.exitCode, 0);
    match(
      lResult.output,
      new RegExp(
        `module  src/aap.js        1      1      3    25%${EOL}module  src/mies.js       1      1      1    50%${EOL}module  src/noot.js`,
      ),
    );
  });

  it("emits module metrics (sorted by size, where size is not available)", () => {
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
      { orderBy: "size" },
    );

    equal(lResult.exitCode, 0);
    match(
      lResult.output,
      new RegExp(
        `module  src/aap.js        1      1      3    25%${EOL}module  src/mies.js       1      1      1    50%${EOL}module  src/noot.js`,
      ),
    );
  });

  it("emits module metrics + experimental stats when they're in the input", () => {
    const lResult = metrics(
      {
        modules: [
          {
            source: "src/noot.js",
            dependencies: [],
            dependents: ["two"],
            instability: 0,
            experimentalStats: {
              size: 1,
              topLevelStatementCount: 3,
            },
          },
          {
            source: "src/aap.js",
            dependencies: ["one", "two", "three"],
            dependents: ["four"],
            instability: 0.25,
            experimentalStats: {
              size: 10,
              topLevelStatementCount: 30,
            },
          },
          {
            source: "src/mies.js",
            dependencies: ["one"],
            dependents: ["two"],
            instability: 0.5,
            experimentalStats: {
              size: 100,
              topLevelStatementCount: 300,
            },
          },
        ],
        folders: [],
      },
      { orderBy: "name" },
    );

    equal(lResult.exitCode, 0);
    match(
      lResult.output,
      new RegExp(
        `module  src/aap.js        1      1      3    25%          10     30${EOL}module  src/mies.js       1      1      1    50%         100    300${EOL}module  src/noot.js`,
      ),
    );
  });

  it("emits module metrics + experimental stats when they're in the input & doesn't barf when one of them isn't a number", () => {
    const lResult = metrics(
      {
        modules: [
          {
            source: "src/noot.js",
            dependencies: [],
            dependents: ["two"],
            instability: 0,
            experimentalStats: {
              size: 1,
              topLevelStatementCount: 3,
            },
          },
          {
            source: "src/aap.js",
            dependencies: ["one", "two", "three"],
            dependents: ["four"],
            instability: 0.25,
            experimentalStats: {
              size: null,
              topLevelStatementCount: 30,
            },
          },
          {
            source: "src/mies.js",
            dependencies: ["one"],
            dependents: ["two"],
            instability: 0.5,
            experimentalStats: {
              size: 100,
              topLevelStatementCount: 300,
            },
          },
        ],
        folders: [],
      },
      { orderBy: "name" },
    );

    equal(lResult.exitCode, 0);
    match(
      lResult.output,
      new RegExp(
        `module  src/aap.js        1      1      3    25%                 30${EOL}module  src/mies.js       1      1      1    50%         100    300${EOL}module  src/noot.js`,
      ),
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
      { hideModules: true },
    );

    equal(lResult.exitCode, 0);
    doesNotMatch(
      lResult.output,
      new RegExp(
        `src/mies.js      1      1      1     50%${EOL}src/aap.js       1      1      3     25%${EOL}src/noot.js`,
      ),
    );
  });

  it("ignores folders for which we can't calculate metrics (e.g. because they were in donotfollow)", () => {
    const lResult = metrics(cruiseResultWithMetricsForModulesAndFolders, {
      hideModules: true,
    });

    equal(lResult.exitCode, 0);
    match(lResult.output, /src\/report/);
    doesNotMatch(lResult.output, /node_modules/);
  });
});
