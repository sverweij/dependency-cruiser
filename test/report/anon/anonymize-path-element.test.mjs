import { match, notDeepStrictEqual, strictEqual } from "node:assert";
import { describe, it } from "node:test";
import { anonymizePathElement } from "../../../src/report/anon/anonymize-path-element.mjs";

describe("[U] report/anon/anonymizePathElement - uncached", () => {
  it("'' => ''", () => {
    strictEqual(anonymizePathElement("", [], /^$/, false), "");
  });

  it("'string' => random string", () => {
    match(anonymizePathElement("string", [], /^$/, false), /[a-z]{6}/);
  });

  it("consecutive calls with a word list yield words from that list, until empty", () => {
    const lWordlist = ["aap", "noot"];

    strictEqual(anonymizePathElement("one", lWordlist, /^$/, false), "aap");
    strictEqual(anonymizePathElement("two", lWordlist, /^$/, false), "noot");
    match(anonymizePathElement("three", lWordlist, /^$/, false), /[a-z]{5}/);
  });

  it("returns the passed string when it matches the whitelist", () => {
    strictEqual(
      anonymizePathElement("package", [], /^packages?$/, false),
      "package"
    );
  });

  it("returns the passed string when it does not match the whitelist", () => {
    strictEqual(
      anonymizePathElement("thing", ["aap", "noot"], /^packages?$/, false),
      "aap"
    );
  });

  it("only replaces the string up till the fist dot", () => {
    strictEqual(
      anonymizePathElement(
        "thing.spec.js",
        ["aap", "noot"],
        /^packages?$/,
        false
      ),
      "aap.spec.js"
    );
  });
});

describe("[U] report/anon/anonymizePathElement - cached", () => {
  it("subsequent calls with the same string yield the same result", () => {
    const lFirstResult = anonymizePathElement("yudelyo");

    strictEqual(anonymizePathElement("yudelyo"), lFirstResult);
  });

  it("subsequent calls with different strings yield different results", () => {
    const lFirstResult = anonymizePathElement("yudelyo");

    notDeepStrictEqual(anonymizePathElement("yoyudel"), lFirstResult);
  });
});
