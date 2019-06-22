const expect     = require('chai').expect;
const chalk      = require('chalk');
const render     = require('../../src/report/err');
const okdeps     = require('./fixtures/everything-fine.json');
const deps       = require('./fixtures/cjs-no-dependency-valid.json');
const warndeps   = require('./fixtures/err-only-warnings.json');
const erradds    = require('./fixtures/err-with-additional-information.json');
const orphanerrs = require('./fixtures/orphan-deps.json');

describe("report/err", () => {
    let chalkEnabled = chalk.enabled;

    before("disable chalk coloring", () => {
        chalk.enabled = false;
    });
    after("put chalk enabled back to its original value", () => {
        chalk.enabled = chalkEnabled;
    });
    it("says everything fine", () => {
        expect(render(okdeps)).to.contain('no dependency violations found');
    });
    it("renders a bunch of errors", () => {
        const lResult = render(deps);

        expect(lResult).to.contain(
            'error no-leesplank: aap → noot\n'
        );
        expect(lResult).to.contain(
            '2 dependency violations (2 errors, 0 warnings). 33 modules, 333 dependencies cruised.'
        );
    });
    it("renders a bunch of warnings", () => {
        expect(render(warndeps)).to.contain('1 dependency violations (0 errors, 1 warnings)');
    });
    it("renders module only violations as module only", () => {
        const lResult = render(orphanerrs);

        expect(lResult).to.contain('error no-orphans: remi.js\n');
        expect(lResult).to.contain(
            '1 dependency violations (1 errors, 0 warnings). 1 modules, 0 dependencies cruised.'
        );
    });
    it("renders addtional information", () => {
        const lResult = render(erradds);

        expect(lResult).to.contain('\n  aap -> noot -> mies -> aap');
    });
});
