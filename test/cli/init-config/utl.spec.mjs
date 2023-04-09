import { expect } from "chai";
import { folderNameArrayToRE } from "../../../src/cli/init-config/utl.mjs";

describe("[U] cli/init-config/utl - folderNameArrayToRE", () => {
  it("transforms an array of folder names into a regex string - empty", () => {
    expect(folderNameArrayToRE([])).to.equal("^()");
  });
  it("transforms an array of folder names into a regex string - one entry", () => {
    expect(folderNameArrayToRE(["src"])).to.equal("^(src)");
  });
  it("transforms an array of folder names into a regex string - more than one entry", () => {
    expect(folderNameArrayToRE(["bin", "src", "lib"])).to.equal(
      "^(bin|src|lib)"
    );
  });
});
