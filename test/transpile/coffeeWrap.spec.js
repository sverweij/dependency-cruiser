"use strict";

const expect  = require("chai").expect;
const fs      = require('fs');
const wrap    = require("../../src/transpile/coffeeWrap")();
const litWrap = require("../../src/transpile/coffeeWrap")(true);

describe("coffeescript transpiler", () => {
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
                fs.readFileSync("./test/transpile/fixtures/coffee.coffee", 'utf8')
            )
        ).to.equal(
            fs.readFileSync("./test/transpile/fixtures/coffee.js", 'utf8')
        );
    });

    it("transpiles literate coffeescript", () => {
        expect(
            litWrap.transpile(
                fs.readFileSync("./test/transpile/fixtures/litcoffee.litcoffee", 'utf8')
            )
        ).to.equal(
            fs.readFileSync("./test/transpile/fixtures/litcoffee.js", 'utf8')
        );
    });

    it("transpiles literate coffeescript", () => {
        expect(
            litWrap.transpile(
                fs.readFileSync("./test/transpile/fixtures/markdownlitcoffee.coffee.md", 'utf8')
            )
        ).to.equal(
            fs.readFileSync("./test/transpile/fixtures/markdownlitcoffee.js", 'utf8')
        );
    });
});
