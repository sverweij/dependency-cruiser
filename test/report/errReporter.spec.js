"use strict";
const expect   = require('chai').expect;
const render   = require('../../src/report/errReporter');
const deps     = require('./fixtures/cjs-no-dependency-valid.json');
const warndeps = require('./fixtures/err-only-warnings.json');

const NUMBER_OF_LINES_IN_ERR_OUTPUT = 6;

describe("err reporter", () => {
    it("renders a bunch of errors", () => {
        expect(render(deps).dependencies.split('\n').length).to.equal(NUMBER_OF_LINES_IN_ERR_OUTPUT);
    });
    it("renders a bunch of warnings", () => {
        expect(render(warndeps).dependencies.split('\n').length).to.equal(NUMBER_OF_LINES_IN_ERR_OUTPUT);
    });
});
