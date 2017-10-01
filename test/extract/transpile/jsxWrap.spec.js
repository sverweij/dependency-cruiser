"use strict";

const expect = require("chai").expect;
const fs     = require('fs');
const wrap   = require("../../../src/extract/transpile/jsxWrap");

describe("jsx transpiler (babel with babel-preset-react)", () => {
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
