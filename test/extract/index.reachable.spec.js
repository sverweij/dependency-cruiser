const chai                    = require('chai');
const extract                 = require('../../src/extract');
const depSchema               = require('../../src/extract/results-schema.json');
const normalize               = require('../../src/main/options/normalize');
const normalizeRuleSet        = require('../../src/main/ruleSet/normalize');
const normalizeResolveOptions = require('../../src/main/resolveOptions/normalize');

const expect = chai.expect;

chai.use(require('chai-json-schema'));

describe('extract/index - reachable', () => {
    it(`returns output complying to the results-schema when having reachability rules in`, () => {
        const lOptions = normalize({
            validate: true,
            ruleSet: normalizeRuleSet(
                {
                    forbidden: [
                        {
                            name: "no-unreachable-from-root",
                            from: {
                                path: "src/index.js$"
                            },
                            to: {
                                path: "src",
                                reachable: false
                            }
                        }
                    ]
                }
            )
        });
        const lResolveOptions = normalizeResolveOptions(
            {
                bustTheCache: true
            },
            lOptions
        );
        const lResult = extract(
            ["./test/extract/fixtures/reachable"],
            lOptions,
            lResolveOptions
        );

        console.log(JSON.stringify(lResult, null, 2));

        expect(lResult).to.be.jsonSchema(depSchema);
    });
});
/* eslint global-require: 0*/
