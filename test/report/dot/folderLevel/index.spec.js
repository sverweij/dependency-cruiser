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
        const lRetval = render(deps);

        expect(lRetval.output).to.deep.equal(consolidatedDot);
        expect(lRetval.exitCode).to.equal(0);
    });

    it("consolidates module only transgressions correctly", () => {
        const lRetval = render(orphans);

        expect(lRetval.output).to.deep.equal(consolidatedOrphansDot);
        expect(lRetval.exitCode).to.equal(0);
    });

    it("consolidates a slightly larger code base in a timely fashion", () => {
        const lRetval = render(rxjs);

        expect(lRetval.output).to.deep.equal(consolidatedRxJs);
        expect(lRetval.exitCode).to.equal(0);
    });
});

/* eslint max-len: 0 */
