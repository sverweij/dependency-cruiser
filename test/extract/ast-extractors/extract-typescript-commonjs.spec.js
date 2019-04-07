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

    it("extracts regular require as a const, let or var", () => {
        expect(
            extractTypescript(
                `const lala1 = require('legit-one');
                 let lala2 = require('legit-two');
                 var lala3 = require('legit-three');`
            )
        ).to.deep.equal(
            [
                {
                    moduleName: 'legit-one',
                    moduleSystem: 'cjs'
                },
                {
                    moduleName: 'legit-two',
                    moduleSystem: 'cjs'
                },
                {
                    moduleName: 'legit-three',
                    moduleSystem: 'cjs'
                }
            ]
        );
    });

    it("extracts regular requires that are not on the top level in the AST", () => {
        expect(
            extractTypescript(
                `function f(x) {
                    if(x > 0) {
                        return require('midash')
                    } else {
                        const hi = require('slodash').splut();
                        for (i=0;i<10;i++) {
                            if (hi(i)) {
                                return require('hidash');
                            }
                        }
                    }
                }`
            )
        ).to.deep.equal(
            [{
                moduleName: 'midash',
                moduleSystem: 'cjs'
            },
            {
                moduleName: 'slodash',
                moduleSystem: 'cjs'
            },
            {
                moduleName: 'hidash',
                moduleSystem: 'cjs'
            }]
        );
    });

    it("ignores regular require without parameters", () => {
        expect(
            extractTypescript(
                "const lala = require()"
            )
        ).to.deep.equal(
            []
        );
    });

    it("ignores regular require with a non-string argument", () => {
        expect(
            extractTypescript(
                "const lala = require(666)"
            )
        ).to.deep.equal(
            []
        );
    });

    it("ignores regular require with a function for a parameter", () => {
        expect(
            extractTypescript(
                "const lala = require(helvete())"
            )
        ).to.deep.equal(
            []
        );
    });
});
