"use strict";
const expect           = require('chai').expect;
const validator = require('../src/validate/validator');

describe("validator", () => {
    it("is ok with the empty validation", () => {
        expect(
            validator.validate(
                true,
                "./test/fixtures/rules.empty.json",
                "koos koets",
                "robby van de kerkhof"
            )
        ).to.equal(true);
    });

    it("is ok with the 'everything allowed' validation", () => {
        expect(
            validator.validate(
                true,
                "./test/fixtures/rules.everything-allowed.json",
                "koos koets",
                "robby van de kerkhof"
            )
        ).to.equal(true);
    });

    it("is ok with the 'nothing allowed' validation", () => {
        expect(
            validator.validate(
                true,
                "./test/fixtures/rules.nothing-allowed.json",
                "koos koets",
                "robby van de kerkhof"
            )
        ).to.equal(false);
    });

    it("node_modules inhibition - ok", () => {
        expect(
            validator.validate(
                true,
                "./test/fixtures/rules.node_modules-not-allowed.json",
                "koos koets",
                "robby van de kerkhof"
            )
        ).to.equal(true);
    });

    it("node_modules inhibition - transgression", () => {
        expect(
            validator.validate(
                true,
                "./test/fixtures/rules.node_modules-not-allowed.json",
                "koos koets",
                "./node_modules/evil-module"
            )
        ).to.equal(false);
    });

    it("bails out on scary regexps", () => {
        try {
            validator.validate(
                true,
                "./test/fixtures/rules.scary-regex.json",
                "koos koets",
                "robby van de kerkhof"
            );
            expect("not to be here").to.equal("still here, though");
        } catch (e) {
            expect(e).to.deep.equal(
                Error(
                    'Error: rule {"from":".+","to":"(.+)*"} has an unsafe regular expression. Bailing out.\n'
                )
            );
        }
    });
});
