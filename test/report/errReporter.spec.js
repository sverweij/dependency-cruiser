"use strict";
const expect = require('chai').expect;
const render = require('../../src/report/errReporter');
const deps   = require('../cli/fixtures/cjs-no-dependency-valid.json');

const NUMBER_OF_INVALID_DEPS_IN_FIXTURE = 24;

describe("err reporter", () => {
    it("renders a bunch of errors", () => {
        expect(render(deps).dependencies.split('\n').length).to.equal(NUMBER_OF_INVALID_DEPS_IN_FIXTURE);
    });
});
