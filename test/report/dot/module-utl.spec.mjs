import { expect } from "chai";
import moduleUtl from "../../../src/report/dot/module-utl.js";

describe("report/dot/module-utl", () => {
  it("extractFirstTransgression - keeps as is when there's no transgressions", () => {
    expect(
      moduleUtl.extractFirstTransgression({ dependencies: [] })
    ).to.deep.equal({
      dependencies: [],
    });
  });

  it("extractFirstTransgression - adds the first module rule if there's at least one", () => {
    expect(
      moduleUtl.extractFirstTransgression({
        dependencies: [],
        rules: [
          { name: "error-thing", severity: "error" },
          { name: "warn-thing", severity: "warn" },
        ],
      })
    ).to.deep.equal({
      dependencies: [],
      rule: { name: "error-thing", severity: "error" },
      rules: [
        { name: "error-thing", severity: "error" },
        { name: "warn-thing", severity: "warn" },
      ],
    });
  });

  it("extractFirstTransgression - adds the first dependency rule if there's at least one", () => {
    expect(
      moduleUtl.extractFirstTransgression({
        dependencies: [
          {
            rules: [
              { name: "error-thing", severity: "error" },
              { name: "warn-thing", severity: "warn" },
            ],
          },
        ],
      })
    ).to.deep.equal({
      dependencies: [
        {
          rule: { name: "error-thing", severity: "error" },
          rules: [
            { name: "error-thing", severity: "error" },
            { name: "warn-thing", severity: "warn" },
          ],
        },
      ],
    });
  });

  it("flatLabel - returns the value of source as label", () => {
    expect(
      moduleUtl.flatLabel({ source: "aap/noot/mies/wim/zus.jet" })
    ).to.deep.equal({
      source: "aap/noot/mies/wim/zus.jet",
      label: "<aap/noot/mies/wim/<BR/><B>zus.jet</B>>",
    });
  });
});
