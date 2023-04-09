import { expect } from "chai";

import getDependents from "../../../../src/enrich/derive/dependents/get-dependents.mjs";

describe("[U] enrich/derive/dependents/get-dependents", () => {
  it("empty module without a source name & no modules yield no modules", () => {
    expect(getDependents({}, [])).to.deep.equal([]);
  });

  it("module & no modules yield no modules", () => {
    expect(getDependents({ source: "itsme" }, [])).to.deep.equal([]);
  });

  it("module & modules without any dependencies yield no modules", () => {
    expect(
      getDependents({ source: "itsme" }, [
        {
          source: "someoneelse",
          dependencies: [],
        },
      ])
    ).to.deep.equal([]);
  });

  it("module & modules with non-matching dependencies yield no modules", () => {
    expect(
      getDependents({ source: "itsme" }, [
        {
          source: "someoneelse",
          dependencies: [{ resolved: "itsnotme" }],
        },
      ])
    ).to.deep.equal([]);
  });

  it("module & module that's dependent yields that other module", () => {
    expect(
      getDependents({ source: "itsme" }, [
        {
          source: "someoneelse",
          dependencies: [{ resolved: "itsnotme" }, { resolved: "itsme" }],
        },
      ])
    ).to.deep.equal(["someoneelse"]);
  });

  it("module & modules that are dependent yields those other modules", () => {
    expect(
      getDependents({ source: "itsme" }, [
        {
          source: "someoneelse",
          dependencies: [{ resolved: "itsnotme" }, { resolved: "itsme" }],
        },
        {
          source: "someoneelse-again",
          dependencies: [
            { resolved: "notme" },
            { resolved: "notmeagain" },
            { resolved: "itsme" },
            { resolved: "itsnotmeeither" },
          ],
        },
      ])
    ).to.deep.equal(["someoneelse", "someoneelse-again"]);
  });
});
