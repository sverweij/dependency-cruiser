"use strict";

const path              = require('path');
const fs                = require('fs');
const symlinkDir        = require('symlink-dir');
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

let symlinkDirectory = path.join(__dirname, 'fixtures', 'symlinked');

/* eslint-disable mocha/no-top-level-hooks */
before((cb) => {
    symlinkDir(path.join(__dirname, 'fixtures', 'symlinkTarget'), symlinkDirectory)
        .then(() => cb(), (err) => cb(err));
});

after(() => {
    try {
        fs.unlinkSync(symlinkDirectory);
    } catch (e) {
        // just swallow the error, there's nothing we can do about it
    }
});

function runFixture(pFixture) {
    const lOptions = {};

    if (pFixture.input.baseDir) {
        lOptions.baseDir = pFixture.input.baseDir;
    }
    if (pFixture.input.moduleSystems) {
        lOptions.moduleSystems = pFixture.input.moduleSystems;
    }
    if (typeof pFixture.input.preserveSymlinks !== "undefined") {
        lOptions.preserveSymlinks = pFixture.input.preserveSymlinks;
    }

    it(pFixture.title, () => {
        expect(
            extract(
                pFixture.input.fileName,
                lOptions
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
describe('CoffeeScript - (not-testable-in-node4)', () => coffeeFixtures.forEach(runFixture));

describe('Error scenarios - ', () => {
    it('Does not raise an exception on syntax errors (because we\'re on the loose parser)', () => {
        expect(
            () => extract("test/extract/fixtures/syntax-error.js")
        ).to.not.throw("Extracting dependencies ran afoul of... Unexpected token (1:3)");
    });
    it('Raises an exception on non-existing files', () => {
        expect(
            () => extract("non-existing-file.md")
        ).to.throw(
            "Extracting dependencies ran afoul of...\n\n  ENOENT: no such file or directory, open "
        );
    });
});

describe('even when require gets non-string arguments, extract doesn\'t break', () => {
    it('Just skips require(481)', () => {
        expect(
            extract("./test/extract/fixtures/cjs-require-non-strings/require-a-number.js").length
        ).to.equal(1);
    });

    it('Just skips require(a function)', () => {
        expect(
            extract("./test/extract/fixtures/cjs-require-non-strings/require-a-function.js").length
        ).to.equal(1);
    });

    it('Just skips require(an iife)', () => {
        expect(
            extract("./test/extract/fixtures/cjs-require-non-strings/require-an-iife.js").length
        ).to.equal(1);
    });
});

/* eslint max-len: 0 */
