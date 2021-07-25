/* eslint-disable no-unused-expressions */
import { expect } from "chai";
import utl from "../../../src/cli/init-config/utl.js";

describe("cli/init-config/utl - folderNameArrayToRE", () => {
  it("transforms an array of folder names into a regex string - empty", () => {
    expect(utl.folderNameArrayToRE([])).to.equal("^()");
  });
  it("transforms an array of folder names into a regex string - one entry", () => {
    expect(utl.folderNameArrayToRE(["src"])).to.equal("^(src)");
  });
  it("transforms an array of folder names into a regex string - more than one entry", () => {
    expect(utl.folderNameArrayToRE(["bin", "src", "lib"])).to.equal(
      "^(bin|src|lib)"
    );
  });
});
