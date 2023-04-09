import { expect } from "chai";
import { anonymizePathElement } from "../../../src/report/anon/anonymize-path-element.mjs";

describe("[U] report/anon/anonymizePathElement - uncached", () => {
  it("'' => ''", () => {
    expect(anonymizePathElement("", [], /^$/, false)).to.equal("");
  });

  it("'string' => random string", () => {
    expect(anonymizePathElement("string", [], /^$/, false)).to.match(
      /[a-z]{6}/
    );
  });

  it("consecutive calls with a word list yield words from that list, until empty", () => {
    const lWordlist = ["aap", "noot"];

    expect(anonymizePathElement("one", lWordlist, /^$/, false)).to.equal("aap");
    expect(anonymizePathElement("two", lWordlist, /^$/, false)).to.equal(
      "noot"
    );
    expect(anonymizePathElement("three", lWordlist, /^$/, false)).to.match(
      /[a-z]{5}/
    );
  });

  it("returns the passed string when it matches the whitelist", () => {
    expect(anonymizePathElement("package", [], /^packages?$/, false)).to.equal(
      "package"
    );
  });

  it("returns the passed string when it does not match the whitelist", () => {
    expect(
      anonymizePathElement("thing", ["aap", "noot"], /^packages?$/, false)
    ).to.equal("aap");
  });

  it("only replaces the string up till the fist dot", () => {
    expect(
      anonymizePathElement(
        "thing.spec.js",
        ["aap", "noot"],
        /^packages?$/,
        false
      )
    ).to.equal("aap.spec.js");
  });
});

describe("[U] report/anon/anonymizePathElement - cached", () => {
  it("subsequent calls with the same string yield the same result", () => {
    const lFirstResult = anonymizePathElement("yudelyo");

    expect(anonymizePathElement("yudelyo")).to.equal(lFirstResult);
  });

  it("subsequent calls with different strings yield different results", () => {
    const lFirstResult = anonymizePathElement("yudelyo");

    expect(anonymizePathElement("yoyudel")).to.not.equal(lFirstResult);
  });
});
