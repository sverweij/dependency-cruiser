import { deepStrictEqual } from "node:assert";
import { describe, it } from "node:test";
import { normalizeREProperties } from "../../src/main/helpers.mjs";

const POTENTIAL_ARRAY_PROPERTIES = ["aap", "noot", "mies", "wim"];
const ARRAYED_OBJECT = {
  aap: ["re1", "re2", "re3"],
  noot: { not: "re4", an_array: "re5" },
  mies: ["re6"],
  wim: [],
  zus: "re7|re8",
  jet: true,
};

const DE_ARRAYED_OBJECT = {
  aap: "re1|re2|re3",
  noot: { not: "re4", an_array: "re5" },
  mies: "re6",
  wim: "",
  zus: "re7|re8",
  jet: true,
};

describe("[U] main/utl/normalize-re-properties", () => {
  it("returns the input when an empty object and an empty array of properties input is passed", () => {
    deepStrictEqual(normalizeREProperties({}, []), {});
  });

  it("returns the input when an any object and an empty array of properties input is passed", () => {
    deepStrictEqual(normalizeREProperties(ARRAYED_OBJECT, []), ARRAYED_OBJECT);
  });

  it("returns the input when an empty input is passed", () => {
    deepStrictEqual(normalizeREProperties({}, POTENTIAL_ARRAY_PROPERTIES), {});
  });

  it("returns the de-arrayed input when an empty input is passed", () => {
    deepStrictEqual(
      normalizeREProperties(ARRAYED_OBJECT, POTENTIAL_ARRAY_PROPERTIES),
      DE_ARRAYED_OBJECT
    );
  });
});
