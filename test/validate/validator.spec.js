"use strict";
const expect    = require('chai').expect;
const validator = require('../../src/validate');

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

    it("barfs on an invalid rules file", () => {
        try {
            validator.validate(
                true,
                "./test/fixtures/rules.not-a-valid-rulesfile.json",
                "koos koets",
                {"resolved": "robby van de kerkhof"}
            );
            expect("not to be here").to.equal("still here, though");
        } catch (e) {
            expect(e).to.deep.equal(
                Error(
                    'The rules file is not valid: data should NOT have additional properties.'
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

    it("not to sub except sub itself - ok - sub to sub", () => {
        expect(
            validator.validate(
                true,
                "./test/fixtures/rules.not-to-sub-except-sub.json",
                "./keek/op/de/sub/week.js",
                {"resolved": "./keek/op/de/sub/maand.js", "coreModule": false}
            )
        ).to.deep.equal({valid: true});
    });

    it("not to sub except sub itself - ok - not sub to not sub", () => {
        expect(
            validator.validate(
                true,
                "./test/fixtures/rules.not-to-sub-except-sub.json",
                "./doctor/clavan.js",
                {"resolved": "./rochebrune.js", "coreModule": false}
            )
        ).to.deep.equal({valid: true});
    });

    it("not to sub except sub itself - ok - sub to not sub", () => {
        expect(
            validator.validate(
                true,
                "./test/fixtures/rules.not-to-sub-except-sub.json",
                "./doctor/sub/clavan.js",
                {"resolved": "./rochebrune.js", "coreModule": false}
            )
        ).to.deep.equal({valid: true});
    });

    it("not to sub except sub itself  - violation - not sub to sub", () => {
        expect(
            validator.validate(
                true,
                "./test/fixtures/rules.not-to-sub-except-sub.json",
                "./doctor/clavan.js",
                {"resolved": "./keek/op/de/sub/week.js", "coreModule": false}
            )
        ).to.deep.equal({valid: false, rule: {severity: 'error', name: 'not-to-sub-except-sub'}});
    });

    it("not to not sub (=> everything must go to 'sub')- ok - sub to sub", () => {
        expect(
            validator.validate(
                true,
                "./test/fixtures/rules.not-to-not-sub.json",
                "./keek/op/de/sub/week.js",
                {"resolved": "./keek/op/de/sub/maand.js", "coreModule": false}
            )
        ).to.deep.equal({valid: true});
    });

    it("not to not sub (=> everything must go to 'sub')- violation - not sub to not sub", () => {
        expect(
            validator.validate(
                true,
                "./test/fixtures/rules.not-to-not-sub.json",
                "./amber.js",
                {"resolved": "./jade.js", "coreModule": false}
            )
        ).to.deep.equal({valid: false, rule: {severity: 'error', name: 'not-to-not-sub'}});
    });
});
