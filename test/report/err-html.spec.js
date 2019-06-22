const expect                  = require('chai').expect;
const errHTML                 = require('../../src/report/err-html');
const everythingFineResult    = require('./fixtures/everything-fine.json');
const validationMoreThanOnce  = require('./fixtures/violation-more-than-once.json');


describe("report/err-html", () => {
    const lOkeliDokelyKey = 'gummy bears';

    it('lalala everything fine', () => {
        expect(errHTML(everythingFineResult)).to.contain(lOkeliDokelyKey);
    });

    it('lalala everything not fine', () => {
        const lReport = errHTML(validationMoreThanOnce);

        expect(lReport).to.not.contain(lOkeliDokelyKey);
        expect(lReport).to.contain('All violations');
        expect(lReport).to.contain('<strong>127</strong> modules');
        expect(lReport).to.contain('<strong>259</strong> dependencies');
        expect(lReport).to.contain('<strong>0</strong> errors');
        expect(lReport).to.contain('<strong>1</strong> warnings');
        expect(lReport).to.contain('<strong>2</strong> informational');

        expect(lReport).to.contain('<td><strong>2</strong></td>');
        expect(lReport).to.contain(
            '<a href="https://github.com/sverweij/dependency-cruiser/blob/develop/src/cli/compileConfig/index.js">'
        );
    });

});
