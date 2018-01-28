const expect            = require('chai').expect;
const extractTypescript = require('./extract-typescript.utl');

describe("extract-typescript - regular imports", () => {

    it("extracts 'import for side effects only'", () => {
        expect(
            extractTypescript("import './import-for-side-effects';")
        ).to.deep.equal(
            [
                {
                    moduleName: './import-for-side-effects',
                    moduleSystem: 'es6'
                }
            ]
        );
    });

    it("extracts 'import some stuff only'", () => {
        expect(
            extractTypescript("import { SomeSingleExport } from './ts-thing';")
        ).to.deep.equal(
            [
                {
                    moduleName: './ts-thing',
                    moduleSystem: 'es6'
                }
            ]
        );
    });

    it("extracts 'import some stuff only and rename that'", () => {
        expect(
            extractTypescript("import { SomeSingleExport as RenamedSingleExport } from './ts-thing';")
        ).to.deep.equal(
            [
                {
                    moduleName: './ts-thing',
                    moduleSystem: 'es6'
                }
            ]
        );
    });

    it("extracts 'import everything into a variable'", () => {
        expect(
            extractTypescript("import * as entireTsOtherThingAsVariable from './ts-thing';")
        ).to.deep.equal(
            [
                {
                    moduleName: './ts-thing',
                    moduleSystem: 'es6'
                }
            ]
        );
    });

    it("leaves 'import equals' of variables alone", () => {
        expect(
            // typescript/lib/protocol.d.ts has this little pearl:
            extractTypescript("import protocol = ts.server.protocol")
        ).to.deep.equal(
            [
            ]
        );
    });


});
