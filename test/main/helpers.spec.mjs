import { expect, use } from "chai";
import chaiJSONSchema from "chai-json-schema";
import { normalizeREProperties } from "../../src/main/helpers.mjs";

use(chaiJSONSchema);

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
    expect(normalizeREProperties({}, [])).to.deep.equal({});
  });

  it("returns the input when an any object and an empty array of properties input is passed", () => {
    expect(normalizeREProperties(ARRAYED_OBJECT, [])).to.deep.equal(
      ARRAYED_OBJECT
    );
  });

  it("returns the input when an empty input is passed", () => {
    expect(normalizeREProperties({}, POTENTIAL_ARRAY_PROPERTIES)).to.deep.equal(
      {}
    );
  });

  it("returns the de-arrayed input when an empty input is passed", () => {
    expect(
      normalizeREProperties(ARRAYED_OBJECT, POTENTIAL_ARRAY_PROPERTIES)
    ).to.deep.equal(DE_ARRAYED_OBJECT);
  });
});
