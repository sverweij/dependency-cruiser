"use strict";

const chai                    = require('chai');
const extract                 = require('../../src/extract');
const depSchema               = require('../../src/extract/jsonschema.json');
const cjsRecursiveFixtures    = require('./fixtures/cjs-recursive.json');
const deprecationFixtures     = require('./fixtures/deprecated-node-module.json');
const bundledFixtures         = require('./fixtures/bundled-dependencies.json');
const amdRecursiveFixtures    = require('./fixtures/amd-recursive.json');
const tsRecursiveFixtures     = require('./fixtures/ts-recursive.json');
const coffeeRecursiveFixtures = require('./fixtures/coffee-recursive.json');

const expect = chai.expect;

chai.use(require('chai-json-schema'));

function runRecursiveFixture(pFixture) {
    if (!Boolean(pFixture.ignore)){
        it(pFixture.title, () => {
            let lResult = extract(
                [pFixture.input.fileName],
                pFixture.input.options
            );

            expect(lResult.dependencies).to.deep.equal(pFixture.expected);
            expect(lResult).to.be.jsonSchema(depSchema);
        });

    }
}

describe('CommonJS recursive - ', () => cjsRecursiveFixtures.forEach(runRecursiveFixture));
describe('Deprecation - ', () => deprecationFixtures.forEach(runRecursiveFixture));
describe('Bundled - ', () => bundledFixtures.forEach(runRecursiveFixture));
describe('AMD recursive - ', () => amdRecursiveFixtures.forEach(runRecursiveFixture));
describe('TypeScript recursive - ', () => tsRecursiveFixtures.forEach(runRecursiveFixture));
describe(
    'CoffeeScript recursive - (not-testable-in-node4)',
    () => coffeeRecursiveFixtures.forEach(runRecursiveFixture)
);

describe('Max depth', () => {
    it('returns the complete graph when max-depth is not specified', () => {
        const lResult = extract(
            ["./test/extract/fixtures/maxDepth/index.js"]
        );

        expect(lResult.dependencies).to.deep.equal(
            require('./fixtures/maxDepthUnspecified.json').dependencies
        );
        expect(lResult).to.be.jsonSchema(depSchema);
    });

    it('returns the file and one deep with --max-depth 1', () => {
        const lResult = extract(
            ["./test/extract/fixtures/maxDepth/index.js"],
            {
                maxDepth: 1
            }
        );

        expect(lResult.dependencies).to.deep.equal(
            require('./fixtures/maxDepth1.json').dependencies
        );
        expect(lResult).to.be.jsonSchema(depSchema);
    });

    it('returns the file and two deep with --max-depth 2', () => {
        const lResult = extract(
            ["./test/extract/fixtures/maxDepth/index.js"],
            {
                maxDepth: 2
            }
        );

        expect(lResult.dependencies).to.deep.equal(
            require('./fixtures/maxDepth2.json').dependencies
        );
        expect(lResult).to.be.jsonSchema(depSchema);
    });

    it('returns the file and three deep with --max-depth 3', () => {
        const lResult = extract(
            ["./test/extract/fixtures/maxDepth/index.js"],
            {
                maxDepth: 3
            }
        );

        expect(lResult.dependencies).to.deep.equal(
            require('./fixtures/maxDepth3.json').dependencies
        );
        expect(lResult).to.be.jsonSchema(depSchema);
    });

    it('returns the file and four deep with --max-depth 4', () => {
        const lResult = extract(
            ["./test/extract/fixtures/maxDepth/index.js"],
            {
                maxDepth: 4
            }
        );

        expect(lResult.dependencies).to.deep.equal(
            require('./fixtures/maxDepth4.json').dependencies
        );
        expect(lResult).to.be.jsonSchema(depSchema);
    });
});

describe('Do not follow', () => {
    it('does not follow files matching the doNotFollow RE', () => {
        const lResult = extract(
            ["./test/extract/fixtures/donotfollow/index.js"],
            {
                doNotFollow: "donotfollowonceinthisfolder"
            }
        );

        expect(lResult.dependencies).to.deep.equal(
            require('./fixtures/donotfollow.json').dependencies
        );
        expect(lResult).to.be.jsonSchema(depSchema);
    });
});

/* eslint global-require: 0*/
