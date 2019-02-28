const expect   = require('chai').expect;
const render   = require('../../src/report/err');
const okdeps   = require('./fixtures/everything-fine.json');
const deps     = require('./fixtures/cjs-no-dependency-valid.json');
const warndeps = require('./fixtures/err-only-warnings.json');
const erradds  = require('./fixtures/err-with-additional-information.json');

describe("report/err", () => {
    it("says everything fine", () => {
        expect(render(okdeps).modules).to.contain('no dependency violations found');
    });
    it("renders a bunch of errors", () => {
        expect(render(deps).modules).to.contain('2 dependency violations (2 errors, 0 warnings)');
    });
    it("renders a bunch of warnings", () => {
        expect(render(warndeps).modules).to.contain('1 dependency violations (0 errors, 1 warnings)');
    });
    it("renders addtional information", () => {
        const lResult = render(erradds).modules;

        expect(lResult).to.contain('\n  aap -> noot -> mies -> aap');
    });
});
