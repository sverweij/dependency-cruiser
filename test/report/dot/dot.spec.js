"use strict";
const fs               = require('fs');
const expect           = require('chai').expect;
const render           = require('../../../src/report/dot')();
const deps             = require('../fixtures/cjs-no-dependency-valid.json');
const unresolvableDeps = require('../fixtures/es6-unresolvable-deps.json');
const doNotFollowDeps  = require('../fixtures/do-not-follow-deps.json');
const orphanDeps       = require('../fixtures/orphan-deps.json');

const clusterlessFixture  = fs.readFileSync('test/report/fixtures/clusterless.dot', 'utf8');
const unresolvableFixture = fs.readFileSync('test/report/fixtures/unresolvable.dot', 'utf8');
const doNotFollowFixture  = fs.readFileSync('test/report/fixtures/donotfollow.dot', 'utf8');
const orphanFixture       = fs.readFileSync('test/report/fixtures/orphan-deps.dot', 'utf8');

describe("dot reporter", () => {
    it("renders a dot - modules in the root don't come in a cluster", () => {
        expect(render(deps).modules).to.deep.equal(clusterlessFixture);
    });

    it("renders a dot - unresolvable in a sub folder (either existing or not) get labeled as unresolvable", () => {
        expect(render(unresolvableDeps).modules).to.deep.equal(unresolvableFixture);
    });

    it("renders a dot - matchesDoNotFollow rendered as folders", () => {
        expect(render(doNotFollowDeps).modules).to.deep.equal(doNotFollowFixture);
    });

    it("renders a dot - renders modules with module level transgression with a severity deduced color", () => {
        expect(render(orphanDeps).modules).to.deep.equal(orphanFixture);
    });

});

/* eslint max-len: 0 */
