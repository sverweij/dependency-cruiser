"use strict";

const expect = require("chai").expect;
const fs     = require('fs');
const wrap   = require("../../../src/extract/transpile/javaScriptWrap");

describe("jsx transpiler (the plain old javascript one)", () => {
    it("tells the jsx transpiler is available", () => {
        expect(
            wrap.isAvailable()
        ).to.equal(true);
    });

    it("transpiles jsx", () => {
        expect(
            wrap.transpile(
                fs.readFileSync("./test/extract/transpile/fixtures/jsx.jsx", 'utf8')
            )
        ).to.equal(
            fs.readFileSync("./test/extract/transpile/fixtures/jsx.js", 'utf8')
        );
    });
});
