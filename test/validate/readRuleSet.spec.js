"use strict";
const expect      = require('chai').expect;
const readRuleSet = require('../../src/validate/readRuleSet');
const fs          = require('fs');

describe("ruleSetReader", () => {
    it("bails out on scary regexps", () => {
        try {
            readRuleSet(
                fs.readFileSync("./test/validate/fixtures/rules.scary-regex.json", 'utf8')
            );
            expect("not to be here").to.equal("still here, though");
        } catch (e) {
            expect(e.message).to.contain(
                'rule {"from":{"path":".+"},"to":{"path":"(.+)*"}} has an unsafe regular expression. Bailing out.\n'
            );
        }
    });

    it("barfs on an invalid rules file", () => {
        try {
            readRuleSet(
                fs.readFileSync("./test/validate/fixtures/rules.not-a-valid-rulesfile.json")
            );
            expect("not to be here").to.equal("still here, though");
        } catch (e) {
            expect(e.message).to.contain(
                'The rules file is not valid: data should NOT have additional properties.'
            );
        }
    });

    it("also accept javascript objects", () => {
        expect(readRuleSet({})).to.deep.equal({});
    });
});
