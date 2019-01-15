const fs      = require('fs');
const expect  = require('chai').expect;
const render  = require('../../../src/report/ddot');
const deps    = require('./fixtures/dependency-cruiser-2019-01-14.json');
const orphans = require('./fixtures/orphans.json');

const consolidatedDot        = fs.readFileSync('test/report/ddot/fixtures/dependency-cruiser-2019-01-14.dot', 'utf8');
const consolidatedOrphansDot = fs.readFileSync('test/report/ddot/fixtures/consolidated-orphans.dot', 'utf8');

describe("ddot reporter", () => {
    it("consolidates to folder level", () => {
        expect(render(deps).modules).to.deep.equal(consolidatedDot);
    });

    it("consolidates module only transgressions correctly", () => {
        expect(render(orphans).modules).to.deep.equal(consolidatedOrphansDot);
    });
});

/* eslint max-len: 0 */
