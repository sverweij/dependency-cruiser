import { deepEqual } from "node:assert/strict";
import { matchesAncestor } from "#validate/matchers.mjs";

function doMagic(pFrom, pTo, pToProperties = {}) {
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

describe("[U] validate/matchers - matchesAncestor", () => {
  it("matches when dependency is in a folder above the sources folder", () => {
    deepEqual(
      doMagic("src/aap/noot/pinda.mjs", "src/aap/chimpansee.mjs"),
      true,
    );
  });

  it("matches when the dependency is further above the root folder", () => {
    deepEqual(doMagic("src/brs/thing.mjs", "../../outside.mjs"), true);
  });

  it("matches when the module is in the root, dependency is just above the root folder", () => {
    deepEqual(doMagic("intheroot.mjs", "../abovetheroot.mjs"), true);
  });

  it("matches when the dependency is in the root, and the source is not", () => {
    deepEqual(doMagic("src/index.mjs", "intheroot.mjs"), true);
  });

  it("does not match when the dependency is a core module", () => {
    deepEqual(doMagic("src/index.mjs", "fs", { coreModule: true }), false);
  });
  it("does not match when the dependency could not be resolved", () => {
    deepEqual(doMagic("src/index.mjs", "fs", { couldNotResolve: true }), false);
  });

  it("does not match when dependency is in the same folder", () => {
    deepEqual(doMagic("src/aap/chimpansee.ts", "src/aap/oerangutan.ts"), false);
  });

  it("does not match when dependency is in a child folder", () => {
    deepEqual(doMagic("src/aap/chimpansee.ts", "src/aap/noot/pinda.ts"), false);
  });

  it("does not match when the source is in the root folder", () => {
    deepEqual(doMagic("aap.ts", "src/aap/chimpansee.ts"), false);
  });

  it("does not match when the dependency is in a sibling folder", () => {
    deepEqual(
      doMagic(
        "src/aap/longfilenamebutreally-chimpansee.ts",
        "src/noot/chimpansee.ts",
      ),
      false,
    );
  });

  it("does not match when the dependency is in a different tree", () => {
    deepEqual(
      doMagic("src/aap/chimpansee.ts", "node_modules/slodash/index.js"),
      false,
    );
  });

  it("does not match when the dependency is in different tree, even though the dependency's path _seems_ to be a sub-path", () => {
    deepEqual(
      doMagic(
        "src/report/dot-webpage/dot-module.mjs",
        "src/report/dot/dot-module.mjs",
      ),
      false,
    );
  });
});
