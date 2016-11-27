"use strict";
const expect             = require('chai').expect;
const parameterValidator = require('../src/cli/parameterValidator');

describe("parameterValidator", () => {
    it("throws when the file or dir passed does not exists", () => {
        try {
            parameterValidator("file-or-dir-does-not-exist");
            expect("not to be here").to.equal("still here, though");
        } catch (e) {
            expect(e).to.deep.equal(Error("Can't open 'file-or-dir-does-not-exist' for reading. Does it exist?\n"));
        }
    });

    it("throws when the rules file or dir passed does not exist", () => {
        try {
            parameterValidator("test/fixtures", {"validate": "non-existing-rule-file"});
            expect("not to be here").to.equal("still here, though");
        } catch (e) {
            expect(e).to.deep.equal(Error("Can't open 'non-existing-rule-file' for reading. Does it exist?\n"));
        }
    });

    it("throws when validate is passed nakedly, but .dependency-cruiser does not exist", () => {
        try {
            parameterValidator("test/fixtures", {"validate": true});
            expect("not to be here").to.equal("still here, though");
        } catch (e) {
            expect(e).to.deep.equal(Error("Can't open '.dependency-cruiser.json' for reading. Does it exist?\n"));
        }
    });

    it("passes when the rules file or dir passed does exist", () => {
        try {
            parameterValidator("test/fixtures", {"validate": "test/fixtures/rules.empty.json"});
            expect("to be here without throws happening").to.equal("to be here without throws happening");
        } catch (e) {
            expect("not to be here").to.equal(`still here, though: ${e}`);
        }

    });
});
