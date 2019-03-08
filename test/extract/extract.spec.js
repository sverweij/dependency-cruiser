const path              = require('path');
const fs                = require('fs');
const symlinkDir        = require('symlink-dir');
const expect            = require('chai').expect;
const extract           = require('../../src/extract/extract');
const normalize         = require('../../src/main/options/normalize');
const normalizeResolveOptions = require('../../src/main/resolveOptions/normalize');
const cjsFixtures       = require('./fixtures/cjs.json');
const es6Fixtures       = require('./fixtures/es6.json');
const amdFixtures       = require('./fixtures/amd.json');
const tsFixtures        = require('./fixtures/ts.json');
const coffeeFixtures    = require('./fixtures/coffee.json');

const cjsBang           = require('./fixtures/cjs-bang.json');
const amdBangRequirejs  = require('./fixtures/amd-bang-requirejs.json');
const amdBangCJSWrapper = require('./fixtures/amd-bang-CJSWrapper.json');

let symlinkDirectory = path.join(__dirname, 'fixtures', 'symlinked');

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
                normalize(lOptions),
                normalizeResolveOptions({}, lOptions)
            )
        ).to.deep.equal(
            pFixture.expected
        );
    });
}

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

describe('extract/extract - CommonJS - ', () => cjsFixtures.forEach(runFixture));
describe('extract/extract - CommonJS - with bangs', () => {

    it('splits bang!./blabla into bang and ./blabla', () => {
        expect(
            extract(
                "test/extract/fixtures/cjs-bangs/index.js",
                normalize({
                    moduleSystems: ["cjs"]
                }),
                {}
            )
        ).to.deep.equal(
            cjsBang
        );
    });
});

describe('extract/extract - ES6 - ', () => es6Fixtures.forEach(runFixture));
describe('extract/extract - AMD - ', () => amdFixtures.forEach(runFixture));
describe('AMD - with bangs', () => {

    it('splits bang!./blabla into bang and ./blabla - regular requirejs', () => {
        expect(
            extract(
                "test/extract/fixtures/amd-bangs/root_one.js",
                normalize({
                    moduleSystems: ["amd"]
                }),
                {}
            )
        ).to.deep.equal(
            amdBangRequirejs
        );
    });

    it('splits bang!./blabla into bang and ./blabla - CommonJS wrapper', () => {
        expect(
            extract(
                "test/extract/fixtures/amd-bangs/simplified-commonjs-wrapper.js",
                normalize({
                    moduleSystems: ["amd"]
                }),
                {}
            )
        ).to.deep.equal(
            amdBangCJSWrapper
        );
    });
});

describe('extract/extract - TypeScript - ', () => tsFixtures.forEach(runFixture));
describe('extract/extract - CoffeeScript - ', () => coffeeFixtures.forEach(runFixture));

describe('extract/extract - Error scenarios - ', () => {
    it('Does not raise an exception on syntax errors (because we\'re on the loose parser)', () => {
        expect(
            () => extract("test/extract/fixtures/syntax-error.js", normalize({}), {})
        ).to.not.throw("Extracting dependencies ran afoul of... Unexpected token (1:3)");
    });
    it('Raises an exception on non-existing files', () => {
        expect(
            () => extract("non-existing-file.md", normalize({}), {})
        ).to.throw(
            "Extracting dependencies ran afoul of...\n\n  ENOENT: no such file or directory, open "
        );
    });
});

describe('extract/extract - even when require gets non-string arguments, extract doesn\'t break', () => {
    it('Just skips require(481)', () => {
        expect(
            extract(
                "./test/extract/fixtures/cjs-require-non-strings/require-a-number.js",
                normalize({}),
                {}
            ).length
        ).to.equal(1);
    });

    it('Just skips require(a function)', () => {
        expect(
            extract(
                "./test/extract/fixtures/cjs-require-non-strings/require-a-function.js",
                normalize({}),
                {}
            ).length
        ).to.equal(1);
    });

    it('Just skips require(an iife)', () => {
        expect(
            extract(
                "./test/extract/fixtures/cjs-require-non-strings/require-an-iife.js",
                normalize({}),
                {}
            ).length
        ).to.equal(1);
    });
});
