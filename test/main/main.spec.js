"use strict";
const chai      = require('chai');
const expect    = chai.expect;
const main      = require("../../src/main");
const tsFixture = require('./fixtures/ts.json');
const depSchema = require('../../src/extract/jsonschema.json');

chai.use(require('chai-json-schema'));

describe("main", () => {
    it("Returns an object when no options are passed", () => {
        const lResult = main(["test/main/fixtures/ts"]);

        expect(lResult).to.deep.equal(tsFixture);
        expect(lResult).to.be.jsonSchema(depSchema);
    });
});
