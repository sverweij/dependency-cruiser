import { deepEqual } from "node:assert/strict";

import getDependents from "#enrich/derive/dependents/get-dependents.mjs";

describe("[U] enrich/derive/dependents/get-dependents", () => {
  it("empty module without a source name & no modules yield no modules", () => {
    deepEqual(getDependents({}, []), []);
  });

  it("module & no modules yield no modules", () => {
    deepEqual(getDependents({ source: "itsme" }, []), []);
  });

  it("module & modules without any dependencies yield no modules", () => {
    deepEqual(
      getDependents({ source: "itsme" }, [
        {
          source: "someoneelse",
          dependencies: [],
        },
      ]),
      [],
    );
  });

  it("module & modules with non-matching dependencies yield no modules", () => {
    deepEqual(
      getDependents({ source: "itsme" }, [
        {
          source: "someoneelse",
          dependencies: [{ resolved: "itsnotme" }],
        },
      ]),
      [],
    );
  });

  it("module & module that's dependent yields that other module", () => {
    deepEqual(
      getDependents({ source: "itsme" }, [
        {
          source: "someoneelse",
          dependencies: [{ resolved: "itsnotme" }, { resolved: "itsme" }],
        },
      ]),
      ["someoneelse"],
    );
  });

  it("module & modules that are dependent yields those other modules", () => {
    deepEqual(
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
      ]),
      ["someoneelse", "someoneelse-again"],
    );
  });
});
