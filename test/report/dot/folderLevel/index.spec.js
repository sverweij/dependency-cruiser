const fs      = require('fs');
const expect  = require('chai').expect;
const render  = require('../../../../src/report/dot/folderLevel');
const deps    = require('./fixtures/dependency-cruiser-2019-01-14.json');
const orphans = require('./fixtures/orphans.json');
const rxjs    = require('./fixtures/rxjs.json');

const consolidatedDot        = fs.readFileSync('test/report/dot/folderLevel/fixtures/dependency-cruiser-2019-01-14.dot', 'utf8');
const consolidatedOrphansDot = fs.readFileSync('test/report/dot/folderLevel/fixtures/consolidated-orphans.dot', 'utf8');
const consolidatedRxJs       = fs.readFileSync('test/report/dot/folderLevel/fixtures/consolidated-rxjs.dot', 'utf8');

describe("report/dot/folderLevel reporter", () => {
    it("consolidates to folder level", () => {
        expect(render(deps).output).to.deep.equal(consolidatedDot);
    });

    it("consolidates module only transgressions correctly", () => {
        expect(render(orphans).output).to.deep.equal(consolidatedOrphansDot);
    });

    it("consolidates a slightly larger code base in a timely fashion", () => {
        expect(render(rxjs).output).to.deep.equal(consolidatedRxJs);
    });
});

/* eslint max-len: 0 */
