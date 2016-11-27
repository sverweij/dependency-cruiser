"use strict";
const expect    = require('chai').expect;
const validator = require('../src/validate/validator');

describe("validator", () => {

    it("bails out on scary regexps", () => {
        try {
            validator.validate(
                true,
                "./test/fixtures/rules.scary-regex.json",
                "koos koets",
                {"resolved": "robby van de kerkhof"}
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

    it("is ok with the empty validation", () => {
        expect(
            validator.validate(
                true,
                "./test/fixtures/rules.empty.json",
                "koos koets",
                {"resolved": "robby van de kerkhof"}
            )
        ).to.deep.equal({valid: true});
    });

    it("is ok with the 'everything allowed' validation", () => {
        expect(
            validator.validate(
                true,
                "./test/fixtures/rules.everything-allowed.json",
                "koos koets",
                {"resolved": "robby van de kerkhof"}
            )
        ).to.deep.equal({valid: true});
    });

    it("is ok with the 'everything allowed' validation", () => {
        expect(
            validator.validate(
                true,
                "./test/fixtures/rules.impossible-to-match-allowed.json",
                "koos koets",
                {"resolved": "robby van de kerkhof"}
            )
        ).to.deep.equal({valid: false, rule: {severity: "warn", "name": "not-in-allowed"}});
    });


    it("is ok with the 'nothing allowed' validation", () => {
        expect(
            validator.validate(
                true,
                "./test/fixtures/rules.nothing-allowed.json",
                "koos koets",
                {"resolved": "robby van de kerkhof"}
            )
        ).to.deep.equal({valid: false, rule: {severity: 'warn', name: 'unnamed'}});
    });

    it("node_modules inhibition - ok", () => {
        expect(
            validator.validate(
                true,
                "./test/fixtures/rules.node_modules-not-allowed.json",
                "koos koets",
                {"resolved": "robby van de kerkhof"}
            )
        ).to.deep.equal({valid: true});
    });

    it("node_modules inhibition - violation", () => {
        expect(
            validator.validate(
                true,
                "./test/fixtures/rules.node_modules-not-allowed.json",
                "koos koets",
                {"resolved": "./node_modules/evil-module"}
            )
        ).to.deep.equal({valid: false, rule: {severity: 'warn', name: 'unnamed'}});
    });

    it("not to core - ok", () => {
        expect(
            validator.validate(
                true,
                "./test/fixtures/rules.not-to-core.json",
                "koos koets",
                {"resolved": "path", "coreModule": false}
            )
        ).to.deep.equal({valid: true});
    });

    it("not to core - violation", () => {
        expect(
            validator.validate(
                true,
                "./test/fixtures/rules.not-to-core.json",
                "koos koets",
                {"resolved": "path", "coreModule": true}
            )
        ).to.deep.equal({valid: false, rule: {severity: 'error', name: 'not-to-core'}});
    });

    it("not to core fs os - ok", () => {
        expect(
            validator.validate(
                true,
                "./test/fixtures/rules.not-to-core-fs-os.json",
                "koos koets",
                {"resolved": "path", "coreModule": true}
            )
        ).to.deep.equal({valid: true});
    });


    it("not to core fs os - violation", () => {
        expect(
            validator.validate(
                true,
                "./test/fixtures/rules.not-to-core-fs-os.json",
                "koos koets",
                {"resolved": "os", "coreModule": true}
            )
        ).to.deep.equal({valid: false, rule: {severity: 'error', name: 'not-to-core-fs-os'}});
    });

    it("not to unresolvable - ok", () => {
        expect(
            validator.validate(
                true,
                "./test/fixtures/rules.not-to-unresolvable.json",
                "koos koets",
                {"resolved": "diana charitee", "couldNotResolve": false}
            )
        ).to.deep.equal({valid: true});
    });


    it("not to unresolvable - violation", () => {
        expect(
            validator.validate(
                true,
                "./test/fixtures/rules.not-to-unresolvable.json",
                "koos koets",
                {"resolved": "diana charitee", "couldNotResolve": true}
            )
        ).to.deep.equal({valid: false, rule: {severity: 'error', name: 'not-to-unresolvable'}});
    });

    it("only to core - via 'allowed' - ok", () => {
        expect(
            validator.validate(
                true,
                "./test/fixtures/rules.only-to-core.allowed.json",
                "koos koets",
                {"resolved": "os", "coreModule": true}
            )
        ).to.deep.equal({valid: true});
    });

    it("only to core - via 'allowed' - violation", () => {
        expect(
            validator.validate(
                true,
                "./test/fixtures/rules.only-to-core.allowed.json",
                "koos koets",
                {"resolved": "ger hekking", "coreModule": false}
            )
        ).to.deep.equal({valid: false, rule: {severity: 'warn', name: 'not-in-allowed'}});
    });

    it("only to core - via 'forbidden' - ok", () => {
        expect(
            validator.validate(
                true,
                "./test/fixtures/rules.only-to-core.forbidden.json",
                "koos koets",
                {"resolved": "os", "coreModule": true}
            )
        ).to.deep.equal({valid: true});
    });

    it("only to core - via 'forbidden' - violation", () => {
        expect(
            validator.validate(
                true,
                "./test/fixtures/rules.only-to-core.forbidden.json",
                "koos koets",
                {"resolved": "ger hekking", "coreModule": false}
            )
        ).to.deep.equal({valid: false, rule: {severity: 'error', name: 'only-to-core'}});
    });
});
