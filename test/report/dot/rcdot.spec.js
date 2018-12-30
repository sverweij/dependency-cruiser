const fs          = require('fs');
const expect      = require('chai').expect;
const renderRCDot = require('../../../src/report/dot')(require('../../../src/report/dot/richModuleColorScheme.json'));
const renderDot   = require('../../../src/report/dot')();
const deps        = require('../fixtures/richmodulecolor.json');

const richColorFixture = fs.readFileSync('test/report/fixtures/richmodulecolor.dot', 'utf8');
const defaultColorFixture = fs.readFileSync('test/report/fixtures/defaultmodulecolor.dot', 'utf8');

describe("dot reporter coloring", () => {
    it("richly colors when passed a rich color scheme", () => {
        expect(renderRCDot(deps).modules).to.deep.equal(richColorFixture);
    });
    it("defaultly colors when passed no color scheme", () => {
        expect(renderDot(deps).modules).to.deep.equal(defaultColorFixture);
    });
});
