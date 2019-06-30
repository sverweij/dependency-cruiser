const fs              = require('fs');
const expect          = require('chai').expect;
const RCScheme        = require('../../../../src/report/dot/common/richModuleColorScheme.json');
const renderDot       = require('../../../../src/report/dot/moduleLevel');
const deps            = require('../../fixtures/richmodulecolor.json');
const boringScheme    = require('./boringModuleColorScheme.json');


const richColorFixture = fs.readFileSync('test/report/fixtures/richmodulecolor.dot', 'utf8');
const boringColorFixture = fs.readFileSync('test/report/fixtures/defaultmodulecolor.dot', 'utf8');

describe("report/dot reporter coloring", () => {
    it("richly colors when passed a rich color scheme", () => {
        expect(renderDot(deps, RCScheme)).to.deep.equal(richColorFixture);
    });
    it("defaultly colors when passed no color scheme", () => {
        expect(renderDot(deps)).to.deep.equal(richColorFixture);
    });
    it("colors boringly when passed the boring color scheme", () => {
        expect(renderDot(deps, boringScheme)).to.deep.equal(boringColorFixture);
    });
});
