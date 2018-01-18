"use strict";

const expect      = require('chai').expect;
const gather      = require('../../src/extract/gatherInitialSources');
const pathToPosix = require('../../src/utl/pathToPosix');

function p2p(pPath) {
    return pathToPosix(pPath);
}

describe("gatherInitial", () => {
    it("one file stays one file", () => {
        expect(
            gather(["test/extract/fixtures/cjs/root_one.js"], {})
        ).to.deep.equal(
            ["test/extract/fixtures/cjs/root_one.js"].map(p2p)
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
            ].map(p2p)
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
            ].map(p2p)
        );
    });

    it("expands and concats the scannable files in two folders (not-testable-in-node4)", () => {
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
            ].map(p2p)
        );
    });

    it("expands and concats the scannable files in two folders + a separate file (not-testable-in-node4)", () => {
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
            ].map(p2p)
        );
    });

    it("filters the 'excluded' pattern from the collection (not-testable-in-node4)", () => {
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
            ].map(p2p)
        );
    });

    /*
    it("using the same file twice as input has the same result as using it once", () => {
        expect(
            gather([
                "test/extract/fixtures/ts/index.ts",
                "test/extract/fixtures/ts/index.ts"
            ])
        ).to.deep.equal(
            gather([
                "test/extract/fixtures/ts/index.ts"
            ])
        );
    });

    it("using the same folder twice as input has the same result as using it once", () => {
        expect(
            gather([
                "test/extract/fixtures/ts",
                "test/extract/fixtures/ts"
            ])
        ).to.deep.equal(
            gather([
                "test/extract/fixtures/ts"
            ])
        );
    });
    */
});
