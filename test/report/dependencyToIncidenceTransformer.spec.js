"use strict";
const expect    = require('chai').expect;
const transform = require('../../src/report/dependencyToIncidenceTransformer').transform;

const ONE_VIOLATION_DEPS_INPUT = require("./fixtures/one-violation.json").dependencies;
const ONE_VIOLATION_DEPS_FIXTURE = require("./fixtures/one-violation-incidences.json");
const MORE_VIOLATIONS_DEPS_INPUT = require("./fixtures/more-violations.json").dependencies;
const MORE_VIOLATIONS_DEPS_FIXTURE = require("./fixtures/more-violations-incidences.json");

describe('dependencyToIncidenceTransformer', () => {
    it('leaves an empty dependencies list alone', () => {
        expect(transform([])).to.deep.equal([]);
    });

    it('snoggels de warempel', () => {
        expect(transform(ONE_VIOLATION_DEPS_INPUT)).to.deep.equal(ONE_VIOLATION_DEPS_FIXTURE);
    });

    it('snoggels de warempel maal twee', () => {
        expect(transform(MORE_VIOLATIONS_DEPS_INPUT)).to.deep.equal(MORE_VIOLATIONS_DEPS_FIXTURE);
    });
});
