const expect            = require('chai').expect;
const extractTypescript = require('./extract-typescript.utl');

describe("ast-extractors/extract-typescript - re-exports", () => {

    it("extracts 're-export everything'", () => {
        expect(
            extractTypescript("export * from './ts-thing';")
        ).to.deep.equal(
            [
                {
                    moduleName: './ts-thing',
                    moduleSystem: 'es6',
                    dynamic: false
                }
            ]
        );
    });

    it("extracts 're-export and rename a thing from a re-export'", () => {
        expect(
            extractTypescript("export { ReExport as RenamedReExport } from './ts-thing'")
        ).to.deep.equal(
            [
                {
                    moduleName: './ts-thing',
                    moduleSystem: 'es6',
                    dynamic: false
                }
            ]
        );
    });

    it("leaves exports that are not re-exports alone", () => {
        expect(
            extractTypescript("export { ReExport as RenamedReExport };")
        ).to.deep.equal(
            []
        );
    });

});
