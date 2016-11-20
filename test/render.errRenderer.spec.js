"use strict";
const expect = require('chai').expect;
const render = require('../src/render/errRenderer').render;
const deps   = require('./fixtures/cjs-no-dependency-valid.json');

const NUMBER_OF_INVALID_DEPS_IN_FIXTURE = 21;

describe("err renderer", () => {
    it("renders a bunch of errors", () => {
        expect(render(deps).split('\n').length).to.equal(NUMBER_OF_INVALID_DEPS_IN_FIXTURE);
    });
});
