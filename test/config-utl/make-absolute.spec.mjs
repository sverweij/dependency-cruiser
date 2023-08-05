import { join } from "node:path";
import { strictEqual } from "node:assert";
import makeAbsolute from "../../src/config-utl/make-absolute.mjs";

describe("[U] cli/utl/makeAbsolute", () => {
  it("leaves absolute path names alone", () => {
    strictEqual(
      makeAbsolute("/hallo/dit/is/een/absoluut/pad"),
      "/hallo/dit/is/een/absoluut/pad",
    );
  });

  it("puts the current working directory in front of non-absolute paths", () => {
    strictEqual(makeAbsolute("pad"), join(process.cwd(), "pad"));
  });
});
