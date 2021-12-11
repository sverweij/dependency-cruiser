import { expect } from "chai";

import {
  getParentFolders,
  object2Array,
} from "../../../../src/enrich/derive/metrics/utl.js";

describe("enrich/derive/metrics/utl - getParentFolders", () => {
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

describe("enrich/derive/metrics/utl - foldersObject2folderArray", () => {
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
