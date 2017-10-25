"use strict";
const fs               = require('fs');
const expect           = require('chai').expect;
const render           = require('../../src/report/dotReporter');
const deps             = require('./fixtures/cjs-no-dependency-valid.json');
const unresolvableDeps = require('./fixtures/es6-unresolvable-deps.json');
const doNotFollowDeps  = require('./fixtures/do-not-follow-deps.json');

const elFixture           = fs.readFileSync('test/report/fixtures/clusterless.dot', 'utf8');
const unresolvableFixture = fs.readFileSync('test/report/fixtures/unresolvable.dot', 'utf8');
const doNotFollowFixture  = fs.readFileSync('test/report/fixtures/donotfollow.dot', 'utf8');

describe("dot reporter", () => {
    it("renders a dot - modules in the root don't come in a cluster", () => {
        expect(render(deps).dependencies).to.deep.equal(elFixture);
    });

    it("renders a dot - unresolvable in a sub folder (either existing or not) get labeled as unresolvable", () => {
        expect(render(unresolvableDeps).dependencies).to.deep.equal(unresolvableFixture);
    });

    it("renders a dot - matchesDoNotFollow rendered as folders", () => {
        expect(render(doNotFollowDeps).dependencies).to.deep.equal(doNotFollowFixture);
    });

});

/* eslint max-len: 0 */
