"use strict";

const expect     = require("chai").expect;
const tryRequire = require("../../src/transpile/tryRequire");
const semver     = require('semver');

describe("transpiler tryRequire", () => {
    it("returns false for unresolvable modules", () => {
        expect(
            tryRequire('thispackage-is-not-there')
        ).to.equal(false);
    });

    it("returns the module if it is resolvable", () => {
        expect(
            tryRequire('semver')
        ).to.deep.equal(semver);
    });

    it("returns the module if it is resolvable and satisfies specified semver", () => {
        expect(
            tryRequire('semver', '>=5.0.0 <6.0.0')
        ).to.deep.equal(semver);
    });

    it("returns false if it is resolvable but doesn't satisfy the specified semver", () => {
        expect(
            tryRequire('semver', '<5.0.0')
        ).to.deep.equal(false);
    });
});
