import { doesNotThrow, throws } from "node:assert";
import validateFileExistence from "../../../src/cli/utl/validate-file-existence.mjs";

describe("[U] cli/utl/validateFileExistence", () => {
  it("throws when the file or dir passed does not exists", () => {
    throws(
      () => {
        validateFileExistence("file-or-dir-does-not-exist");
      },
      {
        // even on windows it apparently uses \n only, so no need to use EOL
        message: `Can't open 'file-or-dir-does-not-exist' for reading. Does it exist?\n`,
      },
    );
  });

  it("passes when the file or dir passed exists", () => {
    doesNotThrow(() => {
      validateFileExistence("package.json");
    });
  });
});
