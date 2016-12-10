"use strict";

const chai                    = require('chai');
const expect                  = chai.expect;
const extract                 = require('../../src/extract');
const cjsRecursiveFixtures    = require('./fixtures/cjs-recursive.json');
const amdRecursiveFixtures    = require('./fixtures/amd-recursive.json');
const tsRecursiveFixtures     = require('./fixtures/ts-recursive.json');
const coffeeRecursiveFixtures = require('./fixtures/coffee-recursive.json');
const depSchema               = require('../../src/extract/jsonschema.json');

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
describe('AMD recursive - ', () => amdRecursiveFixtures.forEach(runRecursiveFixture));
describe('TypeScript recursive - ', () => tsRecursiveFixtures.forEach(runRecursiveFixture));
describe('CoffeeScript recursive - ', () => coffeeRecursiveFixtures.forEach(runRecursiveFixture));
