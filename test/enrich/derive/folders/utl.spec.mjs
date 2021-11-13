import { expect } from "chai";

import {
  getParentFolders,
  foldersObject2folderArray,
} from "../../../../src/enrich/derive/folders/utl.js";

describe("enrich/derive/folders/utl - getParentFolders", () => {
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

describe("enrich/derive/folders/utl - foldersObject2folderArray", () => {
  it("no folders in object => empty array", () => {
    expect(foldersObject2folderArray({})).to.deep.equal([]);
  });

  it("slaps keys into a name attribute in objects", () => {
    expect(foldersObject2folderArray({ thename: {} })).to.deep.equal([
      { name: "thename" },
    ]);
  });

  it("slaps keys into a name attribute in objects (multiple)", () => {
    expect(
      foldersObject2folderArray({
        "folder/one": {},
        "folder/two": { attribute: "yes" },
      })
    ).to.deep.equal([
      { name: "folder/one" },
      { name: "folder/two", attribute: "yes" },
    ]);
  });
});
