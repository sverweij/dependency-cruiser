"use strict";
const expect   = require('chai').expect;
const validate = require('../../../src/main/ruleSet/validate');
const fs       = require('fs');

describe("ruleSetReader", () => {
    it("bails out on scary regexps in paths", () => {
        try {
            validate(
                JSON.parse(
                    fs.readFileSync("./test/validate/fixtures/rules.scary-regex.json", 'utf8')
                )
            );
            expect("not to be here").to.equal("still here, though");
        } catch (e) {
            expect(e.message).to.contain(
                'rule {"from":{"path":".+"},"to":{"path":"(.+)*"}} has an unsafe regular expression. Bailing out.\n'
            );
        }
    });

    it("bails out on scary regexps in pathNots", () => {
        try {
            validate(
                JSON.parse(
                    fs.readFileSync("./test/validate/fixtures/rules.scary-regex-in-pathnot.json", 'utf8')
                )
            );
            expect("not to be here").to.equal("still here, though");
        } catch (e) {
            expect(e.message).to.contain(
                'rule {"from":{"path":".+"},"to":{"pathNot":"(.+)*"}} has an unsafe regular expression. Bailing out.\n'
            );
        }
    });

    it("barfs on an invalid rules file", () => {
        try {
            validate(
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
        expect(validate({})).to.deep.equal({});
    });
});
