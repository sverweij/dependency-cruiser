import { equal } from "node:assert/strict";
import { folderNameArrayToRE } from "#cli/init-config/utl.mjs";

describe("[U] cli/init-config/utl - folderNameArrayToRE", () => {
  it("transforms an array of folder names into a regex string - empty", () => {
    equal(folderNameArrayToRE([]), "^()");
  });
  it("transforms an array of folder names into a regex string - one entry", () => {
    equal(folderNameArrayToRE(["src"]), "^(src)");
  });
  it("transforms an array of folder names into a regex string - more than one entry", () => {
    equal(folderNameArrayToRE(["bin", "src", "lib"]), "^(bin|src|lib)");
  });
});
