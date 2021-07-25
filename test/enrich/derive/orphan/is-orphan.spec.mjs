import { expect } from "chai";

import isOrphan from "../../../../src/enrich/derive/orphan/is-orphan.js";
import ONE_MODULE_FIXTURE from "./fixtures/one-module.mjs";
import TWO_MODULES_FIXTURE from "./fixtures/two-module.mjs";

describe("enrich/derive/orphan/isOrphan", () => {
  it("flags a single module dependency graph as orphan", () => {
    expect(
      isOrphan({ source: "./lonely.js", dependencies: [] }, ONE_MODULE_FIXTURE)
    ).to.equal(true);
  });

  it("dismisses modules with at least one dependency", () => {
    expect(
      isOrphan(
        {
          source: "./snok.js",
          dependencies: [
            {
              resolved: "snak.js",
              coreModule: false,
              followable: true,
              couldNotResolve: false,
              dependencyTypes: ["local"],
              module: "./snak.js",
              moduleSystem: "cjs",
              matchesDoNotFollow: false,
            },
          ],
        },
        TWO_MODULES_FIXTURE
      )
    ).to.equal(false);
  });

  it("dismisses modules with at least one dependent", () => {
    expect(
      isOrphan(
        {
          source: "snak.js",
          dependencies: [],
        },
        TWO_MODULES_FIXTURE
      )
    ).to.equal(false);
  });
});
