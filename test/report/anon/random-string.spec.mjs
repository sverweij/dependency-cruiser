import { match, strictEqual } from "node:assert";
import randomString from "../../../src/report/anon/random-string.mjs";

describe("[U] report/anon/random-string", () => {
  it("returns the empty string when passed the empty string", () => {
    strictEqual(randomString(""), "");
  });

  it("returns a lower case ascii character when passed such", () => {
    match(randomString("a"), /[a-z]/);
  });

  it("returns a lower case ascii character when passed a diacritical", () => {
    match(randomString("ü"), /[a-z]/);
  });

  it("returns an upper case ascii character when passed such", () => {
    match(randomString("U"), /[A-Z]/);
  });

  it("returns an upper case ascii character when passed an upper case diacritical", () => {
    match(randomString("Ü"), /[A-Z]/);
  });

  it("echoes separators", () => {
    strictEqual(randomString("-"), "-");
  });

  it("returns a number when passed a number", () => {
    match(randomString("1"), /\d/);
  });

  it("returns a lower case ascii character when passed a single character", () => {
    match(
      randomString("better-someStuff_operator"),
      /[a-z]{6}-[a-z]{4}[A-Z][a-z]{4}_[a-z]{8}/,
    );
  });
});
