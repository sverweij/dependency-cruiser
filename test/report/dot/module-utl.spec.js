const expect = require("chai").expect;
const moduleUtl = require("../../../src/report/dot/module-utl");

describe("report/dot/module-utl", () => {
  it("extractRelevantTransgressions - keeps as is when there's no transgressions", () => {
    expect(
      moduleUtl.extractRelevantTransgressions({ dependencies: [] })
    ).to.deep.equal({ dependencies: [] });
  });

  it("extractRelevantTransgressions - adds the first module rule if there's at least one", () => {
    expect(
      moduleUtl.extractRelevantTransgressions({
        dependencies: [],
        rules: [
          { name: "error-thing", severity: "error" },
          { name: "warn-thing", severity: "warn" }
        ]
      })
    ).to.deep.equal({
      dependencies: [],
      rule: { name: "error-thing", severity: "error" },
      rules: [
        { name: "error-thing", severity: "error" },
        { name: "warn-thing", severity: "warn" }
      ]
    });
  });

  it("extractRelevantTransgressions - adds the first dependency rule if there's at least one", () => {
    expect(
      moduleUtl.extractRelevantTransgressions({
        dependencies: [
          {
            rules: [
              { name: "error-thing", severity: "error" },
              { name: "warn-thing", severity: "warn" }
            ]
          }
        ]
      })
    ).to.deep.equal({
      dependencies: [
        {
          rule: { name: "error-thing", severity: "error" },
          rules: [
            { name: "error-thing", severity: "error" },
            { name: "warn-thing", severity: "warn" }
          ]
        }
      ]
    });
  });
});
