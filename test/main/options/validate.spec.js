"use strict";
const expect          = require('chai').expect;
const validateOptions = require('../../../src/main/options/validate');

describe("validateOptions", () => {

    it("throws when a invalid module system is passed ", () => {
        try {
            validateOptions({"moduleSystems": ["notavalidmodulesystem"]});
            expect("not to be here").to.equal("still here, though");
        } catch (e) {
            expect(e.toString()).to.deep.equal(
                "Error: Invalid module system list: 'notavalidmodulesystem'\n"
            );
        }
    });

    it("passes when a valid module system is passed", () => {
        try {
            validateOptions({"moduleSystems": ["cjs"]});
            expect("to be here without throws happening").to.equal("to be here without throws happening");
        } catch (e) {
            expect("not to be here").to.equal(`still here, though: ${e}`);
        }
    });

    it("throws when a invalid output type is passed ", () => {
        try {
            validateOptions({"outputType": "notAValidOutputType"});
            expect("not to be here").to.equal("still here, though");
        } catch (e) {
            expect(e.toString()).to.deep.equal(
                "Error: 'notAValidOutputType' is not a valid output type.\n"
            );
        }
    });

    it("passes when a valid output type is passed", () => {
        try {
            validateOptions({"outputType": "err"});
            expect("to be here without throws happening").to.equal("to be here without throws happening");
        } catch (e) {
            expect("not to be here").to.equal(`still here, though: ${e}`);
        }
    });

    it("throws when a non-integer is passed as maxDepth", () => {
        try {
            validateOptions({"maxDepth": "not an integer"});
            expect("not to be here").to.equal("still here, though");
        } catch (e) {
            expect(e.toString()).to.deep.equal(
                "Error: 'not an integer' is not a valid depth - use an integer between 0 and 99"
            );
        }
    });

    it("throws when > 99 is passed as maxDepth", () => {
        try {
            validateOptions({"maxDepth": "101"});
            expect("not to be here").to.equal("still here, though");
        } catch (e) {
            expect(e.toString()).to.deep.equal(
                "Error: '101' is not a valid depth - use an integer between 0 and 99"
            );
        }
    });

    it("throws when < 0 is passed as maxDepth", () => {
        try {
            validateOptions({"maxDepth": "-1"});
            expect("not to be here").to.equal("still here, though");
        } catch (e) {
            expect(e.toString()).to.deep.equal(
                "Error: '-1' is not a valid depth - use an integer between 0 and 99"
            );
        }
    });

    it("passes when a valid depth is passed as maxDepth", () => {
        try {
            validateOptions({"maxDepth": "42"});
            expect("to be here without throws happening").to.equal("to be here without throws happening");
        } catch (e) {
            expect("not to be here").to.equal(`still here, though: ${e}`);
        }
    });

    it("throws when --exclude is passed an unsafe regex", () => {
        try {
            validateOptions({"exclude": "([A-Za-z]+)*"});
            expect("not to be here").to.equal("still here, though");
        } catch (e) {
            expect(e.toString()).to.deep.equal(
                "Error: The pattern '([A-Za-z]+)*' will probably run very slowly - cowardly refusing to run.\n"
            );
        }
    });

    it("passes when --exclude is passed an safe regex", () => {
        try {
            validateOptions({"exclude": "([A-Za-z]+)"});
            expect("to be here without throws happening").to.equal("to be here without throws happening");
        } catch (e) {
            expect("not to be here").to.equal(`still here, though: ${e}`);
        }
    });
});
