import { deepStrictEqual, strictEqual } from "node:assert";
import { describe, it } from "node:test";

import {
  getAfferentCouplings,
  getEfferentCouplings,
  getParentFolders,
  object2Array,
} from "../../../../src/enrich/derive/folders/utl.mjs";

describe("[U] enrich/derive/folders/utl - getAfferentCouplings", () => {
  it("no dependents => 0", () => {
    strictEqual(
      getAfferentCouplings({ dependents: [] }, "src/whoopla").length,
      0
    );
  });

  it("dependents from the current folder => 0", () => {
    strictEqual(
      getAfferentCouplings(
        { dependents: ["src/folder/do-things.mjs"] },
        "src/folder"
      ).length,
      0
    );
  });

  it("dependents from another folder => 1", () => {
    strictEqual(
      getAfferentCouplings(
        { dependents: ["src/somewhere-else/do-things.mjs"] },
        "src/whoopla"
      ).length,
      1
    );
  });

  it("dependent from another folder that starts with a similar name => 1", () => {
    strictEqual(
      getAfferentCouplings(
        { dependents: ["src/folder-some-more/do-things.mjs"] },
        "src/folder"
      ).length,
      1
    );
  });

  it("all together now", () => {
    strictEqual(
      getAfferentCouplings(
        {
          dependents: [
            "src/folder-some-more/do-things.mjs",
            "src/folder/do-things.mjs",
            "test/folder/index.spec.mjs",
          ],
        },
        "src/folder"
      ).length,
      // eslint-disable-next-line no-magic-numbers
      2
    );
  });
});

describe("[U] enrich/derive/folders/utl - getEfferentCouplings", () => {
  it("no dependencies => 0", () => {
    strictEqual(
      getEfferentCouplings({ dependencies: [] }, "src/whoopla").length,
      0
    );
  });
});

describe("[U] enrich/derive/folders/utl - getParentFolders", () => {
  it("for a parent-less folder just returns that folder", () => {
    deepStrictEqual(getParentFolders("src"), ["src"]);
  });

  it("for folder with parents return the parent folder and the folder itself (in that order)", () => {
    deepStrictEqual(getParentFolders("src/reprot"), ["src", "src/reprot"]);
  });
  it("for empty folder names return that", () => {
    deepStrictEqual(getParentFolders(""), [""]);
  });
});

describe("[U] enrich/derive/folders/utl - objectToArray", () => {
  it("no folders in object => empty array", () => {
    deepStrictEqual(object2Array({}), []);
  });

  it("slaps keys into a name attribute in objects", () => {
    deepStrictEqual(object2Array({ thename: {} }), [{ name: "thename" }]);
  });

  it("slaps keys into a name attribute in objects (multiple)", () => {
    deepStrictEqual(
      object2Array({
        "folder/one": {},
        "folder/two": { attribute: "yes" },
      }),
      [{ name: "folder/one" }, { name: "folder/two", attribute: "yes" }]
    );
  });
});
