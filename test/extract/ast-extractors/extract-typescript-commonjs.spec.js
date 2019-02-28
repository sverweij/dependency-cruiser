const expect            = require('chai').expect;
const extractTypescript = require('./extract-typescript.utl');

describe("ast-extractors/extract-typescript - regular commonjs require", () => {

    it("extracts require of a module that uses an export-equals'", () => {
        expect(
            extractTypescript("import thing = require('./thing-that-uses-export-equals');")
        ).to.deep.equal(
            [
                {
                    moduleName: './thing-that-uses-export-equals',
                    moduleSystem: 'cjs'
                }
            ]
        );
    });
});
