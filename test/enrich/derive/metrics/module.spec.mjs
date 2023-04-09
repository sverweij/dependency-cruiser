import { expect } from "chai";

import deriveModuleMetrics from "../../../../src/enrich/derive/metrics/index.mjs";

describe("[U] enrich/derive/metrics/module - module stability metrics derivation", () => {
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
      )[0].instability
    ).to.equal(1);
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
      )[0].instability
      // eslint-disable-next-line no-magic-numbers
    ).to.equal(0.625);
  });

  it("doesn't emit an instability metric when we're asking for metrics on something we don't want to calc them on", () => {
    expect(
      deriveModuleMetrics(
        [
          {
            source: "os",
            coreModule: true,
            dependencies: [],
            dependents: ["een", "twee", "drie", "vier"],
          },
        ],
        { metrics: true }
      )
    ).to.deep.equal([
      {
        source: "os",
        coreModule: true,
        dependencies: [],
        dependents: ["een", "twee", "drie", "vier"],
      },
    ]);
  });
});
