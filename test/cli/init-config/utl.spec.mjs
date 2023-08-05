import { strictEqual } from "node:assert";
import { folderNameArrayToRE } from "../../../src/cli/init-config/utl.mjs";

describe("[U] cli/init-config/utl - folderNameArrayToRE", () => {
  it("transforms an array of folder names into a regex string - empty", () => {
    strictEqual(folderNameArrayToRE([]), "^()");
  });
  it("transforms an array of folder names into a regex string - one entry", () => {
    strictEqual(folderNameArrayToRE(["src"]), "^(src)");
  });
  it("transforms an array of folder names into a regex string - more than one entry", () => {
    strictEqual(folderNameArrayToRE(["bin", "src", "lib"]), "^(bin|src|lib)");
  });
});
