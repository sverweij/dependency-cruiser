"use strict";
const fs       = require('fs');
const expect   = require('chai').expect;
const validate = require('../../../src/main/ruleSet/validate');

function shouldBarfWithMessage(pRulesFile, pMessage) {
    try {
        validate(
            JSON.parse(
                fs.readFileSync(pRulesFile, 'utf8')
            )
        );
        expect("not to be here").to.equal("still here, though");
    } catch (e) {
        expect(e.message).to.contain(
            pMessage
        );
    }
}

function shouldBeOK(pRulesFile){
    const lRulesObject = JSON.parse(
        fs.readFileSync(pRulesFile, 'utf8')
    );

    expect(
        validate(
            lRulesObject
        )
    ).to.deep.equal(
        lRulesObject
    );
}

describe("ruleSetReader", () => {
    it("bails out on scary regexps in paths", () => {
        shouldBarfWithMessage(
            "./test/validate/fixtures/rules.scary-regex.json",
            'rule {"from":{"path":".+"},"to":{"path":"(.+)*"}} has an unsafe regular expression. Bailing out.\n'
        );
    });

    it("bails out on scary regexps in pathNots", () => {
        shouldBarfWithMessage(
            "./test/validate/fixtures/rules.scary-regex-in-pathnot.json",
            'rule {"from":{"path":".+"},"to":{"pathNot":"(.+)*"}} has an unsafe regular expression. Bailing out.\n'
        );
    });

    it("bails out on scary regexps in licenses", () => {
        shouldBarfWithMessage(
            "./test/validate/fixtures/rules.scary-regex-in-license.json",
            'rule {"from":{},"to":{"license":"(.+)*"}} has an unsafe regular expression. Bailing out.\n'
        );
    });


    it("bails out on scary regexps in licenseNots", () => {
        shouldBarfWithMessage(
            "./test/validate/fixtures/rules.scary-regex-in-licensenot.json",
            'rule {"from":{},"to":{"licenseNot":"(.+)*"}} has an unsafe regular expression. Bailing out.\n'
        );
    });

    it("barfs on an invalid rules file", () => {
        shouldBarfWithMessage(
            "./test/validate/fixtures/rules.not-a-valid-rulesfile.json",
            "The rules file is not valid: data should NOT have additional properties."
        );
    });

    it("accepts an empty 'options' object", () => {
        shouldBeOK("./test/validate/fixtures/rules.empty-options-section.json");
    });

    it("accepts a 'webpackConfig' config", () => {
        shouldBeOK("./test/validate/fixtures/rules.options-section-webpack-config.json");
    });

    it("accepts a 'dependencyTypes' with value 'aliased'", () => {
        shouldBeOK("./test/validate/fixtures/rules.no-aliased-dependency-types.json");
    });
    

    it("accepts some command line options in a 'options' object", () => {
        shouldBeOK("./test/validate/fixtures/rules.options-section.json");
    });

    it("bails out on scary regexps in options.doNotFollow", () => {
        shouldBarfWithMessage(
            "./test/validate/fixtures/rules.options-section-scary-regex-do-not-follow.json",
            'The pattern \'(.*)*\' will probably run very slowly - cowardly refusing to run.\n'
        );
    });

    it("bails out on scary regexps in options.exclude", () => {
        shouldBarfWithMessage(
            "./test/validate/fixtures/rules.options-section-scary-regex-exclude.json",
            'The pattern \'(.*)*\' will probably run very slowly - cowardly refusing to run.\n'
        );
    });


});
