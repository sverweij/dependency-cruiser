import { deepEqual, equal } from "node:assert/strict";

import deriveModuleMetrics from "#analyze/derive/metrics/index.mjs";

describe("[U] analyze/derive/metrics/module - module stability metrics derivation", () => {
  it("doesn't do anything when we're not asking for metrics (metrics nor outputType)", () => {
    deepEqual(deriveModuleMetrics([], {}), []);
  });

  it("emits an instability metric when we're asking for metrics", () => {
    deepEqual(
      deriveModuleMetrics(
        [
          {
            source: "src/hello.js",
            dependencies: [],
            dependents: [],
          },
        ],
        { metrics: true },
      ),
      [
        {
          source: "src/hello.js",
          dependencies: [],
          dependents: [],
          instability: 0,
        },
      ],
    );
  });

  it("emits an instability metric when we're asking for outputType === metrics", () => {
    deepEqual(
      deriveModuleMetrics(
        [
          {
            source: "src/hello.js",
            dependencies: [],
            dependents: [],
          },
        ],
        { metrics: true },
      ),
      [
        {
          source: "src/hello.js",
          dependencies: [],
          dependents: [],
          instability: 0,
        },
      ],
    );
  });

  it("emits an instability metric when we're asking for metrics (only dependents)", () => {
    deepEqual(
      deriveModuleMetrics(
        [
          {
            source: "src/hello.js",
            dependencies: [],
            dependents: ["src/ola.js", "node_modules/shodash/index.js"],
          },
        ],
        { metrics: true },
      ),
      [
        {
          source: "src/hello.js",
          dependencies: [],
          dependents: ["src/ola.js", "node_modules/shodash/index.js"],
          instability: 0,
        },
      ],
    );
  });

  it("emits an instability metric when we're asking for metrics (only dependencies)", () => {
    equal(
      deriveModuleMetrics(
        [
          {
            source: "src/hello.js",
            dependencies: ["for", "this", "only", "array-length", "matters"],
            dependents: [],
          },
        ],
        { metrics: true },
      )[0].instability,
      1,
    );
  });

  it("emits an instability metric when we're asking for metrics (dependents as well as dependencies)", () => {
    equal(
      deriveModuleMetrics(
        [
          {
            source: "src/hello.js",
            dependencies: ["for", "this", "only", "array-length", "matters"],
            dependents: ["three", "eight", "actually"],
          },
        ],
        { metrics: true },
      )[0].instability,
      // eslint-disable-next-line no-magic-numbers
      0.625,
    );
  });

  it("doesn't emit an instability metric when we're asking for metrics on something we don't want to calc them on", () => {
    deepEqual(
      deriveModuleMetrics(
        [
          {
            source: "os",
            coreModule: true,
            dependencies: [],
            dependents: ["een", "twee", "drie", "vier"],
          },
        ],
        { metrics: true },
      ),
      [
        {
          source: "os",
          coreModule: true,
          dependencies: [],
          dependents: ["een", "twee", "drie", "vier"],
        },
      ],
    );
  });
});
