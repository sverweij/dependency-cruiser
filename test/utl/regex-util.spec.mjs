import { equal } from "node:assert/strict";
import { replaceGroupPlaceholders } from "../../src/utl/regex-util.mjs";

describe("[U] utl/regex-util", () => {
  it("replaceGroupPlaceholders - leaves re alone if passed empty match result", () => {
    equal(replaceGroupPlaceholders("$1/aap|noot", []), "$1/aap|noot");
  });

  it("replaceGroupPlaceholders - leaves re alone if passed groupless match result", () => {
    equal(replaceGroupPlaceholders("$1/aap|noot", ["houwoei"]), "$1/aap|noot");
  });

  it("replaceGroupPlaceholders - replaces if passed groupless match result and a $0", () => {
    equal(
      replaceGroupPlaceholders("$0/aap|noot", ["houwoei"]),
      "houwoei/aap|noot",
    );
  });

  it("replaceGroupPlaceholders - replaces if passed groupy match result and a $1", () => {
    equal(
      replaceGroupPlaceholders("$1/aap|noot", ["whole/result/part", "part"]),
      "part/aap|noot",
    );
  });

  it("replaceGroupPlaceholders - replaces if passed groupy match result and multiple $1", () => {
    equal(
      replaceGroupPlaceholders("$1|$1/[^/]+/|noot", [
        "whole/result/part",
        "part",
      ]),
      "part|part/[^/]+/|noot",
    );
  });

  it("replaceGroupPlaceholders - replaces if passed groupy match result and multiple groups", () => {
    equal(
      replaceGroupPlaceholders("$1|$2", ["start/thing/part", "start", "part"]),
      "start|part",
    );
  });
});
