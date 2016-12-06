"use strict";

const chai                    = require('chai');
const expect                  = chai.expect;
const extractor               = require('../../src/extract');
const cjsRecursiveFixtures    = require('../extractor-fixtures/cjs-recursive.json');
const amdRecursiveFixtures    = require('../extractor-fixtures/amd-recursive.json');
const tsRecursiveFixtures     = require('../extractor-fixtures/ts-recursive.json');
const coffeeRecursiveFixtures = require('../extractor-fixtures/coffee-recursive.json');
const depSchema               = require('../../src/extract/jsonschema.json');

chai.use(require('chai-json-schema'));

function runRecursiveFixture(pFixture) {
    if (!Boolean(pFixture.ignore)){
        it(pFixture.title, () => {
            let lResult = extractor(
                    pFixture.input.fileName,
                    pFixture.input.options
                );

            expect(lResult).to.deep.equal(pFixture.expected);
            expect(lResult).to.be.jsonSchema(depSchema);
        });

    }
}

describe('CommonJS recursive - ', () => cjsRecursiveFixtures.forEach(runRecursiveFixture));
describe('AMD recursive - ', () => amdRecursiveFixtures.forEach(runRecursiveFixture));
describe('TypeScript recursive - ', () => tsRecursiveFixtures.forEach(runRecursiveFixture));
describe('CoffeeScript recursive - ', () => coffeeRecursiveFixtures.forEach(runRecursiveFixture));
