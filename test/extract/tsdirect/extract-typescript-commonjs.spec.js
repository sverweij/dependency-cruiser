const expect            = require('chai').expect;
const extractTypescript = require('../../../src/extract/extract-typescript');

describe("extract-typescript - regular commonjs require", () => {
    // it("extracts 'execute only' require", () => {
    //     expect(
    //         extractTypescript("require('./cjs-thing-execute');")
    //     ).to.deep.equal(
    //         [
    //             {
    //                 moduleName: './cjs-thing-execute',
    //                 moduleSystem: 'cjs'
    //             }
    //         ]
    //     );
    // });

    // it("extracts 'requiring into a variable (e.g. a const)'", () => {
    //     expect(
    //         extractTypescript("const cjsThing = require('./cjs-thing');")
    //     ).to.deep.equal(
    //         [
    //             {
    //                 moduleName: './cjs-thing',
    //                 moduleSystem: 'cjs'
    //             }
    //         ]
    //     );
    // });

    // it("extracts 'requiring something from a module into a variable (e.g. a const)'", () => {
    //     expect(
    //         extractTypescript("const cjsThingThing = require('./cjs-thing').thing;")
    //     ).to.deep.equal(
    //         [
    //             {
    //                 moduleName: './cjs-thing',
    //                 moduleSystem: 'cjs'
    //             }
    //         ]
    //     );
    // });

    // it("extracts 'requiring bang modules (e.g. require('zoinks!./wappie'))'", () => {
    //     expect(
    //         extractTypescript("const wappie = require('zoinks!./wappie');")
    //     ).to.deep.equal(
    //         [
    //             {
    //                 moduleName: './wappie',
    //                 moduleSystem: 'cjs'
    //             }
    //         ]
    //     );
    // });

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
