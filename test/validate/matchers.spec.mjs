import { deepEqual } from "node:assert/strict";
import {
  matchesAncestor,
  matchesDescendant,
  matchesLinealRelative,
} from "#validate/matchers.mjs";

function simpleAncestorMatch(pFrom, pTo, pToProperties = {}) {
  return matchesAncestor(
    {
      from: {},
      to: {
        ancestor: true,
      },
    },
    { source: pFrom },
    { resolved: pTo, ...pToProperties },
  );
}
function simpleDescendantMatch(pFrom, pTo, pToProperties = {}) {
  return matchesDescendant(
    {
      from: {},
      to: {
        descendant: true,
      },
    },
    { source: pFrom },
    { resolved: pTo, ...pToProperties },
  );
}
function simpleLinealRelativeMatch(
  pFrom,
  pTo,
  pToProperties = {},
  pLinealRelative = true,
) {
  return matchesLinealRelative(
    {
      from: {},
      to: {
        linealRelative: pLinealRelative,
      },
    },
    { source: pFrom },
    { resolved: pTo, ...pToProperties },
  );
}

describe("[U] validate/matchers - matchesAncestor", () => {
  it("matches when dependency is in a folder above the sources folder", () => {
    deepEqual(
      simpleAncestorMatch("src/aap/noot/pinda.mjs", "src/aap/chimpansee.mjs"),
      true,
    );
  });

  it("matches when the dependency is further above the root folder", () => {
    deepEqual(
      simpleAncestorMatch("src/brs/thing.mjs", "../../outside.mjs"),
      true,
    );
  });

  it("matches when the module is in the root, dependency is just above the root folder", () => {
    deepEqual(
      simpleAncestorMatch("intheroot.mjs", "../abovetheroot.mjs"),
      true,
    );
  });

  it("matches when the dependency is in the root, and the source is not", () => {
    deepEqual(simpleAncestorMatch("src/index.mjs", "intheroot.mjs"), true);
  });

  it("does not match when the dependency is a core module", () => {
    deepEqual(
      simpleAncestorMatch("src/index.mjs", "fs", { coreModule: true }),
      false,
    );
  });
  it("does not match when the dependency could not be resolved", () => {
    deepEqual(
      simpleAncestorMatch("src/index.mjs", "fs", { couldNotResolve: true }),
      false,
    );
  });

  it("does not match when dependency is in the same folder", () => {
    deepEqual(
      simpleAncestorMatch("src/aap/chimpansee.ts", "src/aap/oerangutan.ts"),
      false,
    );
  });

  it("does not match when dependency is in a child folder", () => {
    deepEqual(
      simpleAncestorMatch("src/aap/chimpansee.ts", "src/aap/noot/pinda.ts"),
      false,
    );
  });

  it("does not match when the source is in the root folder", () => {
    deepEqual(simpleAncestorMatch("aap.ts", "src/aap/chimpansee.ts"), false);
  });

  it("does not match when the dependency is in a sibling folder", () => {
    deepEqual(
      simpleAncestorMatch(
        "src/aap/longfilenamebutreally-chimpansee.ts",
        "src/noot/chimpansee.ts",
      ),
      false,
    );
  });

  it("does not match when the dependency is in a different tree", () => {
    deepEqual(
      simpleAncestorMatch(
        "src/aap/chimpansee.ts",
        "node_modules/slodash/index.js",
      ),
      false,
    );
  });

  it("does not match when the dependency is in different tree, even though the dependency's path _seems_ to be a sub-path", () => {
    deepEqual(
      simpleAncestorMatch(
        "src/report/dot-webpage/dot-module.mjs",
        "src/report/dot/dot-module.mjs",
      ),
      false,
    );
  });
});

describe("[U] validate/matchers - matchesDescendant", () => {
  it("matches when dependency is in a folder below the sources folder", () => {
    deepEqual(
      simpleDescendantMatch("src/aap/chimpansee.mjs", "src/aap/noot/pinda.mjs"),
      true,
    );
  });

  it("matches when the dependency is further below the root folder", () => {
    deepEqual(
      simpleDescendantMatch("src/brs/thing.mjs", "src/brs/noot/pinda.mjs"),
      true,
    );
  });

  it("matches when the module is in the root, dependency is below the root folder", () => {
    deepEqual(
      simpleDescendantMatch("intheroot.mjs", "src/abovetheroot.mjs"),
      true,
    );
  });

  it("does not match when the dependency is a core module", () => {
    deepEqual(
      simpleDescendantMatch("src/index.mjs", "fs", { coreModule: true }),
      false,
    );
  });

  it("does not match when the dependency could not be resolved", () => {
    deepEqual(
      simpleDescendantMatch("src/index.mjs", "src/missing.mjs", {
        couldNotResolve: true,
      }),
      false,
    );
  });

  it("does not match when dependency is in the same folder", () => {
    deepEqual(
      simpleDescendantMatch("src/aap/chimpansee.ts", "src/aap/oerangutan.ts"),
      false,
    );
  });

  it("does not match when the dependency is in a parent folder", () => {
    deepEqual(
      simpleDescendantMatch("src/aap/noot/pinda.ts", "src/aap/chimpansee.ts"),
      false,
    );
  });

  it("matches when the source is in the root folder", () => {
    deepEqual(simpleDescendantMatch("aap.ts", "src/aap/chimpansee.ts"), true);
  });

  it("does not match when the dependency is in a sibling folder", () => {
    deepEqual(
      simpleDescendantMatch(
        "src/aap/longfilenamebutreally-chimpansee.ts",
        "src/noot/chimpansee.ts",
      ),
      false,
    );
  });

  it("does not match when the dependency is in a different tree", () => {
    deepEqual(
      simpleDescendantMatch(
        "src/aap/chimpansee.ts",
        "node_modules/slodash/index.js",
      ),
      false,
    );
  });

  it("does not match when the dependency is in different tree, even though the dependency's path _seems_ to be a sub-path", () => {
    deepEqual(
      simpleDescendantMatch(
        "src/report/dot/dot-module.mjs",
        "src/report/dot-webpage/dot-module.mjs",
      ),
      false,
    );
  });
});

describe("[U] validate/matchers - matchesLinealRelative", () => {
  it("matches when dependency is in an ancestor folder", () => {
    deepEqual(
      simpleLinealRelativeMatch(
        "src/aap/noot/pinda.mjs",
        "src/aap/chimpansee.mjs",
      ),
      true,
    );
  });

  it("matches when dependency is in a descendant folder", () => {
    deepEqual(
      simpleLinealRelativeMatch(
        "src/aap/chimpansee.mjs",
        "src/aap/noot/pinda.mjs",
      ),
      true,
    );
  });

  it("does not match when dependency is in the same folder", () => {
    deepEqual(
      simpleLinealRelativeMatch(
        "src/aap/chimpansee.ts",
        "src/aap/oerangutan.ts",
      ),
      false,
    );
  });

  it("does not match when dependency is in a sibling folder", () => {
    deepEqual(
      simpleLinealRelativeMatch(
        "src/aap/chimpansee.ts",
        "src/noot/chimpansee.ts",
      ),
      false,
    );
  });

  it("does not match when dependency is a core module", () => {
    deepEqual(
      simpleLinealRelativeMatch("src/index.mjs", "fs", { coreModule: true }),
      false,
    );
  });

  it("does not match when dependency could not be resolved", () => {
    deepEqual(
      simpleLinealRelativeMatch("src/index.mjs", "src/missing.mjs", {
        couldNotResolve: true,
      }),
      false,
    );
  });

  it("matches when linealRelative is false and dependency is in a sibling folder", () => {
    deepEqual(
      simpleLinealRelativeMatch(
        "src/aap/chimpansee.ts",
        "src/noot/chimpansee.ts",
        {},
        false,
      ),
      true,
    );
  });

  it("does not match when linealRelative is false and dependency is in an ancestor folder", () => {
    deepEqual(
      simpleLinealRelativeMatch(
        "src/aap/noot/pinda.mjs",
        "src/aap/chimpansee.mjs",
        {},
        false,
      ),
      false,
    );
  });
});
