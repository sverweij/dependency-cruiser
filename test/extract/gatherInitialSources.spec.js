"use strict";

const expect = require('chai').expect;
const gather = require('../../src/extract/gatherInitialSources');

describe("gatherInitial", () => {
    it("one file stays one file", () => {
        expect(
            gather(["test/extract/fixtures/cjs/root_one.js"], {})
        ).to.deep.equal(
            ["test/extract/fixtures/cjs/root_one.js"]
        );
    });

    it("two files from different folders", () => {
        expect(
            gather([
                "test/extract/fixtures/cjs/root_one.js",
                "test/extract/fixtures/ts/index.ts"
            ], {})
        ).to.deep.equal(
            [
                "test/extract/fixtures/cjs/root_one.js",
                "test/extract/fixtures/ts/index.ts"
            ]
        );
    });

    it("expands the scannable files in a folder", () => {
        expect(
            gather([
                "test/extract/fixtures/ts"
            ], {})
        ).to.deep.equal(
            [
                "test/extract/fixtures/ts/index.ts",
                "test/extract/fixtures/ts/javascriptThing.js",
                "test/extract/fixtures/ts/sub/index.ts",
                "test/extract/fixtures/ts/sub/kaching.ts",
                "test/extract/fixtures/ts/sub/willBeReExported.ts"
            ]
        );
    });

    it("expands and concats the scannable files in two folders", () => {
        expect(
            gather([
                "test/extract/fixtures/ts",
                "test/extract/fixtures/coffee"
            ], {})
        ).to.deep.equal(
            [
                "test/extract/fixtures/ts/index.ts",
                "test/extract/fixtures/ts/javascriptThing.js",
                "test/extract/fixtures/ts/sub/index.ts",
                "test/extract/fixtures/ts/sub/kaching.ts",
                "test/extract/fixtures/ts/sub/willBeReExported.ts",
                "test/extract/fixtures/coffee/index.coffee",
                "test/extract/fixtures/coffee/javascriptThing.js",
                "test/extract/fixtures/coffee/sub/index.coffee",
                "test/extract/fixtures/coffee/sub/kaching.litcoffee",
                "test/extract/fixtures/coffee/sub/willBeReExported.coffee.md"
            ]
        );
    });

    it("expands and concats the scannable files in two folders + a separate file", () => {
        expect(
            gather([
                "test/extract/fixtures/ts",
                "test/extract/fixtures/es6/imports-and-exports.js",
                "test/extract/fixtures/coffee"
            ], {})
        ).to.deep.equal(
            [
                "test/extract/fixtures/ts/index.ts",
                "test/extract/fixtures/ts/javascriptThing.js",
                "test/extract/fixtures/ts/sub/index.ts",
                "test/extract/fixtures/ts/sub/kaching.ts",
                "test/extract/fixtures/ts/sub/willBeReExported.ts",
                "test/extract/fixtures/es6/imports-and-exports.js",
                "test/extract/fixtures/coffee/index.coffee",
                "test/extract/fixtures/coffee/javascriptThing.js",
                "test/extract/fixtures/coffee/sub/index.coffee",
                "test/extract/fixtures/coffee/sub/kaching.litcoffee",
                "test/extract/fixtures/coffee/sub/willBeReExported.coffee.md"
            ]
        );
    });

    it("filters the 'excluded' pattern from the collection", () => {
        expect(
            gather([
                "test/extract/fixtures/ts",
                "test/extract/fixtures/es6/imports-and-exports.js",
                "test/extract/fixtures/coffee"
            ], {exclude: "dex"})
        ).to.deep.equal(
            [
                "test/extract/fixtures/ts/javascriptThing.js",
                "test/extract/fixtures/ts/sub/kaching.ts",
                "test/extract/fixtures/ts/sub/willBeReExported.ts",
                "test/extract/fixtures/es6/imports-and-exports.js",
                "test/extract/fixtures/coffee/javascriptThing.js",
                "test/extract/fixtures/coffee/sub/kaching.litcoffee",
                "test/extract/fixtures/coffee/sub/willBeReExported.coffee.md"
            ]
        );
    });
});
