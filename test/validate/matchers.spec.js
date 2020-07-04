const { expect } = require("chai");
const matchers = require("~/src/validate/matchers");

describe("validate/matches", () => {
  it("_replaceGroupPlaceholders - leaves re alone if passed empty match result", () => {
    expect(matchers._replaceGroupPlaceholders("$1/aap|noot", [])).to.equal(
      "$1/aap|noot"
    );
  });

  it("_replaceGroupPlaceholders - leaves re alone if passed groupless match result", () => {
    expect(
      matchers._replaceGroupPlaceholders("$1/aap|noot", ["houwoei"])
    ).to.equal("$1/aap|noot");
  });

  it("_replaceGroupPlaceholders - replaces if passed groupless match result and a $0", () => {
    expect(
      matchers._replaceGroupPlaceholders("$0/aap|noot", ["houwoei"])
    ).to.equal("houwoei/aap|noot");
  });

  it("_replaceGroupPlaceholders - replaces if passed groupy match result and a $1", () => {
    expect(
      matchers._replaceGroupPlaceholders("$1/aap|noot", [
        "whole/result/part",
        "part",
      ])
    ).to.equal("part/aap|noot");
  });

  it("_replaceGroupPlaceholders - replaces if passed groupy match result and multiple $1", () => {
    expect(
      matchers._replaceGroupPlaceholders("$1|$1/[^/]+/|noot", [
        "whole/result/part",
        "part",
      ])
    ).to.equal("part|part/[^/]+/|noot");
  });

  it("_replaceGroupPlaceholders - replaces if passed groupy match result and multiple groups", () => {
    expect(
      matchers._replaceGroupPlaceholders("$1|$2", [
        "start/thing/part",
        "start",
        "part",
      ])
    ).to.equal("start|part");
  });
});
