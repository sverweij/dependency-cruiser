const normalizeOptions = require('../../../src/main/options/normalize');
const expect           = require('chai').expect;

describe("main/normalizeOptions", () => {
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
});

/* eslint no-magic-numbers: 0*/
