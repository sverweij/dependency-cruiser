import { expect } from "chai";
import { replaceGroupPlaceholders } from "../../src/utl/regex-util.mjs";

describe("[U] utl/regex-util", () => {
  it("replaceGroupPlaceholders - leaves re alone if passed empty match result", () => {
    expect(replaceGroupPlaceholders("$1/aap|noot", [])).to.equal("$1/aap|noot");
  });

  it("replaceGroupPlaceholders - leaves re alone if passed groupless match result", () => {
    expect(replaceGroupPlaceholders("$1/aap|noot", ["houwoei"])).to.equal(
      "$1/aap|noot"
    );
  });

  it("replaceGroupPlaceholders - replaces if passed groupless match result and a $0", () => {
    expect(replaceGroupPlaceholders("$0/aap|noot", ["houwoei"])).to.equal(
      "houwoei/aap|noot"
    );
  });

  it("replaceGroupPlaceholders - replaces if passed groupy match result and a $1", () => {
    expect(
      replaceGroupPlaceholders("$1/aap|noot", ["whole/result/part", "part"])
    ).to.equal("part/aap|noot");
  });

  it("replaceGroupPlaceholders - replaces if passed groupy match result and multiple $1", () => {
    expect(
      replaceGroupPlaceholders("$1|$1/[^/]+/|noot", [
        "whole/result/part",
        "part",
      ])
    ).to.equal("part|part/[^/]+/|noot");
  });

  it("replaceGroupPlaceholders - replaces if passed groupy match result and multiple groups", () => {
    expect(
      replaceGroupPlaceholders("$1|$2", ["start/thing/part", "start", "part"])
    ).to.equal("start|part");
  });
});
