"use strict";

const expect = require("chai").expect;
const wrap   = require("../../../src/extract/transpile/liveScriptWrap");

describe("livescript transpiler", () => {
    it("tells the livescript transpiler is not available", () => {
        expect(
            wrap.isAvailable()
        ).to.equal(false);
    });
});
