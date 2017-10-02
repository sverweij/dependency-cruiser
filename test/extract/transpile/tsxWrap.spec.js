"use strict";

const expect = require("chai").expect;
const fs     = require('fs');
const wrap   = require("../../../src/extract/transpile/typeScriptWrap");

describe("tsx transpiler (plain old typescript)", () => {
    it("tells the jsx transpiler is available", () => {
        expect(
            wrap.isAvailable()
        ).to.equal(true);
    });

    it("transpiles tsx", () => {
        expect(
            wrap.transpile(
                fs.readFileSync("./test/extract/transpile/fixtures/tsx.tsx", 'utf8')
            )
        ).to.equal(
            fs.readFileSync("./test/extract/transpile/fixtures/tsx.js", 'utf8')
        );
    });
});
