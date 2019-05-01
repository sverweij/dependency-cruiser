const expect     = require('chai').expect;
const extractES6Deps = require('../../../src/extract/ast-extractors/extract-ES6-deps');
const getASTFromSource  = require('../../../src/extract/parse/toJavascriptAST').getASTFromSource;

const extractES6 =
    (pJavaScriptSource, pDependencies) => extractES6Deps(getASTFromSource(pJavaScriptSource, 'js'), pDependencies);


describe("ast-extractors/extract-ES6-deps", () => {
    let lDeps = [];

    extractES6("import('./dynamic').then(pModule => pModule.x);", lDeps);

    it("dynamic imports", () => {
        expect(
            lDeps
        ).to.deep.equal(
            [
                {
                    moduleName: './dynamic',
                    moduleSystem: 'es6'
                }
            ]
        );
    });
});
