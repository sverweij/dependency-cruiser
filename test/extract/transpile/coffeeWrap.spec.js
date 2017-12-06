"use strict";

const fs      = require('fs');
const expect  = require("chai").expect;
const wrap    = require("../../../src/extract/transpile/coffeeWrap")();
const litWrap = require("../../../src/extract/transpile/coffeeWrap")(true);

describe("coffeescript transpiler (not-testable-in-node4)", () => {
    it("tells the coffeescript transpiler is available", () => {
        expect(
            wrap.isAvailable()
        ).to.equal(true);
    });

    it("tells the transpiler for literate coffeescript is available", () => {
        expect(
            litWrap.isAvailable()
        ).to.equal(true);
    });

    it("transpiles coffeescript", () => {
        expect(
            wrap.transpile(
                fs.readFileSync("./test/extract/transpile/fixtures/coffee.coffee", 'utf8')
            )
        ).to.equal(
            fs.readFileSync("./test/extract/transpile/fixtures/coffee.js", 'utf8')
        );
    });

    it("transpiles literate coffeescript", () => {
        expect(
            litWrap.transpile(
                fs.readFileSync("./test/extract/transpile/fixtures/litcoffee.litcoffee", 'utf8')
            )
        ).to.equal(
            fs.readFileSync("./test/extract/transpile/fixtures/litcoffee.js", 'utf8')
        );
    });

    it("transpiles literate coffeescript in markdown", () => {
        expect(
            litWrap.transpile(
                fs.readFileSync("./test/extract/transpile/fixtures/markdownlitcoffee.coffee.md", 'utf8')
            )
        ).to.equal(
            fs.readFileSync("./test/extract/transpile/fixtures/markdownlitcoffee.js", 'utf8')
        );
    });

    it("transpiles jsx'y coffeescript", () => {
        expect(
            wrap.transpile(
                fs.readFileSync("./test/extract/transpile/fixtures/csx.cjsx", 'utf8')
            )
        ).to.equal(
            fs.readFileSync("./test/extract/transpile/fixtures/csx.jsx", 'utf8')
        );
    });
});
