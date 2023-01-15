/* eslint-disable no-magic-numbers */
import { expect } from "chai";
import {
  optionIsCompatible,
  includeOnlyIsCompatible,
  limitIsCompatible,
  metricsIsCompatible,
  cacheOptionIsCompatible,
  optionsAreCompatible,
} from "../../src/cache/options-compatible.js";

describe("[U] cache/options-compatible - optionIsCompatible", () => {
  it("if neither filter exists they're compatible", () => {
    expect(optionIsCompatible()).to.equal(true);
  });

  it("if the old filter doesn't exist, the new one is compatible, whatever it is", () => {
    expect(
      optionIsCompatible(null, { path: ["aap", "noot", "mies"] })
    ).to.equal(true);
  });

  it("if the old filter exists, the new one is compatible when it's _exactly_ the same", () => {
    expect(
      optionIsCompatible(
        { path: ["aap", "noot", "mies"] },
        { path: ["aap", "noot", "mies"] }
      )
    ).to.equal(true);
  });

  it("if the old filter exists, the new one is _not_ compatible when it doesn't exist", () => {
    expect(
      optionIsCompatible({ path: ["aap", "noot", "mies"] }, null)
    ).to.equal(false);
  });

  it("if the old filter exists, the new one is _not_ compatible when it isn't exactly the same", () => {
    expect(
      optionIsCompatible(
        { path: ["aap", "noot", "mies"] },
        { path: ["aap", "mies"] }
      )
    ).to.equal(false);
  });
});

describe("[U] cache/options-compatible - includeOnlyIsCompatible", () => {
  it("if neither filter exists they're compatible", () => {
    expect(includeOnlyIsCompatible()).to.equal(true);
  });

  it("if the old filter doesn't exist, the new one is compatible, whatever it is", () => {
    expect(
      includeOnlyIsCompatible(null, { path: ["aap", "noot", "mies"] })
    ).to.equal(true);
  });

  it("if the old filter exists, the new one is compatible when it's _exactly_ the same", () => {
    expect(
      includeOnlyIsCompatible(["aap", "noot", "mies"], {
        path: ["aap", "noot", "mies"],
      })
    ).to.equal(true);
  });

  it("if the old filter exists, the new one is _not_ compatible when it doesn't exist", () => {
    expect(includeOnlyIsCompatible(["aap", "noot", "mies"], null)).to.equal(
      false
    );
  });

  it("if the old filter exists, the new one is _not_ compatible when it isn't exactly the same", () => {
    expect(
      includeOnlyIsCompatible(["aap", "noot", "mies"], {
        path: ["aap", "mies"],
      })
    ).to.equal(false);
  });
});

describe("[U] cache/options-compatible - limitIsCompatible", () => {
  it("if neither limit exists they're compatible", () => {
    expect(limitIsCompatible()).to.equal(true);
  });

  it("if the old limit doesn't exist compatible", () => {
    expect(limitIsCompatible(null, 1)).to.equal(true);
  });

  it("if the old limit exists and it's not infinite ('0') it's compatible when it's >= the new value", () => {
    expect(limitIsCompatible(3, 3)).to.equal(true);
    expect(limitIsCompatible(3, 2)).to.equal(true);
  });

  it("if the old limit exists and it's not infinite ('0') it's not compatible when it's < the new value", () => {
    expect(limitIsCompatible(3, 4)).to.equal(false);
    expect(limitIsCompatible(3, 0)).to.equal(false);
  });

  it("if the old limit exists and it's infinite ('0') it's compatible whatever the new value is", () => {
    expect(limitIsCompatible(0, null)).to.equal(true);
    expect(limitIsCompatible(0, 0)).to.equal(true);
    expect(limitIsCompatible(0, 1)).to.equal(true);
    expect(limitIsCompatible(0, 99)).to.equal(true);
  });
});

describe("[U] cache/options-compatible - metricsIsCompatible", () => {
  it("if neither metrics exist they're compatible", () => {
    expect(metricsIsCompatible()).to.equal(true);
  });

  it("is compatible when the old results have metrics and the new options don't", () => {
    expect(metricsIsCompatible(true, false)).to.equal(true);
  });

  it("is compatible when the old results have metrics and the new options also do", () => {
    expect(metricsIsCompatible(true, true)).to.equal(true);
  });
  it("is not compatible when the old results don't have metrics and the new options  do", () => {
    expect(metricsIsCompatible(false, true)).to.equal(false);
  });
  it("is compatible when the old results don't have metrics and the new options don't either", () => {
    expect(metricsIsCompatible(false, false)).to.equal(true);
  });
});

describe("[U] cache/options-compatible - cacheOptionIsCompatible", () => {
  it("returns true when both equal 'true'", () => {
    expect(cacheOptionIsCompatible(true, true)).to.equal(true);
  });
  it("returns true when are objects & they're 100% equal", () => {
    expect(
      cacheOptionIsCompatible(
        { folder: "x", strategy: "metadata" },
        { folder: "x", strategy: "metadata" }
      )
    ).to.equal(true);
  });
  it("returns false when are objects & the folders differ", () => {
    expect(
      cacheOptionIsCompatible(
        { folder: "x", strategy: "metadata" },
        { folder: "not-x", strategy: "metadata" }
      )
    ).to.equal(false);
  });
  it("returns false when both cache options are objects & the strategies differ", () => {
    expect(
      cacheOptionIsCompatible(
        { folder: "x", strategy: "metadata" },
        { folder: "x", strategy: "content" }
      )
    ).to.equal(false);
  });
  it("returns false when one cache option is an object and the other one isn't", () => {
    expect(
      cacheOptionIsCompatible(true, { folder: "x", strategy: "metadata" })
    ).to.equal(false);
    expect(
      cacheOptionIsCompatible("x", { folder: "x", strategy: "metadata" })
    ).to.equal(false);
  });
});

describe("[U] cache/options-compatible - optionsAreCompatible", () => {
  it("options are not compatible when there's none in either", () => {
    expect(optionsAreCompatible({}, {})).to.equal(false);
  });
  it("options are compatible when there's none in either (except a cache option)", () => {
    expect(optionsAreCompatible({ cache: true }, { cache: true })).to.equal(
      true
    );
  });
  it("options are compatible when args are exactly equal", () => {
    expect(
      optionsAreCompatible(
        { args: "aap noot mies", cache: true },
        { args: "aap noot mies", cache: true }
      )
    ).to.equal(true);
  });
  it("options are not compatible when args are not exactly equal", () => {
    expect(
      optionsAreCompatible(
        { args: "aap noot mies", cache: true },
        { args: "aap noot", cache: true }
      )
    ).to.equal(false);
  });
  it("options are compatible when also rulesFiles are exactly equal", () => {
    expect(
      optionsAreCompatible(
        {
          args: "aap",
          rulesFile: "thing.js",
          tsPreCompilationDeps: false,
          cache: true,
        },
        {
          args: "aap",
          rulesFile: "thing.js",
          tsPreCompilationDeps: false,
          cache: true,
        }
      )
    ).to.equal(true);
  });
  it("options are not compatible when also tsPreCompilationDeps are not exactly equal", () => {
    expect(
      optionsAreCompatible(
        {
          args: "aap",
          rulesFile: "thing.js",
          tsPreCompilationDeps: false,
          cache: true,
        },
        {
          args: "aap",
          rulesFile: "thing.js",
          tsPreCompilationDeps: true,
          cache: true,
        }
      )
    ).to.equal(false);
  });

  it("options are compatible when also includeOnly filters are exactly equal", () => {
    expect(
      optionsAreCompatible(
        {
          args: "aap",
          rulesFile: "thing.js",
          tsPreCompilationDeps: false,
          includeOnly: "mies",
          cache: true,
        },
        {
          args: "aap",
          rulesFile: "thing.js",
          tsPreCompilationDeps: false,
          includeOnly: { path: "mies" },
          cache: true,
        }
      )
    ).to.equal(true);
  });

  it("options are not compatible when also collapse filters are not compatible equal", () => {
    expect(
      optionsAreCompatible(
        { args: "aap", rulesFile: "thing.js", collapse: "zus", cache: true },
        { args: "aap", rulesFile: "thing.js", collapse: "jet", cache: true }
      )
    ).to.equal(false);
  });

  it("options are compatible when also collapse filters are compatible", () => {
    expect(
      optionsAreCompatible(
        {
          args: "aap",
          rulesFile: "thing.js",
          tsPreCompilationDeps: false,
          cache: true,
        },
        {
          args: "aap",
          rulesFile: "thing.js",
          tsPreCompilationDeps: false,
          collapse: "jet",
          cache: true,
        }
      )
    ).to.equal(true);
  });
});
