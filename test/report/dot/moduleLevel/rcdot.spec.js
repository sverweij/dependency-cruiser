const fs              = require('fs');
const expect          = require('chai').expect;
const RCScheme        = require('../../../../src/report/dot/common/richModuleColorScheme.json');
const renderRCDot     = require('../../../../src/report/dot/moduleLevel')(RCScheme);
const renderDot       = require('../../../../src/report/dot/moduleLevel')();
const boringScheme    = require('../../../../src/report/dot/common/boringModuleColorScheme.json');
const renderBoringDot = require('../../../../src/report/dot/moduleLevel')(boringScheme);
const deps            = require('../../fixtures/richmodulecolor.json');

const richColorFixture = fs.readFileSync('test/report/fixtures/richmodulecolor.dot', 'utf8');
const boringColorFixture = fs.readFileSync('test/report/fixtures/defaultmodulecolor.dot', 'utf8');

describe("report/dot reporter coloring", () => {
    it("richly colors when passed a rich color scheme", () => {
        expect(renderRCDot(deps).modules).to.deep.equal(richColorFixture);
    });
    it("defaultly colors when passed no color scheme", () => {
        expect(renderDot(deps).modules).to.deep.equal(richColorFixture);
    });
    it("colors boringly when passed the boring color scheme", () => {
        expect(renderBoringDot(deps).modules).to.deep.equal(boringColorFixture);
    });
});
