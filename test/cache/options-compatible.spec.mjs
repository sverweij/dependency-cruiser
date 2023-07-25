/* eslint-disable no-magic-numbers */
import { strictEqual } from "node:assert";
import {
  optionIsCompatible,
  filterOptionIsCompatible,
  includeOnlyIsCompatible,
  limitIsCompatible,
  metricsIsCompatible,
  cacheOptionIsCompatible,
  optionsAreCompatible,
} from "../../src/cache/options-compatible.mjs";

describe("[U] cache/options-compatible - optionIsCompatible", () => {
  it("if neither filter exists they're compatible", () => {
    strictEqual(optionIsCompatible(), true);
  });

  it("if the old option doesn't exist, the new one is not compatible, whatever it is", () => {
    strictEqual(
      // eslint-disable-next-line no-undefined
      optionIsCompatible(undefined, { path: ["aap", "noot", "mies"] }),
      false,
    );
  });

  it("if the old option exists, the new one is compatible when it's _exactly_ the same", () => {
    strictEqual(
      optionIsCompatible(
        { path: ["aap", "noot", "mies"] },
        { path: ["aap", "noot", "mies"] },
      ),
      true,
    );
  });

  it("if the old option exists, the new one is _not_ compatible when it doesn't exist", () => {
    strictEqual(
      optionIsCompatible({ path: ["aap", "noot", "mies"] }, null),
      false,
    );
  });

  it("if the old option exists, the new one is _not_ compatible when it isn't exactly the same", () => {
    strictEqual(
      optionIsCompatible(
        { path: ["aap", "noot", "mies"] },
        { path: ["aap", "mies"] },
      ),
      false,
    );
  });

  it("if the old option equals false and the new one is as well, they're compatible", () => {
    strictEqual(optionIsCompatible(false, false), true);
  });

  it("if the old option equals false and the new one is true, they're _not_ compatible", () => {
    strictEqual(optionIsCompatible(false, true), false);
  });
});

describe("[U] cache/options-compatible - filterOptionIsCompatible", () => {
  it("if neither filter exists they're compatible", () => {
    strictEqual(filterOptionIsCompatible(), true);
  });

  it("if the old (filter) option doesn't exist, the new one is compatible, whatever it is", () => {
    strictEqual(
      // eslint-disable-next-line no-undefined
      filterOptionIsCompatible(undefined, { path: ["aap", "noot", "mies"] }),
      true,
    );
  });

  it("if the old (filter) option is null, the new one is compatible, whatever it is", () => {
    strictEqual(
      filterOptionIsCompatible(null, { path: ["aap", "noot", "mies"] }),
      true,
    );
  });

  it("if the old (filter) option exists, the new one is compatible when it's _exactly_ the same", () => {
    strictEqual(
      filterOptionIsCompatible(
        { path: ["aap", "noot", "mies"] },
        { path: ["aap", "noot", "mies"] },
      ),
      true,
    );
  });

  it("if the old (filter) option exists, the new one is _not_ compatible when it doesn't exist", () => {
    strictEqual(
      filterOptionIsCompatible({ path: ["aap", "noot", "mies"] }, null),
      false,
    );
  });

  it("if the old (filter) option exists, the new one is _not_ compatible when it isn't exactly the same", () => {
    strictEqual(
      filterOptionIsCompatible(
        { path: ["aap", "noot", "mies"] },
        { path: ["aap", "mies"] },
      ),
      false,
    );
  });

  it("if the old (filter) option equals false and the new one is as well, they're compatible", () => {
    strictEqual(filterOptionIsCompatible(false, false), true);
  });

  it("if the old (filter) option equals false and the new one is true, they're compatible", () => {
    strictEqual(filterOptionIsCompatible(false, true), true);
  });
});

describe("[U] cache/options-compatible - includeOnlyIsCompatible", () => {
  it("if neither filter exists they're compatible", () => {
    strictEqual(includeOnlyIsCompatible(), true);
  });

  it("if the old filter doesn't exist, the new one is compatible, whatever it is", () => {
    strictEqual(
      includeOnlyIsCompatible(null, { path: ["aap", "noot", "mies"] }),
      true,
    );
  });

  it("if the old filter exists, the new one is compatible when it's _exactly_ the same", () => {
    strictEqual(
      includeOnlyIsCompatible(["aap", "noot", "mies"], {
        path: ["aap", "noot", "mies"],
      }),
      true,
    );
  });

  it("if the old filter exists, the new one is _not_ compatible when it doesn't exist", () => {
    strictEqual(includeOnlyIsCompatible(["aap", "noot", "mies"], null), false);
  });

  it("if the old filter exists, the new one is _not_ compatible when it isn't exactly the same", () => {
    strictEqual(
      includeOnlyIsCompatible(["aap", "noot", "mies"], {
        path: ["aap", "mies"],
      }),
      false,
    );
  });
});

describe("[U] cache/options-compatible - limitIsCompatible", () => {
  it("if neither limit exists they're compatible", () => {
    strictEqual(limitIsCompatible(), true);
  });

  it("if the old limit doesn't exist compatible", () => {
    strictEqual(limitIsCompatible(null, 1), true);
  });

  it("if the old limit exists and it's not infinite ('0') it's compatible when it's >= the new value", () => {
    strictEqual(limitIsCompatible(3, 3), true);
    strictEqual(limitIsCompatible(3, 2), true);
  });

  it("if the old limit exists and it's not infinite ('0') it's not compatible when it's < the new value", () => {
    strictEqual(limitIsCompatible(3, 4), false);
    strictEqual(limitIsCompatible(3, 0), false);
  });

  it("if the old limit exists and it's infinite ('0') it's compatible whatever the new value is", () => {
    strictEqual(limitIsCompatible(0, null), true);
    strictEqual(limitIsCompatible(0, 0), true);
    strictEqual(limitIsCompatible(0, 1), true);
    strictEqual(limitIsCompatible(0, 99), true);
  });
});

describe("[U] cache/options-compatible - metricsIsCompatible", () => {
  it("if neither metrics exist they're compatible", () => {
    strictEqual(metricsIsCompatible(), true);
  });

  it("is compatible when the old results have metrics and the new options don't", () => {
    strictEqual(metricsIsCompatible(true, false), true);
  });

  it("is compatible when the old results have metrics and the new options also do", () => {
    strictEqual(metricsIsCompatible(true, true), true);
  });
  it("is not compatible when the old results don't have metrics and the new options  do", () => {
    strictEqual(metricsIsCompatible(false, true), false);
  });
  it("is compatible when the old results don't have metrics and the new options don't either", () => {
    strictEqual(metricsIsCompatible(false, false), true);
  });
});

describe("[U] cache/options-compatible - cacheOptionIsCompatible", () => {
  it("returns true when both equal 'true'", () => {
    strictEqual(cacheOptionIsCompatible(true, true), true);
  });
  it("returns true when are objects & they're 100% equal", () => {
    strictEqual(
      cacheOptionIsCompatible(
        { folder: "x", strategy: "metadata" },
        { folder: "x", strategy: "metadata" },
      ),
      true,
    );
  });
  it("returns false when are objects & the folders differ", () => {
    strictEqual(
      cacheOptionIsCompatible(
        { folder: "x", strategy: "metadata" },
        { folder: "not-x", strategy: "metadata" },
      ),
      false,
    );
  });
  it("returns false when both cache options are objects & the strategies differ", () => {
    strictEqual(
      cacheOptionIsCompatible(
        { folder: "x", strategy: "metadata" },
        { folder: "x", strategy: "content" },
      ),
      false,
    );
  });
  it("returns false when one cache option is an object and the other one isn't", () => {
    strictEqual(
      cacheOptionIsCompatible(true, { folder: "x", strategy: "metadata" }),
      false,
    );
    strictEqual(
      cacheOptionIsCompatible("x", { folder: "x", strategy: "metadata" }),
      false,
    );
  });
});

describe("[U] cache/options-compatible - optionsAreCompatible", () => {
  it("options are not compatible when there's none in either", () => {
    strictEqual(optionsAreCompatible({}, {}), false);
  });
  it("options are compatible when there's none in either (except a cache option)", () => {
    strictEqual(optionsAreCompatible({ cache: true }, { cache: true }), true);
  });
  it("options are compatible when args are exactly equal", () => {
    strictEqual(
      optionsAreCompatible(
        { args: "aap noot mies", cache: true },
        { args: "aap noot mies", cache: true },
      ),
      true,
    );
  });
  it("options are not compatible when args are not exactly equal", () => {
    strictEqual(
      optionsAreCompatible(
        { args: "aap noot mies", cache: true },
        { args: "aap noot", cache: true },
      ),
      false,
    );
  });
  it("options are compatible when also rulesFiles are exactly equal", () => {
    strictEqual(
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
        },
      ),
      true,
    );
  });
  it("options are not compatible when also tsPreCompilationDeps are not exactly equal", () => {
    strictEqual(
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
        },
      ),
      false,
    );
  });

  it("options are compatible when also includeOnly filters are exactly equal", () => {
    strictEqual(
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
        },
      ),
      true,
    );
  });

  it("options are not compatible when also collapse filters are not compatible equal", () => {
    strictEqual(
      optionsAreCompatible(
        { args: "aap", rulesFile: "thing.js", collapse: "zus", cache: true },
        { args: "aap", rulesFile: "thing.js", collapse: "jet", cache: true },
      ),
      false,
    );
  });

  it("options are compatible when also collapse filters are compatible", () => {
    strictEqual(
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
        },
      ),
      true,
    );
  });
});
