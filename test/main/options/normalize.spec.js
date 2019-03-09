const expect           = require('chai').expect;
const normalizeOptions = require('../../../src/main/options/normalize');

describe("main/options/normalize", () => {
    it("ensures maxDepth is an int when passed an int", () => {
        expect(
            normalizeOptions({
                maxDepth: 42
            }).maxDepth
        ).to.equal(42);
    });

    it("ensures maxDepth is an int when passed a string", () => {
        expect(
            normalizeOptions({
                maxDepth: "42"
            }).maxDepth
        ).to.equal(42);
    });

    it("makes doNotFollow strings into an object", () => {
        expect(
            normalizeOptions({
                doNotFollow: "42"
            }).doNotFollow
        ).to.deep.equal(
            {
                path: "42"
            }
        );
    });
});

/* eslint no-magic-numbers: 0*/
