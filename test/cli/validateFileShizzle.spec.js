"use strict";
const expect             = require('chai').expect;
const validateFileShizzle = require('../../src/cli/validateFileShizzle');

describe("validateFileShizzle", () => {
    it("throws when the file or dir passed does not exists", () => {
        try {
            validateFileShizzle(["file-or-dir-does-not-exist"]);
            expect("not to be here").to.equal("still here, though");
        } catch (e) {
            expect(e.toString()).to.deep.equal(
                "Error: Can't open 'file-or-dir-does-not-exist' for reading. Does it exist?\n"
            );
        }
    });

    it("throws when the rules file or dir passed does not exist", () => {
        try {
            validateFileShizzle(["test/cli/fixtures"], "non-existing-rule-file");
            expect("not to be here").to.equal("still here, though");
        } catch (e) {
            expect(e.toString()).to.deep.equal(
                "Error: Can't open 'non-existing-rule-file' for reading. Does it exist?\n"
            );
        }
    });

    it("throws when validate is passed nakedly, but .dependency-cruiser does not exist", () => {
        try {
            validateFileShizzle(["test/cli/fixtures"], true);
            expect("not to be here").to.equal("still here, though");
        } catch (e) {
            expect(e.toString()).to.deep.equal(
                "Error: Can't open '.dependency-cruiser.json' for reading. Does it exist?\n"
            );
        }
    });

    it("passes when the rules file or dir passed does exist", () => {
        try {
            validateFileShizzle(["test/cli/fixtures"], "test/validate/fixtures/rules.empty.json");
            expect("to be here without throws happening").to.equal("to be here without throws happening");
        } catch (e) {
            expect("not to be here").to.equal(`still here, though: ${e}`);
        }
    });

});
