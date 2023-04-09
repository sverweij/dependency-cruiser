import { expect } from "chai";

import {
  getAfferentCouplings,
  getEfferentCouplings,
  getParentFolders,
  object2Array,
} from "../../../../src/enrich/derive/folders/utl.mjs";

describe("[U] enrich/derive/folders/utl - getAfferentCouplings", () => {
  it("no dependents => 0", () => {
    expect(
      getAfferentCouplings({ dependents: [] }, "src/whoopla").length
    ).to.equal(0);
  });

  it("dependents from the current folder => 0", () => {
    expect(
      getAfferentCouplings(
        { dependents: ["src/folder/do-things.mjs"] },
        "src/folder"
      ).length
    ).to.equal(0);
  });

  it("dependents from another folder => 1", () => {
    expect(
      getAfferentCouplings(
        { dependents: ["src/somewhere-else/do-things.mjs"] },
        "src/whoopla"
      ).length
    ).to.equal(1);
  });

  it("dependent from another folder that starts with a similar name => 1", () => {
    expect(
      getAfferentCouplings(
        { dependents: ["src/folder-some-more/do-things.mjs"] },
        "src/folder"
      ).length
    ).to.equal(1);
  });

  it("all together now", () => {
    expect(
      getAfferentCouplings(
        {
          dependents: [
            "src/folder-some-more/do-things.mjs",
            "src/folder/do-things.mjs",
            "test/folder/index.spec.mjs",
          ],
        },
        "src/folder"
      ).length
      // eslint-disable-next-line no-magic-numbers
    ).to.equal(2);
  });
});

describe("[U] enrich/derive/folders/utl - getEfferentCouplings", () => {
  it("no dependencies => 0", () => {
    expect(
      getEfferentCouplings({ dependencies: [] }, "src/whoopla").length
    ).to.equal(0);
  });
});

describe("[U] enrich/derive/folders/utl - getParentFolders", () => {
  it("for a parent-less folder just returns that folder", () => {
    expect(getParentFolders("src")).to.deep.equal(["src"]);
  });

  it("for folder with parents return the parent folder and the folder itself (in that order)", () => {
    expect(getParentFolders("src/reprot")).to.deep.equal(["src", "src/reprot"]);
  });
  it("for empty folder names return that", () => {
    expect(getParentFolders("")).to.deep.equal([""]);
  });
});

describe("[U] enrich/derive/folders/utl - objectToArray", () => {
  it("no folders in object => empty array", () => {
    expect(object2Array({})).to.deep.equal([]);
  });

  it("slaps keys into a name attribute in objects", () => {
    expect(object2Array({ thename: {} })).to.deep.equal([{ name: "thename" }]);
  });

  it("slaps keys into a name attribute in objects (multiple)", () => {
    expect(
      object2Array({
        "folder/one": {},
        "folder/two": { attribute: "yes" },
      })
    ).to.deep.equal([
      { name: "folder/one" },
      { name: "folder/two", attribute: "yes" },
    ]);
  });
});
