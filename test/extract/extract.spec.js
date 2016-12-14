"use strict";

const expect            = require('chai').expect;
const extract           = require('../../src/extract/extract');
const cjsFixtures       = require('./fixtures/cjs.json');
const es6Fixtures       = require('./fixtures/es6.json');
const amdFixtures       = require('./fixtures/amd.json');
const tsFixtures        = require('./fixtures/ts.json');
const coffeeFixtures    = require('./fixtures/coffee.json');

const cjsBang           = require('./fixtures/cjs-bang.json');
const amdBangRequirejs  = require('./fixtures/amd-bang-requirejs.json');
const amdBangCJSWrapper = require('./fixtures/amd-bang-CJSWrapper.json');

function runFixture(pFixture) {
    it(pFixture.title, () => {
        expect(
            extract(
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
describe('CommonJS - with bangs', () => {

    it('splits bang!./blabla into bang and ./blabla', () => {
        expect(
            extract(
                "test/extract/fixtures/cjs-bangs/index.js",
                {
                    moduleSystems: ["cjs"]
                }
            )
        ).to.deep.equal(
            cjsBang
        );
    });
});

describe('ES6 - ', () => es6Fixtures.forEach(runFixture));
describe('AMD - ', () => amdFixtures.forEach(runFixture));
describe('AMD - with bangs', () => {

    it('splits bang!./blabla into bang and ./blabla - regular requirejs', () => {
        expect(
            extract(
                "test/extract/fixtures/amd-bangs/root_one.js",
                {
                    moduleSystems: ["amd"]
                }
            )
        ).to.deep.equal(
            amdBangRequirejs
        );
    });

    it('splits bang!./blabla into bang and ./blabla - CommonJS wrapper', () => {
        expect(
            extract(
                "test/extract/fixtures/amd-bangs/simplified-commonjs-wrapper.js",
                {
                    moduleSystems: ["amd"]
                }
            )
        ).to.deep.equal(
            amdBangCJSWrapper
        );
    });
});

describe('TypeScript - ', () => tsFixtures.forEach(runFixture));
describe('CoffeeScript - ', () => coffeeFixtures.forEach(runFixture));

describe('Error scenarios - ', () => {
    it('Does not raise an exception on syntax errors (because we\'re on the loose parser)', () => {
        expect(
            () => extract("test/extractor-fixtures/syntax-error.js")
        ).to.not.throw("Extracting dependencies ran afoul of... Unexpected token (1:3)");
    });
    it('Raises an exception on non-existing files', () => {
        expect(
            () => extract("non-existing-file.js")
        ).to.throw(
            "Extracting dependencies ran afoul of...\n\n  ENOENT: no such file or directory, open 'non-existing-file.js'\n"
        );
    });
});

/* eslint max-len: 0 */
