const expect       = require('chai').expect;
const render       = require('../../src/report/eslint');
const okdeps       = require('./fixtures/everything-fine.json');
const deps         = require('./fixtures/cjs-no-dependency-valid.json');
const depsES       = require('./fixtures/cjs-no-dependency-valid-eslint-format.json');
const moduleErrs   = require('./fixtures/module-errors.json');
const moduleErrsES = require('./fixtures/module-errors-eslint-format.json');

describe("report/eslint", () => {
    it("says everything fine", () => {
        expect(JSON.parse(render(okdeps))).to.deep.equal([]);
    });
    it("renders a bunch of errors", () => {
        expect(JSON.parse(render(deps))).to.deep.equal(depsES);
    });
    it("renders module only transgressions", () => {
        expect(JSON.parse(render(moduleErrs))).to.deep.equal(moduleErrsES);
    });
});
