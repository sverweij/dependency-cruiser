const expect       = require('chai').expect;
const validate     = require('../../src/validate');
const _readRuleSet = require("./readruleset.utl");

describe("validate/index - orphans", () => {
    it("Skips modules that have no reachable attribute", () => {
        expect(
            validate.module(
                true,
                _readRuleSet("./test/validate/fixtures/rules.reachable.json"),
                {source: "something"}
            )
        ).to.deep.equal({valid: true});
    });


    it("Triggers on modules that have a reachable attribute (non-matching)", () => {
        expect(
            validate.module(
                true,
                _readRuleSet("./test/validate/fixtures/rules.reachable.json"),
                {source: "something", reachable: true}
            )
        ).to.deep.equal({valid: true});
    });

    it("Triggers on modules that have a reachable attribute", () => {
        expect(
            validate.module(
                true,
                _readRuleSet("./test/validate/fixtures/rules.reachable.json"),
                {source: "something", reachable: false}
            )
        ).to.deep.equal({
            valid: false,
            rules: [
                {
                    name: "no-unreachable",
                    severity: "warn"
                }
            ]
        });
    });

    it("Triggers on modules that have a reachable attribute (with a path)", () => {
        expect(
            validate.module(
                true,
                _readRuleSet("./test/validate/fixtures/rules.reachable.path.json"),
                {source: "something", reachable: false}
            )
        ).to.deep.equal({
            valid: false,
            rules: [
                {
                    name: "no-unreachable",
                    severity: "warn"
                }
            ]
        });
    });

    it("Triggers on modules that have a reachable attribute (with a pathNot)", () => {
        expect(
            validate.module(
                true,
                _readRuleSet("./test/validate/fixtures/rules.reachable.pathnot.json"),
                {source: "something", reachable: false}
            )
        ).to.deep.equal({valid: true});
    });
});
