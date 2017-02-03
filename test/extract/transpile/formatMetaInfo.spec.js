"use strict";

const expect = require("chai").expect;
const meta   = require("../../../src/extract/transpile/formatMetaInfo");

describe("transpiler formatted meta information", () => {
    it("tells which extensions can be scanned", () => {
        expect(
            meta()
        ).to.contain("If you need a supported, but not enabled transpiler");
    });
});
