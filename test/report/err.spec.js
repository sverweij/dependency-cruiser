const expect     = require('chai').expect;
const render     = require('../../src/report/err');
const okdeps     = require('./fixtures/everything-fine.json');
const deps       = require('./fixtures/cjs-no-dependency-valid.json');
const warndeps   = require('./fixtures/err-only-warnings.json');
const erradds    = require('./fixtures/err-with-additional-information.json');
const orphanerrs = require('./fixtures/orphan-deps.json');

describe("report/err", () => {
    it("says everything fine", () => {
        expect(render(okdeps)).to.contain('no dependency violations found');
    });
    it("renders a bunch of errors", () => {
        const lResult = render(deps);

        expect(lResult).to.contain(
            '\u001b[31merror\u001b[39m no-leesplank: \u001b[1maap\u001b[22m → \u001b[1mnoot\u001b[22m\n'
        );
        expect(lResult).to.contain('2 dependency violations (2 errors, 0 warnings)');
    });
    it("renders a bunch of warnings", () => {
        expect(render(warndeps)).to.contain('1 dependency violations (0 errors, 1 warnings)');
    });
    it("renders module only violations as module only", () => {
        const lResult = render(orphanerrs);

        expect(lResult).to.contain('\u001b[31merror\u001b[39m no-orphans: \u001b[1mremi.js\u001b[22m\n');
        expect(lResult).to.contain('1 dependency violations (1 errors, 0 warnings)');
    });
    it("renders addtional information", () => {
        const lResult = render(erradds);

        expect(lResult).to.contain('\n  aap -> noot -> mies -> aap');
    });
});
