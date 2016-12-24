"use strict";

const expect    = require("chai").expect;
const transpile = require("../../src/transpile");

describe("transpiler", () => {
    it("As the 'livescript' transpiler is not available, returns the original source", () => {
        expect(
            transpile(".ls", "whatever the bever")
        ).to.equal("whatever the bever");
    });
});
