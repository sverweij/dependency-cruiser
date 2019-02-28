const chai                    = require('chai');
const extract                 = require('../../src/extract');
const depSchema               = require('../../src/extract/jsonschema.json');
const normalize               = require('../../src/main/options/normalize');
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
            let lResult = extract(
                [pFixture.input.fileName],
                normalize(pFixture.input.options)
            );

            expect(lResult.modules).to.deep.equal(pFixture.expected);
            expect(lResult).to.be.jsonSchema(depSchema);
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
    it('returns the complete graph when max-depth is 0', () => {
        const lResult = extract(
            ["./test/extract/fixtures/maxDepth/index.js"],
            normalize({
                maxDepth: 0
            })
        );

        expect(lResult.modules).to.deep.equal(
            require('./fixtures/maxDepthUnspecified.json').modules
        );
        expect(lResult).to.be.jsonSchema(depSchema);
    });

    it('returns the file and one deep with --max-depth 1', () => {
        const lResult = extract(
            ["./test/extract/fixtures/maxDepth/index.js"],
            normalize({
                maxDepth: 1
            })
        );

        expect(lResult.modules).to.deep.equal(
            require('./fixtures/maxDepth1.json').modules
        );
        expect(lResult).to.be.jsonSchema(depSchema);
    });

    it('returns the file and two deep with --max-depth 2', () => {
        const lResult = extract(
            ["./test/extract/fixtures/maxDepth/index.js"],
            normalize({
                maxDepth: 2
            })
        );

        expect(lResult.modules).to.deep.equal(
            require('./fixtures/maxDepth2.json').modules
        );
        expect(lResult).to.be.jsonSchema(depSchema);
    });

    it('returns the file and three deep with --max-depth 3', () => {
        const lResult = extract(
            ["./test/extract/fixtures/maxDepth/index.js"],
            normalize({
                maxDepth: 3
            })
        );

        expect(lResult.modules).to.deep.equal(
            require('./fixtures/maxDepth3.json').modules
        );
        expect(lResult).to.be.jsonSchema(depSchema);
    });

    it('returns the file and four deep with --max-depth 4', () => {
        const lResult = extract(
            ["./test/extract/fixtures/maxDepth/index.js"],
            normalize({
                maxDepth: 4
            })
        );

        expect(lResult.modules).to.deep.equal(
            require('./fixtures/maxDepth4.json').modules
        );
        expect(lResult).to.be.jsonSchema(depSchema);
    });
});

describe('extract/index - Do not follow', () => {
    it('does not follow files matching the doNotFollow RE', () => {
        const lResult = extract(
            ["./test/extract/fixtures/donotfollow/index.js"],
            normalize({
                doNotFollow: "donotfollowonceinthisfolder",
                maxDepth: 0
            })
        );

        expect(lResult.modules).to.deep.equal(
            require('./fixtures/donotfollow.json').modules
        );
        expect(lResult).to.be.jsonSchema(depSchema);
    });
});

/* eslint global-require: 0*/
