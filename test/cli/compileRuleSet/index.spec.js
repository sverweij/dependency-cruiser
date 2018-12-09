const path           = require("path");
const expect         = require("chai").expect;
const compileRuleSet = require("../../../src/cli/compileRuleSet");
const fixture        = require('../fixtures/rules.sub-not-allowed-error.json');
const mergedFixture  = require('../fixtures/extends/merged.json');

describe("compileRuleSet", () => {
    it("a rule set without an extends returns just that rule set", () => {
        expect(
            compileRuleSet(path.join(__dirname, "../fixtures/rules.sub-not-allowed-error.json"))
        ).to.deep.equal(
            fixture
        );
    });

    it("a rule set with an extends returns that rule set, extending the mentioned base", () => {
        expect(
            compileRuleSet("./test/cli/fixtures/extends/extending.json")
        ).to.deep.equal(
            mergedFixture
        );
    });

    it("a rule set with an extends from node_modules gets merged properly as well", () => {
        expect(
            compileRuleSet("./test/cli/fixtures/extends/extending-from-node-modules.json")
        ).to.deep.equal(
            {
                allowed: [{
                    from: {
                        path: "src"
                    },
                    to: {
                        path: "src"
                    }
                }],
                allowedSeverity: "warn",
                forbidden: [],
                options: {
                    doNotFollow: "node_modules"
                }
            }
        );
    });

    it("borks on a circular extends (1 step)", () => {
        try {
            compileRuleSet(path.join(__dirname, "../fixtures/extends/circular-one.js"));
            expect("not to be here").to.equal("still here, though");
        } catch (e) {
            expect(e.message).to.contain(
                `config is circular - ${
                    path.join(__dirname, "../fixtures/extends/circular-one.js")
                } -> ${
                    path.join(__dirname, "../fixtures/extends/circular-two.js")
                } -> ${
                    path.join(__dirname, "../fixtures/extends/circular-one.js")
                }.`
            );
        }
    });
});
