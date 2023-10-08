/* eslint-disable no-magic-numbers */
import { equal } from "node:assert/strict";
import {
  optionIsCompatible,
  filterOptionIsCompatible,
  includeOnlyIsCompatible,
  limitIsCompatible,
  metricsIsCompatible,
  cacheOptionIsCompatible,
  optionsAreCompatible,
} from "#cache/options-compatible.mjs";

describe("[U] cache/options-compatible - optionIsCompatible", () => {
  it("if neither filter exists they're compatible", () => {
    equal(optionIsCompatible(), true);
  });

  it("if the old option doesn't exist, the new one is not compatible, whatever it is", () => {
    equal(
      // eslint-disable-next-line no-undefined
      optionIsCompatible(undefined, { path: ["aap", "noot", "mies"] }),
      false,
    );
  });

  it("if the old option exists, the new one is compatible when it's _exactly_ the same", () => {
    equal(
      optionIsCompatible(
        { path: ["aap", "noot", "mies"] },
        { path: ["aap", "noot", "mies"] },
      ),
      true,
    );
  });

  it("if the old option exists, the new one is _not_ compatible when it doesn't exist", () => {
    equal(optionIsCompatible({ path: ["aap", "noot", "mies"] }, null), false);
  });

  it("if the old option exists, the new one is _not_ compatible when it isn't exactly the same", () => {
    equal(
      optionIsCompatible(
        { path: ["aap", "noot", "mies"] },
        { path: ["aap", "mies"] },
      ),
      false,
    );
  });

  it("if the old option equals false and the new one is as well, they're compatible", () => {
    equal(optionIsCompatible(false, false), true);
  });

  it("if the old option equals false and the new one is true, they're _not_ compatible", () => {
    equal(optionIsCompatible(false, true), false);
  });
});

describe("[U] cache/options-compatible - filterOptionIsCompatible", () => {
  it("if neither filter exists they're compatible", () => {
    equal(filterOptionIsCompatible(), true);
  });

  it("if the old (filter) option doesn't exist, the new one is compatible, whatever it is", () => {
    equal(
      // eslint-disable-next-line no-undefined
      filterOptionIsCompatible(undefined, { path: ["aap", "noot", "mies"] }),
      true,
    );
  });

  it("if the old (filter) option is null, the new one is compatible, whatever it is", () => {
    equal(
      filterOptionIsCompatible(null, { path: ["aap", "noot", "mies"] }),
      true,
    );
  });

  it("if the old (filter) option exists, the new one is compatible when it's _exactly_ the same", () => {
    equal(
      filterOptionIsCompatible(
        { path: ["aap", "noot", "mies"] },
        { path: ["aap", "noot", "mies"] },
      ),
      true,
    );
  });

  it("if the old (filter) option exists, the new one is _not_ compatible when it doesn't exist", () => {
    equal(
      filterOptionIsCompatible({ path: ["aap", "noot", "mies"] }, null),
      false,
    );
  });

  it("if the old (filter) option exists, the new one is _not_ compatible when it isn't exactly the same", () => {
    equal(
      filterOptionIsCompatible(
        { path: ["aap", "noot", "mies"] },
        { path: ["aap", "mies"] },
      ),
      false,
    );
  });

  it("if the old (filter) option equals false and the new one is as well, they're compatible", () => {
    equal(filterOptionIsCompatible(false, false), true);
  });

  it("if the old (filter) option equals false and the new one is true, they're compatible", () => {
    equal(filterOptionIsCompatible(false, true), true);
  });
});

describe("[U] cache/options-compatible - includeOnlyIsCompatible", () => {
  it("if neither filter exists they're compatible", () => {
    equal(includeOnlyIsCompatible(), true);
  });

  it("if the old filter doesn't exist, the new one is compatible, whatever it is", () => {
    equal(
      includeOnlyIsCompatible(null, { path: ["aap", "noot", "mies"] }),
      true,
    );
  });

  it("if the old filter exists, the new one is compatible when it's _exactly_ the same", () => {
    equal(
      includeOnlyIsCompatible(["aap", "noot", "mies"], {
        path: ["aap", "noot", "mies"],
      }),
      true,
    );
  });

  it("if the old filter exists, the new one is _not_ compatible when it doesn't exist", () => {
    equal(includeOnlyIsCompatible(["aap", "noot", "mies"], null), false);
  });

  it("if the old filter exists, the new one is _not_ compatible when it isn't exactly the same", () => {
    equal(
      includeOnlyIsCompatible(["aap", "noot", "mies"], {
        path: ["aap", "mies"],
      }),
      false,
    );
  });
});

describe("[U] cache/options-compatible - limitIsCompatible", () => {
  it("if neither limit exists they're compatible", () => {
    equal(limitIsCompatible(), true);
  });

  it("if the old limit doesn't exist compatible", () => {
    equal(limitIsCompatible(null, 1), true);
  });

  it("if the old limit exists and it's not infinite ('0') it's compatible when it's >= the new value", () => {
    equal(limitIsCompatible(3, 3), true);
    equal(limitIsCompatible(3, 2), true);
  });

  it("if the old limit exists and it's not infinite ('0') it's not compatible when it's < the new value", () => {
    equal(limitIsCompatible(3, 4), false);
    equal(limitIsCompatible(3, 0), false);
  });

  it("if the old limit exists and it's infinite ('0') it's compatible whatever the new value is", () => {
    equal(limitIsCompatible(0, null), true);
    equal(limitIsCompatible(0, 0), true);
    equal(limitIsCompatible(0, 1), true);
    equal(limitIsCompatible(0, 99), true);
  });
});

describe("[U] cache/options-compatible - metricsIsCompatible", () => {
  it("if neither metrics exist they're compatible", () => {
    equal(metricsIsCompatible(), true);
  });

  it("is compatible when the old results have metrics and the new options don't", () => {
    equal(metricsIsCompatible(true, false), true);
  });

  it("is compatible when the old results have metrics and the new options also do", () => {
    equal(metricsIsCompatible(true, true), true);
  });
  it("is not compatible when the old results don't have metrics and the new options  do", () => {
    equal(metricsIsCompatible(false, true), false);
  });
  it("is compatible when the old results don't have metrics and the new options don't either", () => {
    equal(metricsIsCompatible(false, false), true);
  });
});

describe("[U] cache/options-compatible - cacheOptionIsCompatible", () => {
  it("returns true when both equal 'true'", () => {
    equal(cacheOptionIsCompatible(true, true), true);
  });
  it("returns true when are objects & they're 100% equal", () => {
    equal(
      cacheOptionIsCompatible(
        { folder: "x", strategy: "metadata" },
        { folder: "x", strategy: "metadata" },
      ),
      true,
    );
  });
  it("returns false when are objects & the folders differ", () => {
    equal(
      cacheOptionIsCompatible(
        { folder: "x", strategy: "metadata" },
        { folder: "not-x", strategy: "metadata" },
      ),
      false,
    );
  });
  it("returns false when both cache options are objects & the strategies differ", () => {
    equal(
      cacheOptionIsCompatible(
        { folder: "x", strategy: "metadata" },
        { folder: "x", strategy: "content" },
      ),
      false,
    );
  });
  it("returns false when one cache option is an object and the other one isn't", () => {
    equal(
      cacheOptionIsCompatible(true, { folder: "x", strategy: "metadata" }),
      false,
    );
    equal(
      cacheOptionIsCompatible("x", { folder: "x", strategy: "metadata" }),
      false,
    );
  });
});

describe("[U] cache/options-compatible - optionsAreCompatible", () => {
  it("options are not compatible when there's none in either", () => {
    equal(optionsAreCompatible({}, {}), false);
  });
  it("options are compatible when there's none in either (except a cache option)", () => {
    equal(optionsAreCompatible({ cache: true }, { cache: true }), true);
  });
  it("options are compatible when args are exactly equal", () => {
    equal(
      optionsAreCompatible(
        { args: "aap noot mies", cache: true },
        { args: "aap noot mies", cache: true },
      ),
      true,
    );
  });
  it("options are not compatible when args are not exactly equal", () => {
    equal(
      optionsAreCompatible(
        { args: "aap noot mies", cache: true },
        { args: "aap noot", cache: true },
      ),
      false,
    );
  });
  it("options are compatible when also rulesFiles are exactly equal", () => {
    equal(
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
    equal(
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
    equal(
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
    equal(
      optionsAreCompatible(
        { args: "aap", rulesFile: "thing.js", collapse: "zus", cache: true },
        { args: "aap", rulesFile: "thing.js", collapse: "jet", cache: true },
      ),
      false,
    );
  });

  it("options are compatible when also collapse filters are compatible", () => {
    equal(
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
