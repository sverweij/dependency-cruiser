const expect               = require('chai').expect;
const extractor            = require('../src/extractor');
const cjsFixtures          = require('./extractor-fixtures/cjs.json');
const es6Fixtures          = require('./extractor-fixtures/es6.json');
const amdFixtures          = require('./extractor-fixtures/amd.json');

function runFixture(pFixture) {
    it(pFixture.title, () => {
        expect(
            extractor.extractDependencies(
                pFixture.input.fileName,
                {
                    baseDir: pFixture.input.baseDir,
                    moduleSystems: pFixture.input.moduleSystems
                }
            )
        ).to.deep.equal(
            pFixture.expected
        );
    });
}

describe('CommonJS - ', () => cjsFixtures.forEach(runFixture));
describe('ES6 - ', () => es6Fixtures.forEach(runFixture));
describe('AMD - ', () => amdFixtures.forEach(runFixture));

describe('Error scenarios - ', () => {
    it('Does not raise an exception on syntax errors (because we\'re on the loose parser)', () => {
        expect(
            () => extractor.extractDependencies("test/extractor-fixtures/syntax-error.js")
        ).to.not.throw("Extracting dependencies ran afoul of... Unexpected token (1:3)");
    });
    it('Raises an exception on non-existing files', () => {
        expect(
            () => extractor.extractDependencies("non-existing-file.js")
        ).to.throw(
            "Extracting dependencies ran afoul of... ENOENT: no such file or directory, open 'non-existing-file.js'"
        );
    });
});
