const expect                  = require('chai').expect;
const errHTML                 = require('../../src/report/err-html');
const everythingFineResult    = require('./fixtures/everything-fine.json');
const validationMoreThanOnce  = require('./fixtures/violation-more-than-once.json');


describe("report/err-html", () => {
    it('lalala everything fine', () => {
        const lOkeliDokelyKey = 'gummy bears';

        expect(errHTML(everythingFineResult)).to.contain(lOkeliDokelyKey);
    });

    it('lalala everything not fine', () => {
        const lOkeliDokelyKey = 'gummy bears';
        const lReport = errHTML(validationMoreThanOnce);

        expect(lReport).to.not.contain(lOkeliDokelyKey);
        expect(lReport).to.contain('All violations');


    });

});
