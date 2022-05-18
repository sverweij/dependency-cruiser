import path from "path";
import { expect } from "chai";
import makeAbsolute from "../../src/config-utl/make-absolute.js";

describe("[U] cli/utl/makeAbsolute", () => {
  it("leaves absolute path names alone", () => {
    expect(makeAbsolute("/hallo/dit/is/een/absoluut/pad")).to.equal(
      "/hallo/dit/is/een/absoluut/pad"
    );
  });

  it("puts the current working directory in front of non-absolute paths", () => {
    expect(makeAbsolute("pad")).to.equal(path.join(process.cwd(), "pad"));
  });
});
