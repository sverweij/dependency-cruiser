import { strictEqual } from "node:assert";
import { describe, it } from "node:test";

import isOrphan from "../../../../src/enrich/derive/orphan/is-orphan.mjs";
import ONE_MODULE_FIXTURE from "./__mocks__/one-module.mjs";
import TWO_MODULES_FIXTURE from "./__mocks__/two-module.mjs";

describe("[U] enrich/derive/orphan/isOrphan", () => {
  it("flags a single module dependency graph as orphan", () => {
    strictEqual(
      isOrphan({ source: "./lonely.js", dependencies: [] }, ONE_MODULE_FIXTURE),
      true
    );
  });

  it("dismisses modules with at least one dependency", () => {
    strictEqual(
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
      ),
      false
    );
  });

  it("dismisses modules with at least one dependent", () => {
    strictEqual(
      isOrphan(
        {
          source: "snak.js",
          dependencies: [],
        },
        TWO_MODULES_FIXTURE
      ),
      false
    );
  });
});
