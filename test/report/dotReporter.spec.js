"use strict";
const fs               = require('fs');
const expect           = require('chai').expect;
const render           = require('../../src/report/dotReporter');
const deps             = require('./fixtures/cjs-no-dependency-valid.json');
const unresolvableDeps = require('./fixtures/es6-unresolvable-deps.json');

const elFixture           = fs.readFileSync('test/report/fixtures/clusterless.dot', 'utf-8');
const unresolvableFixture = fs.readFileSync('test/report/fixtures/unresolvable.dot', 'utf-8');

describe("dot reporter", () => {
    it("renders a dot - modules in the root don't come in a cluster", () => {
        expect(render(deps).dependencies).to.deep.equal(elFixture);
        // console.log(render(deps));
        // expect(1).to.equal(1);
    });

    it("renders a dot - unresolvable in a sub folder (either existing or not) get labeled as unresolvable", () => {
        expect(render(unresolvableDeps).dependencies).to.deep.equal(unresolvableFixture);
        // console.log(render(unresolvableDeps).dependencies);
        // expect(1).to.equal(1);
    });

});

/* eslint max-len: 0 */
