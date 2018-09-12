const expect           = require('chai').expect;
const normalizeOptions = require('../../src/cli/normalizeOptions');

describe("normalizeOptions", () => {
    it("normalizes empty options to no exclude, stdout, json and 'cjs, amd, es6'", () => {
        expect(
            normalizeOptions({})
        ).to.deep.equal(
            {
                outputTo: "-",
                outputType: "err",
                validate: false
            }
        );
    });

    it("normalizes --module-systems cjs,es6 to [cjs, es6]", () => {
        expect(
            normalizeOptions({moduleSystems: "cjs,es6"})
        ).to.deep.equal(
            {
                outputTo: "-",
                outputType: "err",
                moduleSystems: ["cjs", "es6"],
                validate: false
            }
        );
    });

    it("trims module system strings", () => {
        expect(
            normalizeOptions({
                moduleSystems: " amd,cjs ,  es6 "
            }).moduleSystems
        ).to.deep.equal(["amd", "cjs", "es6"]);
    });

    it("-v parameter assumes .dependency-cruiser for rules", () => {
        try {
            normalizeOptions({validate: true});
        } catch (e) {
            expect(e.message).to.include(".dependency-cruiser.json'");
        }
    });

    it("-v with parameter uses that parameter as rules file", () => {
        expect(
            normalizeOptions({validate: "./test/cli/fixtures/rules.empty.json"})
        ).to.deep.equal(
            {
                outputTo: "-",
                outputType: "err",
                rulesFile: "./test/cli/fixtures/rules.empty.json",
                "ruleSet": {},
                validate: true
            }
        );
    });

    it("a rules file with comments gets the comments stripped out & parsed", () => {
        expect(
            normalizeOptions({validate: "./test/cli/fixtures/rules.withcomments.json"})
        ).to.deep.equal(
            {
                outputTo: "-",
                outputType: "err",
                rulesFile: "./test/cli/fixtures/rules.withcomments.json",
                "ruleSet": {
                    "forbidden": [
                        {
                            "name": "sub-not-allowed",
                            "severity": "warn",
                            "from": {
                            },
                            "to": {
                                "path": "sub"
                            }
                        }
                    ]
                },
                validate: true
            }
        );
    });

    it("defaults tsConfig.fileName to 'tsconfig.json' if it wasn't specified", () => {
        expect(
            normalizeOptions({validate: "./test/cli/fixtures/rules.tsConfigNoFileName.json"})
        ).to.deep.equal(
            {
                outputTo: "-",
                outputType: "err",
                rulesFile: "./test/cli/fixtures/rules.tsConfigNoFileName.json",
                "ruleSet": {
                    options: {
                        tsConfig: {
                            fileName: "tsconfig.json"
                        }
                    }
                },
                validate: true
            }
        );
    });
    it("defaults webpackConfig.fileName to 'tsconfig.json' if it wasn't specified", () => {
        expect(
            normalizeOptions({validate: "./test/cli/fixtures/rules.webpackConfigNoFileName.json"})
        ).to.deep.equal(
            {
                outputTo: "-",
                outputType: "err",
                rulesFile: "./test/cli/fixtures/rules.webpackConfigNoFileName.json",
                "ruleSet": {
                    options: {
                        webpackConfig: {
                            fileName: "webpack.config.js"
                        }
                    }
                },
                validate: true
            }
        );
    });
});

