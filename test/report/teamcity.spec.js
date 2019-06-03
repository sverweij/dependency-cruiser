const fs           = require('fs');
const path         = require('path');
const expect       = require('chai').expect;
const render       = require('../../src/report/teamcity');
const okdeps       = require('./fixtures/teamcity/everything-fine.json');
const moduleErrs   = require('./fixtures/teamcity/module-errors.json');

function removePerSessionAttributes(pString) {
    return pString.replace(/ flowId='[^']+' timestamp='[^']+'/g, "");
}

describe("report/teamcity", () => {
    it("says everything fine when everything is fine", () => {
        const lFixture = fs.readFileSync(
            path.join(__dirname, 'fixtures', 'teamcity', 'everything-fine-teamcity-format.txt'),
            'utf8'
        );

        expect(
            removePerSessionAttributes(
                render(okdeps)
            )
        ).to.equal(
            lFixture
        );
    });
    it("renders module only transgressions", () => {
        const lFixture = fs.readFileSync(
            path.join(__dirname, 'fixtures', 'teamcity', 'module-errors-teamcity-format.txt'),
            'utf8'
        );

        expect(
            removePerSessionAttributes(
                render(moduleErrs)
            )
        ).to.equal(
            lFixture
        );
    });

});
