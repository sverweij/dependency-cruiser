import { equal } from "node:assert/strict";

import ONE_MODULE_FIXTURE from "./__mocks__/one-module.mjs";
import TWO_MODULES_FIXTURE from "./__mocks__/two-module.mjs";
import isOrphan from "#analyze/derive/orphan/is-orphan.mjs";
import ModuleGraphWithDependencySet from "#graph-utl/module-graph-with-dependency-set.mjs";

describe("[U] analyze/derive/orphan/isOrphan", () => {
  it("flags a single module dependency graph as orphan", () => {
    equal(
      isOrphan(
        { source: "./lonely.js", dependencies: [] },
        new ModuleGraphWithDependencySet(ONE_MODULE_FIXTURE),
      ),
      true,
    );
  });

  it("dismisses modules with at least one dependency", () => {
    equal(
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
        new ModuleGraphWithDependencySet(TWO_MODULES_FIXTURE),
      ),
      false,
    );
  });

  it("dismisses modules with at least one dependent", () => {
    equal(
      isOrphan(
        {
          source: "snak.js",
          dependencies: [],
        },
        new ModuleGraphWithDependencySet(TWO_MODULES_FIXTURE),
      ),
      false,
    );
  });
});
