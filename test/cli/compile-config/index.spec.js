const path = require("path");
const expect = require("chai").expect;
const compileConfig = require("../../../src/cli/compile-config");
const fixture = require("./mocks/rules.sub-not-allowed-error.json");
const mergedFixture = require("./mocks/extends/merged.json");
const mergedArrayOneFixture = require("./mocks/extends/merged-array-1.json");
const mergedArrayTwoFixture = require("./mocks/extends/merged-array-2.json");

const mockDir = path.join(__dirname, "mocks");

describe("cli/compile-config", () => {
  it("a rule set without an extends returns just that rule set", () => {
    expect(
      compileConfig(path.join(mockDir, "rules.sub-not-allowed-error.json"))
    ).to.deep.equal(fixture);
  });

  it("a rule set with an extends returns that rule set, extending the mentioned base", () => {
    expect(
      compileConfig(path.join(mockDir, "extends/extending.json"))
    ).to.deep.equal(mergedFixture);
  });

  it("a rule set with an extends array (0 members) returns that rule set", () => {
    expect(
      compileConfig(
        path.join(mockDir, "extends/extending-array-with-zero-members.json")
      )
    ).to.deep.equal({
      forbidden: [
        {
          name: "rule-from-the-base",
          from: {},
          to: {}
        }
      ]
    });
  });

  it("a rule set with an extends array (1 member) returns that rule set, extending the mentioned base", () => {
    expect(
      compileConfig(
        path.join(mockDir, "extends/extending-array-with-one-member.json")
      )
    ).to.deep.equal(mergedArrayOneFixture);
  });

  it("a rule set with an extends array (>1 member) returns that rule set, extending the mentioned bases", () => {
    expect(
      compileConfig(
        path.join(mockDir, "extends/extending-array-with-two-members.json")
      )
    ).to.deep.equal(mergedArrayTwoFixture);
  });

  it("a rule set with an extends from node_modules gets merged properly as well", () => {
    expect(
      compileConfig(
        path.join(mockDir, "extends/extending-from-node-modules.json")
      )
    ).to.deep.equal({
      allowed: [
        {
          from: {
            path: "src"
          },
          to: {
            path: "src"
          }
        }
      ],
      allowedSeverity: "warn",
      forbidden: [],
      options: {
        doNotFollow: "node_modules"
      }
    });
  });

  it("borks on a circular extends (1 step)", () => {
    const lMessageOutTake = `config is circular - ${path.join(
      mockDir,
      "extends/circular-one.js"
    )} -> ${path.join(mockDir, "extends/circular-two.js")} -> ${path.join(
      mockDir,
      "extends/circular-one.js"
    )}.`;

    expect(() => {
      compileConfig(path.join(mockDir, "extends/circular-one.js"));
    }).to.throw(lMessageOutTake);
  });
});
