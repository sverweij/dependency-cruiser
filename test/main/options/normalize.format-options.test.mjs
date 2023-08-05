import { deepStrictEqual } from "node:assert";
import { describe, it } from "node:test";
import { normalizeFormatOptions } from "../../../src/main/options/normalize.mjs";

describe("[U] main/options/normalize - format options", () => {
  it("makes focus strings into an object", () => {
    deepStrictEqual(
      normalizeFormatOptions({
        focus: "42",
      }).focus,
      {
        path: "42",
      }
    );
  });

  it("makes focus strings into an object - with addition of focus depth if it's there", () => {
    deepStrictEqual(
      normalizeFormatOptions({
        focus: "42",
        focusDepth: 10,
      }).focus,
      {
        path: "42",
        depth: 10,
      }
    );
  });

  it("ignores focus depth when there's not also a focus attribute", () => {
    deepStrictEqual(
      normalizeFormatOptions({
        focusDepth: 10,
      }),
      {}
    );
  });

  it("makes exclude arrays into an object with a string", () => {
    deepStrictEqual(
      normalizeFormatOptions({
        exclude: ["^aap", "^noot", "mies$"],
      }).exclude,
      {
        path: "^aap|^noot|mies$",
      }
    );
  });

  it("makes exclude object with an array for path into an exclude path with a string for path", () => {
    deepStrictEqual(
      normalizeFormatOptions({
        exclude: { path: ["^aap", "^noot", "mies$"] },
      }).exclude,
      {
        path: "^aap|^noot|mies$",
      }
    );
  });

  it("collapse: normalizes a single digit for collapse to a folder depth regex", () => {
    deepStrictEqual(normalizeFormatOptions({ collapse: "2" }, ["collapse"]), {
      collapse: "node_modules/[^/]+|^[^/]+/[^/]+/",
    });
  });

  it("collapse: leaves non-single digits alone", () => {
    deepStrictEqual(normalizeFormatOptions({ collapse: "22" }, ["collapse"]), {
      collapse: "22",
    });
  });

  it("collapse: leaves a normal string/ regex like alone", () => {
    deepStrictEqual(
      normalizeFormatOptions({ collapse: "^packages/[^/]+" }, ["collapse"]),
      {
        collapse: "^packages/[^/]+",
      }
    );
  });
});

/* eslint no-magic-numbers: 0*/
