import { expect } from "chai";
import randomString from "../../../src/report/anon/random-string.mjs";

describe("[U] report/anon/random-string", () => {
  it("returns the empty string when passed the empty string", () => {
    expect(randomString("")).to.equal("");
  });

  it("returns a lower case ascii character when passed such", () => {
    expect(randomString("a")).to.match(/[a-z]/);
  });

  it("returns a lower case ascii character when passed a diacritical", () => {
    expect(randomString("ü")).to.match(/[a-z]/);
  });

  it("returns an upper case ascii character when passed such", () => {
    expect(randomString("U")).to.match(/[A-Z]/);
  });

  it("returns an upper case ascii character when passed an upper case diacritical", () => {
    expect(randomString("Ü")).to.match(/[A-Z]/);
  });

  it("echoes separators", () => {
    expect(randomString("-")).to.equal("-");
  });

  it("returns a number when passed a number", () => {
    expect(randomString("1")).to.match(/\d/);
  });

  it("returns a lower case ascii character when passed a single character", () => {
    expect(randomString("better-someStuff_operator")).to.match(
      /[a-z]{6}-[a-z]{4}[A-Z][a-z]{4}_[a-z]{8}/
    );
  });
});
