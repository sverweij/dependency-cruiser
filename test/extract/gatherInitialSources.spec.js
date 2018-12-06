const expect  = require('chai').expect;
const gather  = require('../../src/extract/gatherInitialSources');
const p2p     = require('../../src/utl/pathToPosix');

// make the import pathToPosix the correct function profile
// (1 parameter exactly) for use in map
function pathToPosix(pPath) {
    return p2p(pPath);
}

describe("gatherInitial", () => {
    it("one file stays one file", () => {
        expect(
            gather(["test/extract/fixtures/cjs/root_one.js"], {}).map(pathToPosix)
        ).to.deep.equal(
            ["test/extract/fixtures/cjs/root_one.js"]
        );
    });

    it("two files from different folders", () => {
        expect(
            gather([
                "test/extract/fixtures/cjs/root_one.js",
                "test/extract/fixtures/ts/index.ts"
            ], {}).map(pathToPosix)
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
            ], {}).map(pathToPosix)
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
            ], {}).map(pathToPosix)
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
            ], {}).map(pathToPosix)
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
            ], {exclude: "dex"}).map(pathToPosix)
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

    it("filters the 'excluded' pattern from the collection - regexp", () => {
        expect(
            gather([
                "test/extract/fixtures/ts"
            ], {exclude: "^[a-z]+$"}).map(pathToPosix)
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

    it("expands glob patterns (**/*.js)", () => {
        expect(
            gather([
                "test/extract/fixtures/gather-globbing/packages/**/*.js"
            ]).map(pathToPosix)
        ).to.deep.equal(
            [
                "test/extract/fixtures/gather-globbing/packages/baldr/spec/bow.spec.js",
                "test/extract/fixtures/gather-globbing/packages/baldr/spec/index.spec.js",
                "test/extract/fixtures/gather-globbing/packages/baldr/src/bow.js",
                "test/extract/fixtures/gather-globbing/packages/baldr/src/index.js",
                "test/extract/fixtures/gather-globbing/packages/freyja/index.js",
                "test/extract/fixtures/gather-globbing/packages/loki/script/hots.js",
                "test/extract/fixtures/gather-globbing/packages/odin/src/deep/ly.js",
                "test/extract/fixtures/gather-globbing/packages/odin/src/deep/ly.spec.js",
                "test/extract/fixtures/gather-globbing/packages/odin/src/deep/ly/index.js",
                "test/extract/fixtures/gather-globbing/packages/odin/src/deep/ly/nested.js",
                "test/extract/fixtures/gather-globbing/packages/odin/test/index.spec.js"
            ]
        );
    });

    it("expands glob patterns (**/src/**/*.js)", () => {
        expect(
            gather([
                "test/extract/fixtures/gather-globbing/**/src/**/*.js"
            ]).map(pathToPosix)
        ).to.deep.equal(
            [
                "test/extract/fixtures/gather-globbing/packages/baldr/src/bow.js",
                "test/extract/fixtures/gather-globbing/packages/baldr/src/index.js",
                "test/extract/fixtures/gather-globbing/packages/odin/src/deep/ly.js",
                "test/extract/fixtures/gather-globbing/packages/odin/src/deep/ly.spec.js",
                "test/extract/fixtures/gather-globbing/packages/odin/src/deep/ly/index.js",
                "test/extract/fixtures/gather-globbing/packages/odin/src/deep/ly/nested.js"
            ]
        );
    });

    /*
    it("using the same file twice as input has the same result as using it once", () => {
        expect(
            gather([
                "test/extract/fixtures/ts/index.ts",
                "test/extract/fixtures/ts/index.ts"
            ]).map(p2p)
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
            ]).map(p2p)
        ).to.deep.equal(
            gather([
                "test/extract/fixtures/ts"
            ])
        );
    });
    */
});
