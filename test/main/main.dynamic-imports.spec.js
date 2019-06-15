const chai       = require('chai');
const main       = require("../../src/main");
const depSchema  = require('../../src/extract/results-schema.json');
const esOut      = require('./fixtures/dynamic-imports/es/output.json');
const tsOut      = require('./fixtures/dynamic-imports/typescript/output.json');
const tsOutpre   = require('./fixtures/dynamic-imports/typescript/output-pre-compilation-deps.json');

const expect     = chai.expect;

chai.use(require('chai-json-schema'));

const gWorkingDir = process.cwd();

describe('main - dynamic imports', () => {
    beforeEach("reset current wd", () => {
        process.chdir(gWorkingDir);
    });

    afterEach("reset current wd", () => {
        process.chdir(gWorkingDir);
    });

    it("detects dynamic dependencies in es", () => {
        process.chdir('test/main/fixtures/dynamic-imports/es');
        const lResult = main.cruise(
            ["src"],
            {
                ruleSet: {
                    forbidden: [
                        {
                            name: 'no-circular',
                            severity: 'info',
                            from: {
                            },
                            to: {
                                dynamic: false,
                                circular: true
                            }
                        },
                        {
                            name: 'no-dynamic',
                            severity: 'warn',
                            from: {
                            },
                            to: {
                                dynamic: true
                            }
                        }
                    ]
                },
                validate: true
            },
            {bustTheCache:true}
        );

        expect(lResult).to.deep.equal(esOut);
        expect(lResult).to.be.jsonSchema(depSchema);
    });

    it("detects dynamic dependencies in typescript", () => {
        process.chdir('test/main/fixtures/dynamic-imports/typescript');
        const lResult = main.cruise(
            ["src"],
            {
                ruleSet: {
                    forbidden: [
                        {
                            name: 'no-circular',
                            severity: 'info',
                            from: {
                            },
                            to: {
                                dynamic: false,
                                circular: true
                            }
                        },
                        {
                            name: 'no-dynamic',
                            severity: 'warn',
                            from: {
                            },
                            to: {
                                dynamic: true
                            }
                        }
                    ]
                },
                validate: true
            },
            {bustTheCache:true}
        );

        expect(lResult).to.deep.equal(tsOut);
        expect(lResult).to.be.jsonSchema(depSchema);
    });

    it("detects dynamic dependencies in typescript when using tsPreCompilationDeps", () => {
        process.chdir('test/main/fixtures/dynamic-imports/typescript');
        const lResult = main.cruise(
            ["src"],
            {
                ruleSet: {
                    forbidden: [
                        {
                            name: 'no-circular',
                            severity: 'info',
                            from: {
                            },
                            to: {
                                dynamic: false,
                                circular: true
                            }
                        },
                        {
                            name: 'no-dynamic',
                            severity: 'warn',
                            from: {
                            },
                            to: {
                                dynamic: true
                            }
                        }
                    ]
                },
                validate: true,
                tsPreCompilationDeps: true
            },
            {bustTheCache:true}
        );

        expect(lResult).to.deep.equal(tsOutpre);
        expect(lResult).to.be.jsonSchema(depSchema);
    });
});
