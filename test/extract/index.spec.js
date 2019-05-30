const fs                      = require('fs');
const chai                    = require('chai');
const extract                 = require('../../src/extract');
const depSchema               = require('../../src/extract/results-schema.json');
const normalize               = require('../../src/main/options/normalize');
const normalizeResolveOptions = require('../../src/main/resolveOptions/normalize');
const cjsRecursiveFixtures    = require('./fixtures/cjs-recursive.json');
const deprecationFixtures     = require('./fixtures/deprecated-node-module.json');
const bundledFixtures         = require('./fixtures/bundled-dependencies.json');
const amdRecursiveFixtures    = require('./fixtures/amd-recursive.json');
const tsRecursiveFixtures     = require('./fixtures/ts-recursive.json');
const vueFixtures             = require('./fixtures/vue.json');
const coffeeRecursiveFixtures = require('./fixtures/coffee-recursive.json');

const expect = chai.expect;

chai.use(require('chai-json-schema'));

function runRecursiveFixture(pFixture) {
    if (!Boolean(pFixture.ignore)){
        it(pFixture.title, () => {
            const lOptions = normalize(pFixture.input.options);
            const lResolveOptions = normalizeResolveOptions(
                {
                    bustTheCache: true
                },
                lOptions
            );
            let lResult = extract(
                [pFixture.input.fileName],
                lOptions,
                lResolveOptions
            );

            expect(lResult).to.be.jsonSchema(depSchema);
            expect(lResult.modules).to.deep.equal(pFixture.expected);
        });

    }
}

describe('extract/index - CommonJS recursive - ', () => cjsRecursiveFixtures.forEach(runRecursiveFixture));
describe('extract/index - Deprecation - ', () => deprecationFixtures.forEach(runRecursiveFixture));
describe('extract/index - Bundled - ', () => bundledFixtures.forEach(runRecursiveFixture));
describe('extract/index - AMD recursive - ', () => amdRecursiveFixtures.forEach(runRecursiveFixture));
describe('extract/index - TypeScript recursive - ', () => tsRecursiveFixtures.forEach(runRecursiveFixture));
describe('extract/index - vue - ', () => vueFixtures.forEach(runRecursiveFixture));
describe(
    'extract/index - CoffeeScript recursive - ',
    () => coffeeRecursiveFixtures.forEach(runRecursiveFixture)
);

describe('extract/index - Max depth', () => {
    /* eslint no-magic-numbers:0 */
    [0, 1, 2, 4].forEach((pDepth) =>
        it(`returns the correct graph when max-depth === ${pDepth}`, () => {
            const lOptions = normalize({
                maxDepth: pDepth
            });
            const lResolveOptions = normalizeResolveOptions(
                {
                    bustTheCache: true
                },
                lOptions
            );
            const lResult = extract(
                ["./test/extract/fixtures/maxDepth/index.js"],
                lOptions,
                lResolveOptions
            );
            /* eslint import/no-dynamic-require:0, security/detect-non-literal-require:0 */

            expect(lResult.modules).to.deep.equal(
                require(`./fixtures/maxDepth${pDepth}.json`).modules
            );
            expect(lResult).to.be.jsonSchema(depSchema);
        })
    );
});

describe('extract/index - do not follow', () => {

    it('do not follow - doNotFollow.path', () => {
        const lOptions = normalize({
            doNotFollow: {
                path: "donotfollowonceinthisfolder"
            }
        });
        const lResolveOptions = normalizeResolveOptions(
            {
                bustTheCache: true
            },
            lOptions
        );
        const lResult = extract(
            ["./test/extract/fixtures/donotfollow/index.js"],
            lOptions,
            lResolveOptions
        );

        expect(lResult.modules).to.deep.equal(
            require('./fixtures/donotfollow.json').modules
        );
        expect(lResult).to.be.jsonSchema(depSchema);
    });

    it('do not follow - doNotFollow.dependencyTypes', () => {
        const lOptions = normalize({
            doNotFollow: {
                dependencyTypes: ["npm-no-pkg"]
            }
        });
        const lResolveOptions = normalizeResolveOptions(
            {
                bustTheCache: true
            },
            lOptions
        );
        const lResult = extract(
            ["./test/extract/fixtures/donotfollow-dependency-types/index.js"],
            lOptions,
            lResolveOptions
        );

        expect(lResult.modules).to.deep.equal(
            require('./fixtures/donotfollow-dependency-types.json').modules
        );
        expect(lResult).to.be.jsonSchema(depSchema);
    });
});


describe('extract/index - cache busting', () => {
    it('delivers a different output', () => {
        const lOptions = normalize({
            ruleSet: {
                forbidden: [
                    {
                        name: "burp-on-core",
                        severity: "error",
                        from: {},
                        to: {
                            dependencyTypes: ["core"]
                        }
                    }
                ]
            },
            validate: true,
            tsPreCompilationDeps: true,
            doNotFollow: {
                dependencyTypes: [
                    "npm",
                    "npm-dev",
                    "npm-optional",
                    "npm-peer",
                    "npm-bundled"
                ]
            }

        });
        const lResolveOptions = normalizeResolveOptions(
            {},
            lOptions
        );
        const lFirstResultFixture = require('./fixtures/cache-busting-first-tree.json');
        const lSecondResultFixture = require('./fixtures/cache-busting-second-tree.json');

        fs.renameSync(
            "./test/extract/fixtures/cache-busting-first-tree",
            "./test/extract/fixtures/cache-busting"
        );

        const lFirstResult = extract(
            ["./test/extract/fixtures/cache-busting/index.ts"],
            lOptions,
            lResolveOptions
        );

        fs.renameSync(
            "./test/extract/fixtures/cache-busting",
            "./test/extract/fixtures/cache-busting-first-tree"
        );

        fs.renameSync(
            "./test/extract/fixtures/cache-busting-second-tree",
            "./test/extract/fixtures/cache-busting"
        );

        const lSecondResult = extract(
            ["./test/extract/fixtures/cache-busting/index.ts"],
            lOptions,
            lResolveOptions
        );

        fs.renameSync(
            "./test/extract/fixtures/cache-busting",
            "./test/extract/fixtures/cache-busting-second-tree"
        );

        expect(lFirstResult).to.deep.equal(lFirstResultFixture);
        expect(lSecondResult).to.deep.equal(lSecondResultFixture);
        expect(lSecondResult).to.not.deep.equal(lFirstResult);
    });
});
/* eslint global-require: 0*/
