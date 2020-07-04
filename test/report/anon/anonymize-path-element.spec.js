const { expect } = require("chai");
const anonymizePath = require("~/src/report/anon/anonymize-path-element");

describe("report/anon/anonymizePathElement - uncached", () => {
  it("'' => ''", () => {
    expect(anonymizePath("", [], /^$/, false)).to.equal("");
  });

  it("'string' => random string", () => {
    expect(anonymizePath("string", [], /^$/, false)).to.match(/[a-z]{6}/);
  });

  it("consecutive calls with a word list yield words from that list, until empty", () => {
    const WORDLIST = ["aap", "noot"];

    expect(anonymizePath("one", WORDLIST, /^$/, false)).to.equal("aap");
    expect(anonymizePath("two", WORDLIST, /^$/, false)).to.equal("noot");
    expect(anonymizePath("three", WORDLIST, /^$/, false)).to.match(/[a-z]{5}/);
  });

  it("returns the passed string when it matches the whitelist", () => {
    expect(anonymizePath("package", [], /^packages?$/, false)).to.equal(
      "package"
    );
  });

  it("returns the passed string when it does not match the whitelist", () => {
    expect(
      anonymizePath("thing", ["aap", "noot"], /^packages?$/, false)
    ).to.equal("aap");
  });

  it("only replaces the string up till the fist dot", () => {
    expect(
      anonymizePath("thing.spec.js", ["aap", "noot"], /^packages?$/, false)
    ).to.equal("aap.spec.js");
  });
});

describe("report/anon/anonymizePathElement - cached", () => {
  it("subsequent calls with the same string yield the same result", () => {
    const lFirstResult = anonymizePath("yudelyo");

    expect(anonymizePath("yudelyo")).to.equal(lFirstResult);
  });

  it("subsequent calls with different strings yield different results", () => {
    const lFirstResult = anonymizePath("yudelyo");

    expect(anonymizePath("yoyudel")).to.not.equal(lFirstResult);
  });
});
