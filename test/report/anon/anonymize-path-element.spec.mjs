import { match, notDeepStrictEqual, equal } from "node:assert/strict";
import { anonymizePathElement } from "../../../src/report/anon/anonymize-path-element.mjs";

describe("[U] report/anon/anonymizePathElement - uncached", () => {
  it("'' => ''", () => {
    equal(anonymizePathElement("", [], /^$/, false), "");
  });

  it("'string' => random string", () => {
    match(anonymizePathElement("string", [], /^$/, false), /[a-z]{6}/);
  });

  it("consecutive calls with a word list yield words from that list, until empty", () => {
    const lWordlist = ["aap", "noot"];

    equal(anonymizePathElement("one", lWordlist, /^$/, false), "aap");
    equal(anonymizePathElement("two", lWordlist, /^$/, false), "noot");
    match(anonymizePathElement("three", lWordlist, /^$/, false), /[a-z]{5}/);
  });

  it("returns the passed string when it matches the whitelist", () => {
    equal(anonymizePathElement("package", [], /^packages?$/, false), "package");
  });

  it("returns the passed string when it does not match the whitelist", () => {
    equal(
      anonymizePathElement("thing", ["aap", "noot"], /^packages?$/, false),
      "aap",
    );
  });

  it("only replaces the string up till the fist dot", () => {
    equal(
      anonymizePathElement(
        "thing.spec.js",
        ["aap", "noot"],
        /^packages?$/,
        false,
      ),
      "aap.spec.js",
    );
  });
});

describe("[U] report/anon/anonymizePathElement - cached", () => {
  it("subsequent calls with the same string yield the same result", () => {
    const lFirstResult = anonymizePathElement("yudelyo");

    equal(anonymizePathElement("yudelyo"), lFirstResult);
  });

  it("subsequent calls with different strings yield different results", () => {
    const lFirstResult = anonymizePathElement("yudelyo");

    notDeepStrictEqual(anonymizePathElement("yoyudel"), lFirstResult);
  });
});
