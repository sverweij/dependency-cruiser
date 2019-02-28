const fs               = require('fs');
const expect           = require('chai').expect;
const validate         = require('../../src/validate');
const normalizeRuleSet = require('../../src/main/ruleSet/normalize');
const validateRuleSet  = require('../../src/main/ruleSet/validate');

function _readRuleSet(pFileName) {
    return normalizeRuleSet(
        validateRuleSet(
            JSON.parse(fs.readFileSync(pFileName, 'utf8'))
        )
    );
}

describe("validate/index dependency - generic tests", () => {

    it("is ok with the empty validation", () => {
        expect(
            validate.dependency(
                true,
                _readRuleSet("./test/validate/fixtures/rules.empty.json"),
                {source: "koos koets"},
                {"resolved": "robby van de kerkhof"}
            )
        ).to.deep.equal({valid: true});
    });

    it("is ok with the 'everything allowed' validation", () => {
        expect(
            validate.dependency(
                true,
                _readRuleSet("./test/validate/fixtures/rules.everything-allowed.json"),
                {source: "koos koets"},
                {"resolved": "robby van de kerkhof"}
            )
        ).to.deep.equal({valid: true});
    });

    it("is ok with the 'everything allowed' validation - even when there's a module only rule in 'forbidden'", () => {
        expect(
            validate.module(
                true,
                _readRuleSet("./test/validate/fixtures/rules.module-only.empty.allowed.json"),
                {source: "koos koets"}
            )
        ).to.deep.equal({valid: true});
    });

    it("is ok with the 'impossible to match allowed' validation", () => {
        expect(
            validate.dependency(
                true,
                _readRuleSet("./test/validate/fixtures/rules.impossible-to-match-allowed.json"),
                {source: "koos koets"},
                {"resolved": "robby van de kerkhof"}
            )
        ).to.deep.equal({valid: false, rules: [{severity: "warn", "name": "not-in-allowed"}]});
    });

    it("is ok with the 'impossible to match allowed' validation - errors when configured so", () => {
        expect(
            validate.dependency(
                true,
                _readRuleSet("./test/validate/fixtures/rules.impossible-to-match-error.allowed.json"),
                {source: "koos koets"},
                {"resolved": "robby van de kerkhof"}
            )
        ).to.deep.equal({valid: false, rules: [{severity: "error", "name": "not-in-allowed"}]});
    });

    it("is ok with the 'nothing allowed' validation", () => {
        expect(
            validate.dependency(
                true,
                _readRuleSet("./test/validate/fixtures/rules.nothing-allowed.json"),
                {source: "koos koets"},
                {"resolved": "robby van de kerkhof"}
            )
        ).to.deep.equal({valid: false, rules: [{severity: 'warn', name: 'unnamed'}]});
    });

    it("if there's more than one violated rule, both are returned", () => {
        expect(
            validate.dependency(
                true,
                _readRuleSet("./test/validate/fixtures/rules.not-in-allowed-and-a-forbidden.json"),
                {source: "something"},
                {
                    "resolved": "src/some/thing/else.js"
                }
            )
        ).to.deep.equal(
            {
                valid: false,
                rules: [
                    {name: "everything-is-forbidden", severity: "error"},
                    {name: "not-in-allowed", severity: "info"}
                ]
            }
        );
    });

});

describe("validate/index - specific tests", () => {
    it("node_modules inhibition - ok", () => {
        expect(
            validate.dependency(
                true,
                _readRuleSet("./test/validate/fixtures/rules.node_modules-not-allowed.json"),
                {source: "koos koets"},
                {"resolved": "robby van de kerkhof"}
            )
        ).to.deep.equal({valid: true});
    });

    it("node_modules inhibition - violation", () => {
        expect(
            validate.dependency(
                true,
                _readRuleSet("./test/validate/fixtures/rules.node_modules-not-allowed.json"),
                {source: "koos koets"},
                {"resolved": "./node_modules/evil-module"}
            )
        ).to.deep.equal({valid: false, rules: [{severity: 'warn', name: 'unnamed'}]});
    });

    it("not to core - ok", () => {
        expect(
            validate.dependency(
                true,
                _readRuleSet("./test/validate/fixtures/rules.not-to-core.json"),
                {source: "koos koets"},
                {"resolved": "path", "dependencyTypes": ["npm"]}
            )
        ).to.deep.equal({valid: true});
    });

    it("not to core - violation", () => {
        expect(
            validate.dependency(
                true,
                _readRuleSet("./test/validate/fixtures/rules.not-to-core.json"),
                {source: "koos koets"},
                {"resolved": "path", "dependencyTypes": ["core"]}
            )
        ).to.deep.equal({valid: false, rules: [{severity: 'error', name: 'not-to-core'}]});
    });

    it("not to core fs os - ok", () => {
        expect(
            validate.dependency(
                true,
                _readRuleSet("./test/validate/fixtures/rules.not-to-core-fs-os.json"),
                {source: "koos koets"},
                {"resolved": "path", "dependencyTypes": ["core"]}
            )
        ).to.deep.equal({valid: true});
    });


    it("not to core fs os - violation", () => {
        expect(
            validate.dependency(
                true,
                _readRuleSet("./test/validate/fixtures/rules.not-to-core-fs-os.json"),
                {source: "koos koets"},
                {"resolved": "os", "dependencyTypes": ["core"]}
            )
        ).to.deep.equal({valid: false, rules: [{severity: 'error', name: 'not-to-core-fs-os'}]});
    });

    it("not to unresolvable - ok", () => {
        expect(
            validate.dependency(
                true,
                _readRuleSet("./test/validate/fixtures/rules.not-to-unresolvable.json"),
                {source: "koos koets"},
                {"resolved": "diana charitee", "couldNotResolve": false}
            )
        ).to.deep.equal({valid: true});
    });


    it("not to unresolvable - violation", () => {
        expect(
            validate.dependency(
                true,
                _readRuleSet("./test/validate/fixtures/rules.not-to-unresolvable.json"),
                {source: "koos koets"},
                {"resolved": "diana charitee", "couldNotResolve": true}
            )
        ).to.deep.equal({valid: false, rules: [{severity: 'error', name: 'not-to-unresolvable'}]});
    });

    it("only to core - via 'allowed' - ok", () => {
        expect(
            validate.dependency(
                true,
                _readRuleSet("./test/validate/fixtures/rules.only-to-core.allowed.json"),
                {source: "koos koets"},
                {"resolved": "os", "dependencyTypes": ["core"]}
            )
        ).to.deep.equal({valid: true});
    });

    it("only to core - via 'allowed' - violation", () => {
        expect(
            validate.dependency(
                true,
                _readRuleSet("./test/validate/fixtures/rules.only-to-core.allowed.json"),
                {source: "koos koets"},
                {"resolved": "ger hekking", "dependencyTypes": ["npm"]}
            )
        ).to.deep.equal({valid: false, rules: [{severity: 'warn', name: 'not-in-allowed'}]});
    });

    it("only to core - via 'forbidden' - ok", () => {
        expect(
            validate.dependency(
                true,
                _readRuleSet("./test/validate/fixtures/rules.only-to-core.forbidden.json"),
                {source: "koos koets"},
                {"resolved": "os", "dependencyTypes": ["core"]}
            )
        ).to.deep.equal({valid: true});
    });

    it("only to core - via 'forbidden' - violation", () => {
        expect(
            validate.dependency(
                true,
                _readRuleSet("./test/validate/fixtures/rules.only-to-core.forbidden.json"),
                {source: "koos koets"},
                {"resolved": "ger hekking", "dependencyTypes": ["local"]}
            )
        ).to.deep.equal({valid: false, rules: [{severity: 'error', name: 'only-to-core'}]});
    });

    it("not to sub except sub itself - ok - sub to sub", () => {
        expect(
            validate.dependency(
                true,
                _readRuleSet("./test/validate/fixtures/rules.not-to-sub-except-sub.json"),
                {source: "./keek/op/de/sub/week.js"},
                {"resolved": "./keek/op/de/sub/maand.js", "coreModule": false}
            )
        ).to.deep.equal({valid: true});
    });

    it("not to sub except sub itself - ok - not sub to not sub", () => {
        expect(
            validate.dependency(
                true,
                _readRuleSet("./test/validate/fixtures/rules.not-to-sub-except-sub.json"),
                {source: "./doctor/clavan.js"},
                {"resolved": "./rochebrune.js", "coreModule": false}
            )
        ).to.deep.equal({valid: true});
    });

    it("not to sub except sub itself - ok - sub to not sub", () => {
        expect(
            validate.dependency(
                true,
                _readRuleSet("./test/validate/fixtures/rules.not-to-sub-except-sub.json"),
                {source: "./doctor/sub/clavan.js"},
                {"resolved": "./rochebrune.js", "coreModule": false}
            )
        ).to.deep.equal({valid: true});
    });

    it("not to sub except sub itself  - violation - not sub to sub", () => {
        expect(
            validate.dependency(
                true,
                _readRuleSet("./test/validate/fixtures/rules.not-to-sub-except-sub.json"),
                {source: "./doctor/clavan.js"},
                {"resolved": "./keek/op/de/sub/week.js", "coreModule": false}
            )
        ).to.deep.equal({valid: false, rules: [{severity: 'error', name: 'not-to-sub-except-sub'}]});
    });

    it("not to not sub (=> everything must go to 'sub')- ok - sub to sub", () => {
        expect(
            validate.dependency(
                true,
                _readRuleSet("./test/validate/fixtures/rules.not-to-not-sub.json"),
                {source: "./keek/op/de/sub/week.js"},
                {"resolved": "./keek/op/de/sub/maand.js", "coreModule": false}
            )
        ).to.deep.equal({valid: true});
    });

    it("not to not sub (=> everything must go to 'sub')- violation - not sub to not sub", () => {
        expect(
            validate.dependency(
                true,
                _readRuleSet("./test/validate/fixtures/rules.not-to-not-sub.json"),
                {source: "./amber.js"},
                {"resolved": "./jade.js", "coreModule": false}
            )
        ).to.deep.equal({valid: false, rules: [{severity: 'error', name: 'not-to-not-sub'}]});
    });

    it("not-to-dev-dep disallows relations to develop dependencies", () => {
        expect(
            validate.dependency(
                true,
                _readRuleSet("./test/validate/fixtures/rules.not-to-dev-dep.json"),
                {source: "src/aap/zus/jet.js"},
                {
                    "module": "chai",
                    "resolved": "node_modules/chai/index.js",
                    "dependencyTypes": ["npm-dev"]
                }
            )
        ).to.deep.equal({
            valid: false,
            rules : [{
                name: "not-to-dev-dep",
                severity: "error"
            }]
        });
    });

    it("not-to-dev-dep does allow relations to regular dependencies", () => {
        expect(
            validate.dependency(
                true,
                _readRuleSet("./test/validate/fixtures/rules.not-to-dev-dep.json"),
                {source: "src/aap/zus/jet.js"},
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
            validate.dependency(
                true,
                _readRuleSet("./test/validate/fixtures/rules.no-duplicate-dep-types.json"),
                {source: "src/aap/zus/jet.js"},
                {
                    "module": "chai",
                    "resolved": "node_modules/chai/index.js",
                    "dependencyTypes": ["npm", "npm-dev"]
                }
            )
        ).to.deep.equal({
            valid: false,
            rules : [{
                name: "no-duplicate-dep-types",
                severity: "warn"
            }]
        });
    });
});


describe("validate/index group matching - path group matched in a pathnot", () => {

    it("group-to-pathnot - Disallows dependencies between peer folders", () => {
        expect(
            validate.dependency(
                true,
                _readRuleSet("./test/validate/fixtures/rules.group-to-pathnot.json"),
                {source: "src/aap/chimpansee.ts"},
                {"resolved": "src/noot/pinda.ts"}
            )
        ).to.deep.equal(
            {
                "valid": false,
                "rules": [{
                    "name": "group-to-pathnot",
                    "severity": "warn"
                }]
            }
        );
    });

    it("group-to-pathnot - Allows dependencies within to peer folder 'shared'", () => {
        expect(
            validate.dependency(
                true,
                _readRuleSet("./test/validate/fixtures/rules.group-to-pathnot.json"),
                {source: "src/aap/chimpansee.ts"},
                {"resolved": "src/shared/bananas.ts"}
            )
        ).to.deep.equal({valid: true});
    });

    it("group-to-pathnot - Allows dependencies within own folder", () => {
        expect(
            validate.dependency(
                true,
                _readRuleSet("./test/validate/fixtures/rules.group-to-pathnot.json"),
                {source: "src/aap/chimpansee.ts"},
                {"resolved": "src/aap/oerangoetang.ts"}
            )
        ).to.deep.equal({valid: true});
    });

    it("group-to-pathnot - Allows dependencies to sub folders of own folder", () => {
        expect(
            validate.dependency(
                true,
                _readRuleSet("./test/validate/fixtures/rules.group-to-pathnot.json"),
                {source: "src/aap/chimpansee.ts"},
                {"resolved": "src/aap/speeltuigen/autoband.ts"}
            )
        ).to.deep.equal({valid: true});
    });

    it("group-to-pathnot - Allows peer dependencies between sub folders of own folder", () => {
        expect(
            validate.dependency(
                true,
                _readRuleSet("./test/validate/fixtures/rules.group-to-pathnot.json"),
                {source: "src/aap/rekwisieten/touw.ts"},
                {"resolved": "src/aap/speeltuigen/autoband.ts"}
            )
        ).to.deep.equal({valid: true});
    });
});

describe("validate/index group matching - second path group matched in a pathnot", () => {

    it("group-two-to-pathnot - Disallows dependencies between peer folders", () => {
        expect(
            validate.dependency(
                true,
                _readRuleSet("./test/validate/fixtures/rules.group-two-to-pathnot.json"),
                {source: "src/aap/chimpansee.ts"},
                {"resolved": "src/noot/pinda.ts"}
            )
        ).to.deep.equal(
            {
                "valid": false,
                "rules": [{
                    "name": "group-two-to-pathnot",
                    "severity": "warn"
                }]
            }
        );
    });

    it("group-two-to-pathnot - Allows dependencies within to peer folder 'shared'", () => {
        expect(
            validate.dependency(
                true,
                _readRuleSet("./test/validate/fixtures/rules.group-two-to-pathnot.json"),
                {source: "src/aap/chimpansee.ts"},
                {"resolved": "src/shared/bananas.ts"}
            )
        ).to.deep.equal({valid: true});
    });

    it("group-two-to-pathnot - Allows dependencies within own folder", () => {
        expect(
            validate.dependency(
                true,
                _readRuleSet("./test/validate/fixtures/rules.group-two-to-pathnot.json"),
                {source: "src/aap/chimpansee.ts"},
                {"resolved": "src/aap/oerangoetang.ts"}
            )
        ).to.deep.equal({valid: true});
    });

    it("group-two-to-pathnot - Allows dependencies to sub folders of own folder", () => {
        expect(
            validate.dependency(
                true,
                _readRuleSet("./test/validate/fixtures/rules.group-two-to-pathnot.json"),
                {source: "src/aap/chimpansee.ts"},
                {"resolved": "src/aap/speeltuigen/autoband.ts"}
            )
        ).to.deep.equal({valid: true});
    });

    it("group-two-to-pathnot - Allows peer dependencies between sub folders of own folder", () => {
        expect(
            validate.dependency(
                true,
                _readRuleSet("./test/validate/fixtures/rules.group-two-to-pathnot.json"),
                {source: "src/aap/rekwisieten/touw.ts"},
                {"resolved": "src/aap/speeltuigen/autoband.ts"}
            )
        ).to.deep.equal({valid: true});
    });
});


describe("validate/index - license", () => {
    it("Skips dependencies that have no license attached", () => {
        expect(
            validate.dependency(
                true,
                _readRuleSet("./test/validate/fixtures/rules.license.json"),
                {source: "something"},
                {"resolved": "src/aap/speeltuigen/autoband.ts"}
            )
        ).to.deep.equal({valid: true});
    });

    it("does not flag dependencies that do not match the license expression", () => {
        expect(
            validate.dependency(
                true,
                _readRuleSet("./test/validate/fixtures/rules.license.json"),
                {source: "something"},
                {
                    "resolved": "src/aap/speeltuigen/autoband.ts",
                    "license": "Monkey-PL"
                }
            )
        ).to.deep.equal({valid: true});
    });

    it("flags dependencies that match the license expression", () => {
        expect(
            validate.dependency(
                true,
                _readRuleSet("./test/validate/fixtures/rules.license.json"),
                {source: "something"},
                {
                    "resolved": "src/aap/speeltuigen/autoband.ts",
                    "license": "SomePL-3.1"
                }
            )
        ).to.deep.equal({valid: false, rules: [{name: "no-somepl-license", severity: "warn"}]});
    });
});

describe("validate/index - licenseNot", () => {
    it("Skips dependencies that have no license attached", () => {
        expect(
            validate.dependency(
                true,
                _readRuleSet("./test/validate/fixtures/rules.licensenot.json"),
                {source: "something"},
                {"resolved": "src/aap/speeltuigen/autoband.ts"}
            )
        ).to.deep.equal({valid: true});
    });

    it("does not flag dependencies that do match the license expression", () => {
        expect(
            validate.dependency(
                true,
                _readRuleSet("./test/validate/fixtures/rules.licensenot.json"),
                {source: "something"},
                {
                    "resolved": "src/aap/speeltuigen/autoband.ts",
                    "license": "SomePL-3.1"
                }
            )
        ).to.deep.equal({valid: true});
    });

    it("flags dependencies that do not match the license expression", () => {
        expect(
            validate.dependency(
                true,
                _readRuleSet("./test/validate/fixtures/rules.licensenot.json"),
                {source: "something"},
                {
                    "resolved": "src/aap/speeltuigen/autoband.ts",
                    "license": "Monkey-PL"
                }
            )
        ).to.deep.equal({valid: false, rules: [{name: "only-somepl-license", severity: "warn"}]});
    });
});

describe("validate/index - orphans", () => {
    it("Skips modules that have no orphan attribute", () => {
        expect(
            validate.module(
                true,
                _readRuleSet("./test/validate/fixtures/rules.orphan.json"),
                {source: "something"}
            )
        ).to.deep.equal({valid: true});
    });

    it("Flags modules that are orphans", () => {
        expect(
            validate.module(
                true,
                _readRuleSet("./test/validate/fixtures/rules.orphan.json"),
                {source: "something", "orphan": true}
            )
        ).to.deep.equal({valid: false, rules: [{name: "no-orphans", severity: "warn"}]});
    });

    it("Flags modules that are orphans if they're in the 'allowed' section", () => {
        expect(
            validate.module(
                true,
                _readRuleSet("./test/validate/fixtures/rules.orphan.allowed.json"),
                {source: "something", "orphan": true}
            )
        ).to.deep.equal({valid: false, rules: [{name: "not-in-allowed", severity: "warn"}]});
    });

    it("Leaves modules that are orphans, but that don't match the rule path", () => {
        expect(
            validate.module(
                true,
                _readRuleSet("./test/validate/fixtures/rules.orphan.path.json"),
                {source: "something", "orphan": true}
            )
        ).to.deep.equal({valid: true});
    });

    it("Flags modules that are orphans and that match the rule's path", () => {
        expect(
            validate.module(
                true,
                _readRuleSet("./test/validate/fixtures/rules.orphan.path.json"),
                {source: "noorphansallowedhere/blah/something.ts", "orphan": true}
            )
        ).to.deep.equal({valid: false, rules: [{name: "no-orphans", severity: "error"}]});
    });

    it("Leaves modules that are orphans, but that do match the rule's pathNot", () => {
        expect(
            validate.module(
                true,
                _readRuleSet("./test/validate/fixtures/rules.orphan.pathnot.json"),
                {source: "orphansallowedhere/something", "orphan": true}
            )
        ).to.deep.equal({valid: true});
    });

    it("Flags modules that are orphans, but that do not match the rule's pathNot", () => {
        expect(
            validate.module(
                true,
                _readRuleSet("./test/validate/fixtures/rules.orphan.pathnot.json"),
                {source: "blah/something.ts", "orphan": true}
            )
        ).to.deep.equal({valid: false, rules: [{name: "no-orphans", severity: "warn"}]});
    });

    it("The 'dependency' validation leaves the module only orphan rule alone", () => {
        expect(
            validate.dependency(
                true,
                _readRuleSet("./test/validate/fixtures/rules.orphan.path.json"),
                {source: "noorphansallowedhere/something.ts", "orphan": true},
                {}
            )
        ).to.deep.equal({valid: true});
    });

});
