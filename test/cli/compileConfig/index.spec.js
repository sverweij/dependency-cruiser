const path = require("path");
const expect = require("chai").expect;
const compileConfig = require("../../../src/cli/compileConfig");
const fixture = require("../fixtures/rules.sub-not-allowed-error.json");
const mergedFixture = require("../fixtures/extends/merged.json");
const mergedArrayOneFixture = require("../fixtures/extends/merged-array-1.json");
const mergedArrayTwoFixture = require("../fixtures/extends/merged-array-2.json");

describe("cli/compileConfig", () => {
  it("a rule set without an extends returns just that rule set", () => {
    expect(
      compileConfig(
        path.join(__dirname, "../fixtures/rules.sub-not-allowed-error.json")
      )
    ).to.deep.equal(fixture);
  });

  it("a rule set with an extends returns that rule set, extending the mentioned base", () => {
    expect(
      compileConfig("./test/cli/fixtures/extends/extending.json")
    ).to.deep.equal(mergedFixture);
  });

  it("a rule set with an extends array (0 members) returns that rule set", () => {
    expect(
      compileConfig(
        "./test/cli/fixtures/extends/extending-array-with-zero-members.json"
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
        "./test/cli/fixtures/extends/extending-array-with-one-member.json"
      )
    ).to.deep.equal(mergedArrayOneFixture);
  });

  it("a rule set with an extends array (>1 member) returns that rule set, extending the mentioned bases", () => {
    expect(
      compileConfig(
        "./test/cli/fixtures/extends/extending-array-with-two-members.json"
      )
    ).to.deep.equal(mergedArrayTwoFixture);
  });

  it("a rule set with an extends from node_modules gets merged properly as well", () => {
    expect(
      compileConfig(
        "./test/cli/fixtures/extends/extending-from-node-modules.json"
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
    try {
      compileConfig(
        path.join(__dirname, "../fixtures/extends/circular-one.js")
      );
      expect("not to be here").to.equal("still here, though");
    } catch (e) {
      expect(e.message).to.contain(
        `config is circular - ${path.join(
          __dirname,
          "../fixtures/extends/circular-one.js"
        )} -> ${path.join(
          __dirname,
          "../fixtures/extends/circular-two.js"
        )} -> ${path.join(__dirname, "../fixtures/extends/circular-one.js")}.`
      );
    }
  });
});
