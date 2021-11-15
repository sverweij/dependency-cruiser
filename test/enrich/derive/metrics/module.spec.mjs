import { expect } from "chai";

import deriveModuleMetrics from "../../../../src/enrich/derive/metrics/module.js";

describe("enrich/derive/metrics/module - module stability metrics derivation", () => {
  it("doesn't do anything when we're not asking for metrics (metrics nor outputType)", () => {
    expect(deriveModuleMetrics([], {})).to.deep.equal([]);
  });

  it("emits an instability metric when we're asking for metrics", () => {
    expect(
      deriveModuleMetrics(
        [
          {
            source: "src/hello.js",
            dependencies: [],
            dependents: [],
          },
        ],
        { metrics: true }
      )
    ).to.deep.equal([
      {
        source: "src/hello.js",
        dependencies: [],
        dependents: [],
        instability: 0,
      },
    ]);
  });

  it("emits an instability metric when we're asking for outputType === metrics", () => {
    expect(
      deriveModuleMetrics(
        [
          {
            source: "src/hello.js",
            dependencies: [],
            dependents: [],
          },
        ],
        { metrics: true }
      )
    ).to.deep.equal([
      {
        source: "src/hello.js",
        dependencies: [],
        dependents: [],
        instability: 0,
      },
    ]);
  });

  it("emits an instability metric when we're asking for metrics (only dependents)", () => {
    expect(
      deriveModuleMetrics(
        [
          {
            source: "src/hello.js",
            dependencies: [],
            dependents: ["src/ola.js", "node_modules/shodash/index.js"],
          },
        ],
        { metrics: true }
      )
    ).to.deep.equal([
      {
        source: "src/hello.js",
        dependencies: [],
        dependents: ["src/ola.js", "node_modules/shodash/index.js"],
        instability: 0,
      },
    ]);
  });

  it("emits an instability metric when we're asking for metrics (only dependencies)", () => {
    expect(
      deriveModuleMetrics(
        [
          {
            source: "src/hello.js",
            dependencies: ["for", "this", "only", "array-length", "matters"],
            dependents: [],
          },
        ],
        { metrics: true }
      )
    ).to.deep.equal([
      {
        source: "src/hello.js",
        dependencies: ["for", "this", "only", "array-length", "matters"],
        dependents: [],
        instability: 1,
      },
    ]);
  });

  it("emits an instability metric when we're asking for metrics (dependents as well as dependencies)", () => {
    expect(
      deriveModuleMetrics(
        [
          {
            source: "src/hello.js",
            dependencies: ["for", "this", "only", "array-length", "matters"],
            dependents: ["three", "eight", "actually"],
          },
        ],
        { metrics: true }
      )
    ).to.deep.equal([
      {
        source: "src/hello.js",
        dependencies: ["for", "this", "only", "array-length", "matters"],
        dependents: ["three", "eight", "actually"],
        instability: 0.625,
      },
    ]);
  });
});
