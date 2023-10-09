import { join } from "node:path";
import { equal } from "node:assert/strict";
import makeAbsolute from "#config-utl/make-absolute.mjs";

describe("[U] cli/utl/makeAbsolute", () => {
  it("leaves absolute path names alone", () => {
    equal(
      makeAbsolute("/hallo/dit/is/een/absoluut/pad"),
      "/hallo/dit/is/een/absoluut/pad",
    );
  });

  it("puts the current working directory in front of non-absolute paths", () => {
    equal(makeAbsolute("pad"), join(process.cwd(), "pad"));
  });
});
