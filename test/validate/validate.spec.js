"use strict";
const expect      = require('chai').expect;
const validate    = require('../../src/validate');
const readRuleSet = require('../../src/validate/readRuleSet');
const fs          = require('fs');

function _readRuleSet(pFileName) {
    return readRuleSet(
        fs.readFileSync(pFileName, 'utf8')
    );
}

describe("validate - generic tests", () => {

    it("is ok with the empty validation", () => {
        expect(
            validate(
                true,
                _readRuleSet("./test/validate/fixtures/rules.empty.json"),
                "koos koets",
                {"resolved": "robby van de kerkhof"}
            )
        ).to.deep.equal({valid: true});
    });

    it("is ok with the 'everything allowed' validation", () => {
        expect(
            validate(
                true,
                _readRuleSet("./test/validate/fixtures/rules.everything-allowed.json"),
                "koos koets",
                {"resolved": "robby van de kerkhof"}
            )
        ).to.deep.equal({valid: true});
    });

    it("is ok with the 'everything allowed' validation", () => {
        expect(
            validate(
                true,
                _readRuleSet("./test/validate/fixtures/rules.impossible-to-match-allowed.json"),
                "koos koets",
                {"resolved": "robby van de kerkhof"}
            )
        ).to.deep.equal({valid: false, rule: {severity: "warn", "name": "not-in-allowed"}});
    });


    it("is ok with the 'nothing allowed' validation", () => {
        expect(
            validate(
                true,
                _readRuleSet("./test/validate/fixtures/rules.nothing-allowed.json"),
                "koos koets",
                {"resolved": "robby van de kerkhof"}
            )
        ).to.deep.equal({valid: false, rule: {severity: 'warn', name: 'unnamed'}});
    });
});

describe("validate - specific tests", () => {
    it("node_modules inhibition - ok", () => {
        expect(
            validate(
                true,
                _readRuleSet("./test/validate/fixtures/rules.node_modules-not-allowed.json"),
                "koos koets",
                {"resolved": "robby van de kerkhof"}
            )
        ).to.deep.equal({valid: true});
    });

    it("node_modules inhibition - violation", () => {
        expect(
            validate(
                true,
                _readRuleSet("./test/validate/fixtures/rules.node_modules-not-allowed.json"),
                "koos koets",
                {"resolved": "./node_modules/evil-module"}
            )
        ).to.deep.equal({valid: false, rule: {severity: 'warn', name: 'unnamed'}});
    });

    it("not to core - ok", () => {
        expect(
            validate(
                true,
                _readRuleSet("./test/validate/fixtures/rules.not-to-core.json"),
                "koos koets",
                {"resolved": "path", "dependencyTypes": ["npm"]}
            )
        ).to.deep.equal({valid: true});
    });

    it("not to core - violation", () => {
        expect(
            validate(
                true,
                _readRuleSet("./test/validate/fixtures/rules.not-to-core.json"),
                "koos koets",
                {"resolved": "path", "dependencyTypes": ["core"]}
            )
        ).to.deep.equal({valid: false, rule: {severity: 'error', name: 'not-to-core'}});
    });

    it("not to core fs os - ok", () => {
        expect(
            validate(
                true,
                _readRuleSet("./test/validate/fixtures/rules.not-to-core-fs-os.json"),
                "koos koets",
                {"resolved": "path", "dependencyTypes": ["core"]}
            )
        ).to.deep.equal({valid: true});
    });


    it("not to core fs os - violation", () => {
        expect(
            validate(
                true,
                _readRuleSet("./test/validate/fixtures/rules.not-to-core-fs-os.json"),
                "koos koets",
                {"resolved": "os", "dependencyTypes": ["core"]}
            )
        ).to.deep.equal({valid: false, rule: {severity: 'error', name: 'not-to-core-fs-os'}});
    });

    it("not to unresolvable - ok", () => {
        expect(
            validate(
                true,
                _readRuleSet("./test/validate/fixtures/rules.not-to-unresolvable.json"),
                "koos koets",
                {"resolved": "diana charitee", "couldNotResolve": false}
            )
        ).to.deep.equal({valid: true});
    });


    it("not to unresolvable - violation", () => {
        expect(
            validate(
                true,
                _readRuleSet("./test/validate/fixtures/rules.not-to-unresolvable.json"),
                "koos koets",
                {"resolved": "diana charitee", "couldNotResolve": true}
            )
        ).to.deep.equal({valid: false, rule: {severity: 'error', name: 'not-to-unresolvable'}});
    });

    it("only to core - via 'allowed' - ok", () => {
        expect(
            validate(
                true,
                _readRuleSet("./test/validate/fixtures/rules.only-to-core.allowed.json"),
                "koos koets",
                {"resolved": "os", "dependencyTypes": ["core"]}
            )
        ).to.deep.equal({valid: true});
    });

    it("only to core - via 'allowed' - violation", () => {
        expect(
            validate(
                true,
                _readRuleSet("./test/validate/fixtures/rules.only-to-core.allowed.json"),
                "koos koets",
                {"resolved": "ger hekking", "dependencyTypes": ["npm"]}
            )
        ).to.deep.equal({valid: false, rule: {severity: 'warn', name: 'not-in-allowed'}});
    });

    it("only to core - via 'forbidden' - ok", () => {
        expect(
            validate(
                true,
                _readRuleSet("./test/validate/fixtures/rules.only-to-core.forbidden.json"),
                "koos koets",
                {"resolved": "os", "dependencyTypes": ["core"]}
            )
        ).to.deep.equal({valid: true});
    });

    it("only to core - via 'forbidden' - violation", () => {
        expect(
            validate(
                true,
                _readRuleSet("./test/validate/fixtures/rules.only-to-core.forbidden.json"),
                "koos koets",
                {"resolved": "ger hekking", "dependencyTypes": ["local"]}
            )
        ).to.deep.equal({valid: false, rule: {severity: 'error', name: 'only-to-core'}});
    });

    it("not to sub except sub itself - ok - sub to sub", () => {
        expect(
            validate(
                true,
                _readRuleSet("./test/validate/fixtures/rules.not-to-sub-except-sub.json"),
                "./keek/op/de/sub/week.js",
                {"resolved": "./keek/op/de/sub/maand.js", "coreModule": false}
            )
        ).to.deep.equal({valid: true});
    });

    it("not to sub except sub itself - ok - not sub to not sub", () => {
        expect(
            validate(
                true,
                _readRuleSet("./test/validate/fixtures/rules.not-to-sub-except-sub.json"),
                "./doctor/clavan.js",
                {"resolved": "./rochebrune.js", "coreModule": false}
            )
        ).to.deep.equal({valid: true});
    });

    it("not to sub except sub itself - ok - sub to not sub", () => {
        expect(
            validate(
                true,
                _readRuleSet("./test/validate/fixtures/rules.not-to-sub-except-sub.json"),
                "./doctor/sub/clavan.js",
                {"resolved": "./rochebrune.js", "coreModule": false}
            )
        ).to.deep.equal({valid: true});
    });

    it("not to sub except sub itself  - violation - not sub to sub", () => {
        expect(
            validate(
                true,
                _readRuleSet("./test/validate/fixtures/rules.not-to-sub-except-sub.json"),
                "./doctor/clavan.js",
                {"resolved": "./keek/op/de/sub/week.js", "coreModule": false}
            )
        ).to.deep.equal({valid: false, rule: {severity: 'error', name: 'not-to-sub-except-sub'}});
    });

    it("not to not sub (=> everything must go to 'sub')- ok - sub to sub", () => {
        expect(
            validate(
                true,
                _readRuleSet("./test/validate/fixtures/rules.not-to-not-sub.json"),
                "./keek/op/de/sub/week.js",
                {"resolved": "./keek/op/de/sub/maand.js", "coreModule": false}
            )
        ).to.deep.equal({valid: true});
    });

    it("not to not sub (=> everything must go to 'sub')- violation - not sub to not sub", () => {
        expect(
            validate(
                true,
                _readRuleSet("./test/validate/fixtures/rules.not-to-not-sub.json"),
                "./amber.js",
                {"resolved": "./jade.js", "coreModule": false}
            )
        ).to.deep.equal({valid: false, rule: {severity: 'error', name: 'not-to-not-sub'}});
    });

    it("not-to-dev-dep disallows relations to develop dependencies", () => {
        expect(
            validate(
                true,
                _readRuleSet("./test/validate/fixtures/rules.not-to-dev-dep.json"),
                "src/aap/zus/jet.js",
                {
                    "module": "chai",
                    "resolved": "node_modules/chai/index.js",
                    "dependencyTypes": ["npm-dev"]
                }
            )
        ).to.deep.equal({
            valid: false,
            rule : {
                name: "not-to-dev-dep",
                severity: "error"
            }
        });
    });

    it("not-to-dev-dep does allow relations to regular dependencies", () => {
        expect(
            validate(
                true,
                _readRuleSet("./test/validate/fixtures/rules.not-to-dev-dep.json"),
                "src/aap/zus/jet.js",
                {
                    "module": "jip",
                    "resolved": "node_modules/jip/janneke.js",
                    "dependencyTypes": ["npm"]
                }
            )
        ).to.deep.equal({valid: true});
    });

    it(`no relations with modules of > 1 dep type (e.g. specified 2x in package.json)`, () => {
        expect(
            validate(
                true,
                _readRuleSet("./test/validate/fixtures/rules.no-duplicate-dep-types.json"),
                "src/aap/zus/jet.js",
                {
                    "module": "chai",
                    "resolved": "node_modules/chai/index.js",
                    "dependencyTypes": ["npm", "npm-dev"]
                }
            )
        ).to.deep.equal({
            valid: false,
            rule : {
                name: "no-duplicate-dep-types",
                severity: "warn"
            }
        });
    });
});

describe("validate - ownFolder check", () => {
    it("ownFolder === false: allows dependencies within the same folder", () => {
        expect(
            validate(
                true,
                _readRuleSet("./test/validate/fixtures/rules.ownfolder-false.json"),
                "src/aap/kooskoets.ts",
                {"resolved": "src/aap/robbyVanDeKerhof.ts"}
            )
        ).to.deep.equal({valid: true});
    });

    it("ownFolder === false: allows dependencies within subs of the same folder", () => {
        expect(
            validate(
                true,
                _readRuleSet("./test/validate/fixtures/rules.ownfolder-false.json"),
                "src/aap/kooskoets.ts",
                {"resolved": "src/aap/chimpansee/robbyVanDeKerhof.ts"}
            )
        ).to.deep.equal({valid: true});
    });

    it("ownFolder === false: allows dependencies within subs of the same folder", () => {
        expect(
            validate(
                true,
                _readRuleSet("./test/validate/fixtures/rules.ownfolder-false.json"),
                "src/aap/rhesus/kooskoets.ts",
                {"resolved": "src/aap/robbyVanDeKerhof.ts"}
            )
        ).to.deep.equal({valid: true});
    });

    it("ownFolder === false: disallows dependencies between peer folders", () => {
        expect(
            validate(
                true,
                _readRuleSet("./test/validate/fixtures/rules.ownfolder-false.json"),
                "src/aap/kooskoets.ts",
                {"resolved": "src/noot/robbyVanDeKerhof.ts"}
            )
        ).to.deep.equal({valid: false, rule: {severity: 'error', name: 'not-between'}});
    });

    it("ownFolder === true: disallows dependencies within the same folder", () => {
        expect(
            validate(
                true,
                _readRuleSet("./test/validate/fixtures/rules.ownfolder-true.json"),
                "src/aap/kooskoets.ts",
                {"resolved": "src/aap/robbyVanDeKerhof.ts"}
            )
        ).to.deep.equal({valid: false, rule: {severity: 'error', name: 'not-between'}});
    });

    it("ownFolder === true: disallows dependencies within subs of the same folder", () => {
        expect(
            validate(
                true,
                _readRuleSet("./test/validate/fixtures/rules.ownfolder-true.json"),
                "src/aap/kooskoets.ts",
                {"resolved": "src/aap/chimpansee/robbyVanDeKerhof.ts"}
            )
        ).to.deep.equal({valid: false, rule: {severity: 'error', name: 'not-between'}});
    });

    it("ownFolder === true: disallows dependencies from subs to the same folder", () => {
        expect(
            validate(
                true,
                _readRuleSet("./test/validate/fixtures/rules.ownfolder-true.json"),
                "src/aap/rhesus/kooskoets.ts",
                {"resolved": "src/aap/robbyVanDeKerhof.ts"}
            )
        ).to.deep.equal({valid: false, rule: {severity: 'error', name: 'not-between'}});
    });

    it("ownFolder === true: allows dependencies between peer folders", () => {
        expect(
            validate(
                true,
                _readRuleSet("./test/validate/fixtures/rules.ownfolder-true.json"),
                "src/aap/kooskoets.ts",
                {"resolved": "src/noot/robbyVanDeKerhof.ts"}
            )
        ).to.deep.equal({valid: true});
    });

});

describe("group matching - path group matched in a pathnot", () => {

    it("group-to-pathnot - Disallows dependencies between peer folders", () => {
        expect(
            validate(
                true,
                _readRuleSet("./test/validate/fixtures/rules.group-to-pathnot.json"),
                "src/aap/chimpansee.ts",
                {"resolved": "src/noot/pinda.ts"}
            )
        ).to.deep.equal(
            {
                "valid": false,
                "rule": {
                    "name": "group-to-pathnot",
                    "severity": "warn"
                }
            }
        );
    });

    it("group-to-pathnot - Allows dependencies within to peer folder 'shared'", () => {
        expect(
            validate(
                true,
                _readRuleSet("./test/validate/fixtures/rules.group-to-pathnot.json"),
                "src/aap/chimpansee.ts",
                {"resolved": "src/shared/bananas.ts"}
            )
        ).to.deep.equal({valid: true});
    });

    it("group-to-pathnot - Allows dependencies within own folder", () => {
        expect(
            validate(
                true,
                _readRuleSet("./test/validate/fixtures/rules.group-to-pathnot.json"),
                "src/aap/chimpansee.ts",
                {"resolved": "src/aap/oerangoetang.ts"}
            )
        ).to.deep.equal({valid: true});
    });

    it("group-to-pathnot - Allows dependencies to sub folders of own folder", () => {
        expect(
            validate(
                true,
                _readRuleSet("./test/validate/fixtures/rules.group-to-pathnot.json"),
                "src/aap/chimpansee.ts",
                {"resolved": "src/aap/speeltuigen/autoband.ts"}
            )
        ).to.deep.equal({valid: true});
    });

    it("group-to-pathnot - Allows peer dependencies between sub folders of own folder", () => {
        expect(
            validate(
                true,
                _readRuleSet("./test/validate/fixtures/rules.group-to-pathnot.json"),
                "src/aap/rekwisieten/touw.ts",
                {"resolved": "src/aap/speeltuigen/autoband.ts"}
            )
        ).to.deep.equal({valid: true});
    });
});

describe("group matching - path group matched in a pathnot", () => {

    it("group-two-to-pathnot - Disallows dependencies between peer folders", () => {
        expect(
            validate(
                true,
                _readRuleSet("./test/validate/fixtures/rules.group-two-to-pathnot.json"),
                "src/aap/chimpansee.ts",
                {"resolved": "src/noot/pinda.ts"}
            )
        ).to.deep.equal(
            {
                "valid": false,
                "rule": {
                    "name": "group-two-to-pathnot",
                    "severity": "warn"
                }
            }
        );
    });

    it("group-two-to-pathnot - Allows dependencies within to peer folder 'shared'", () => {
        expect(
            validate(
                true,
                _readRuleSet("./test/validate/fixtures/rules.group-two-to-pathnot.json"),
                "src/aap/chimpansee.ts",
                {"resolved": "src/shared/bananas.ts"}
            )
        ).to.deep.equal({valid: true});
    });

    it("group-two-to-pathnot - Allows dependencies within own folder", () => {
        expect(
            validate(
                true,
                _readRuleSet("./test/validate/fixtures/rules.group-two-to-pathnot.json"),
                "src/aap/chimpansee.ts",
                {"resolved": "src/aap/oerangoetang.ts"}
            )
        ).to.deep.equal({valid: true});
    });

    it("group-two-to-pathnot - Allows dependencies to sub folders of own folder", () => {
        expect(
            validate(
                true,
                _readRuleSet("./test/validate/fixtures/rules.group-two-to-pathnot.json"),
                "src/aap/chimpansee.ts",
                {"resolved": "src/aap/speeltuigen/autoband.ts"}
            )
        ).to.deep.equal({valid: true});
    });

    it("group-two-to-pathnot - Allows peer dependencies between sub folders of own folder", () => {
        expect(
            validate(
                true,
                _readRuleSet("./test/validate/fixtures/rules.group-two-to-pathnot.json"),
                "src/aap/rekwisieten/touw.ts",
                {"resolved": "src/aap/speeltuigen/autoband.ts"}
            )
        ).to.deep.equal({valid: true});
    });
});
