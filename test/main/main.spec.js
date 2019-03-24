const chai       = require('chai');
const main       = require("../../src/main");
const depSchema  = require('../../src/extract/jsonschema.json');
const tsFixture  = require('./fixtures/ts.json');
const tsxFixture = require('./fixtures/tsx.json');
const jsxFixture = require('./fixtures/jsx.json');
const tsPreCompFixtureCJS = require('./fixtures/ts-precomp-cjs.json');
const tsPreCompFixtureES = require('./fixtures/ts-precomp-es.json');
const tsNoPrecompFixtureCJS = require('./fixtures/ts-no-precomp-cjs.json');
const tsNoPrecompFixtureES = require('./fixtures/ts-no-precomp-es.json');

const expect     = chai.expect;

chai.use(require('chai-json-schema'));

describe("main", () => {
    it("Returns an object when no options are passed", () => {
        const lResult = main.cruise(["test/main/fixtures/ts"]);

        expect(lResult).to.deep.equal(tsFixture);
        expect(lResult).to.be.jsonSchema(depSchema);
    });
    it("Returns an object when no options are passed (absolute path)", () => {
        const lResult = main.cruise([`${__dirname}/fixtures/ts`], {}, {bustTheCache:true});

        expect(lResult).to.deep.equal(tsFixture);
        expect(lResult).to.be.jsonSchema(depSchema);
    });
    it("Also processes tsx correctly", () => {
        const lResult = main.cruise(["test/main/fixtures/tsx"], {}, {bustTheCache:true});

        expect(lResult).to.deep.equal(tsxFixture);
        expect(lResult).to.be.jsonSchema(depSchema);
    });
    it("And jsx", () => {
        const lResult = main.cruise(["test/main/fixtures/jsx"], {}, {bustTheCache:true});

        expect(lResult).to.deep.equal(jsxFixture);
        expect(lResult).to.be.jsonSchema(depSchema);
    });
    it("And rulesets in the form a an object instead of json", () => {
        const lResult = main.cruise(
            ["test/main/fixtures/jsx"],
            {
                ruleSet : {}
            },
            {bustTheCache:true}
        );

        expect(lResult).to.deep.equal(jsxFixture);
        expect(lResult).to.be.jsonSchema(depSchema);
    });
    it("ts-pre-compilation-deps: on, target CJS", () => {
        const lResult = main.cruise(
            ["test/main/fixtures/ts-precompilation-deps-on-cjs"],
            {
                tsConfig: {
                    fileName: "test/main/fixtures/tsconfig.targetcjs.json"
                },
                tsPreCompilationDeps: true
            },
            {bustTheCache:true},
            {
                "options": {
                    "baseUrl": ".",
                    "module": "commonjs"
                }
            }
        );

        expect(lResult).to.deep.equal(tsPreCompFixtureCJS);
        expect(lResult).to.be.jsonSchema(depSchema);
    });
    it("ts-pre-compilation-deps: on, target ES", () => {
        const lResult = main.cruise(
            ["test/main/fixtures/ts-precompilation-deps-on-es"],
            {
                tsConfig: {
                    fileName: "test/main/fixtures/tsconfig.targetes.json"
                },
                tsPreCompilationDeps: true
            },
            {bustTheCache:true},
            {
                "options": {
                    "baseUrl": ".",
                    "module": "es6"
                }
            }
        );

        expect(lResult).to.deep.equal(tsPreCompFixtureES);
        expect(lResult).to.be.jsonSchema(depSchema);
    });
    it("ts-pre-compilation-deps: off, target CJS", () => {
        const lResult = main.cruise(
            ["test/main/fixtures/ts-precompilation-deps-off-cjs"],
            {
                tsConfig: {
                    fileName: "test/main/fixtures/tsconfig.targetcjs.json"
                },
                tsPreCompilationDeps: false
            },
            {bustTheCache:true},
            {
                "options": {
                    "baseUrl": ".",
                    "module": "commonjs"
                }
            }
        );

        expect(lResult).to.deep.equal(tsNoPrecompFixtureCJS);
        expect(lResult).to.be.jsonSchema(depSchema);
    });
    it("ts-pre-compilation-deps: off, target ES", () => {
        const lResult = main.cruise(
            ["test/main/fixtures/ts-precompilation-deps-off-es"],
            {
                tsConfig: {
                    fileName: "test/main/fixtures/tsconfig.targetes.json"
                },
                tsPreCompilationDeps: false
            },
            {bustTheCache:true},
            {
                "options": {
                    "baseUrl": ".",
                    "module": "es6"
                }
            }
        );

        expect(lResult).to.deep.equal(tsNoPrecompFixtureES);
        expect(lResult).to.be.jsonSchema(depSchema);
    });
});
