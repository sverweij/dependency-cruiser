"use strict";
const chai       = require('chai');
const expect     = chai.expect;
const main       = require("../../src/main");
const tsFixture  = require('./fixtures/ts.json');
const tsxFixture = require('./fixtures/tsx.json');
const jsxFixture = require('./fixtures/jsx.json');
const depSchema  = require('../../src/extract/jsonschema.json');

chai.use(require('chai-json-schema'));

describe("main", () => {
    it("Returns an object when no options are passed", () => {
        const lResult = main.cruise(["test/main/fixtures/ts"]);

        expect(lResult).to.deep.equal(tsFixture);
        expect(lResult).to.be.jsonSchema(depSchema);
    });
    it("Also processes tsx correctly", () => {
        const lResult = main.cruise(["test/main/fixtures/tsx"]);

        expect(lResult).to.deep.equal(tsxFixture);
        expect(lResult).to.be.jsonSchema(depSchema);
    });
    it("And jsx", () => {
        const lResult = main.cruise(["test/main/fixtures/jsx"]);

        expect(lResult).to.deep.equal(jsxFixture);
        expect(lResult).to.be.jsonSchema(depSchema);
    });
});
