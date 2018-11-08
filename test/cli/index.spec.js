"use strict";
const fs           = require("fs");
// path.posix instead of path because otherwise on win32 the resulting
// outputTo would contain \\ instead of / which for this unit test doesn't matter
const path         = require("path").posix;
const expect       = require('chai').expect;
const intercept    = require("intercept-stdout");
const processCLI   = require("../../src/cli");
const tst          = require("../utl/testutensils");
const deleteDammit = require("./deleteDammit.utl");

const OUT_DIR      = "./test/cli/output";
const FIX_DIR      = "./test/cli/fixtures";

/* eslint max-len:0*/
const testPairs = [
    {
        description: "dependency-cruise -f test/output/{{moduleType}}.dir.json test/cli/fixtures/{{moduleType}}",
        dirOrFile: "test/cli/fixtures/{{moduleType}}",
        options: {
            outputTo: path.join(OUT_DIR, "{{moduleType}}.dir.json"),
            outputType: "json",
            forceCircular: true
        },
        expect: "{{moduleType}}.dir.json",
        cleanup: true
    },
    {
        description: "dependency-cruise -f test/output/{{moduleType}}.dir.json test/cli/fixtures/{{moduleType}}",
        dirOrFile: "test/cli/fixtures/{{moduleType}}",
        options: {
            outputTo: path.join(OUT_DIR, "{{moduleType}}.dir.json"),
            outputType: "json",
            forceCircular: true
        },
        expect: "{{moduleType}}.dir.json",
        cleanup: true
    },
    {
        description: "dependency-cruise -f test/output/{{moduleType}}.file.json test/cli/fixtures/{{moduleType}}/root_one.js",
        dirOrFile: "test/cli/fixtures/{{moduleType}}/root_one.js",
        options: {
            outputTo: path.join(OUT_DIR, "{{moduleType}}.file.json"),
            outputType: "json",
            forceCircular: true
        },
        expect: "{{moduleType}}.file.json",
        cleanup: true
    },
    {
        description: "dependency-cruise -f test/output/{{moduleType}}.dir.filtered.json -x node_modules test/cli/fixtures/{{moduleType}}",
        dirOrFile: "test/cli/fixtures/{{moduleType}}",
        options: {
            outputTo: path.join(OUT_DIR, "{{moduleType}}.dir.filtered.json"),
            outputType: "json",
            forceCircular: true,
            exclude: "node_modules"
        },
        expect: "{{moduleType}}.dir.filtered.json",
        cleanup: true
    },
    {
        description: "html",
        dirOrFile: "test/cli/fixtures/{{moduleType}}",
        options: {
            outputTo: path.join(OUT_DIR, "{{moduleType}}.dir.filtered.html"),
            outputType: "html",
            forceCircular: true,
            validate: "test/cli/fixtures/rules.sub-not-allowed.json",
            exclude: "node_modules"
        },
        expect: "{{moduleType}}.dir.filtered.html",
        cleanup: true
    },
    {
        description: "dot",
        dirOrFile: "test/cli/fixtures/{{moduleType}}",
        options: {
            outputTo: path.join(OUT_DIR, "{{moduleType}}.dir.filtered.dot"),
            validate: "test/cli/fixtures/rules.sub-not-allowed.json",
            outputType: "dot",
            forceCircular: true,
            exclude: "node_modules"
        },
        expect: "{{moduleType}}.dir.filtered.dot",
        cleanup: true
    },
    {
        description: "dot - duplicate subs",
        dirOrFile: "test/cli/fixtures/duplicate-subs",
        options: {
            outputTo: path.join(OUT_DIR, "duplicate-subs.dot"),
            outputType: "dot",
            forceCircular: true,
            exclude: "node_modules"
        },
        expect: "duplicate-subs.dot",
        cleanup: true
    },
    {
        description: "csv",
        dirOrFile: "test/cli/fixtures/{{moduleType}}",
        options: {
            outputTo: path.join(OUT_DIR, "{{moduleType}}.dir.filtered.csv"),
            outputType: "csv",
            validate: "test/cli/fixtures/rules.sub-not-allowed.json",
            exclude: "node_modules"
        },
        expect: "{{moduleType}}.dir.filtered.csv",
        cleanup: true
    }
];

function resetOutputDir() {
    testPairs
        .filter(pPair => pPair.cleanup)
        .forEach(pPair => {
            try {
                fs.unlinkSync(pPair.options.outputTo.replace("{{moduleType}}", "cjs"));
                fs.unlinkSync(pPair.options.outputTo.replace("{{moduleType}}", "amd"));
            } catch (e) {
                // process.stderr.write(typeof e);
            }
        });

    deleteDammit(path.join(OUT_DIR, "multiple-in-one-go.json"));
    deleteDammit(path.join(OUT_DIR, "transgression-count.json"));
    deleteDammit(path.join(OUT_DIR, "webpack-config-alias.json"));
    deleteDammit(path.join(OUT_DIR, "webpack-config-alias-cruiser-config.json"));
    deleteDammit(path.join(OUT_DIR, "dynamic-import-ok.json"));
    deleteDammit(path.join(OUT_DIR, "dynamic-import-nok.json"));
    deleteDammit(path.join(OUT_DIR, "typescript-path-resolution.json"));
}

function setModuleType(pTestPairs, pModuleType) {
    return pTestPairs.map(pTestPair => {
        let lRetval = {
            description: pTestPair.description.replace(/{{moduleType}}/g, pModuleType),
            dirOrFile: pTestPair.dirOrFile.replace(/{{moduleType}}/g, pModuleType),
            expect: pTestPair.expect.replace(/{{moduleType}}/g, pModuleType),
            expectExitCode: pTestPair.expectExitCode || 0,
            cleanup: pTestPair.cleanup
        };

        lRetval.options = Object.assign({}, pTestPair.options);
        lRetval.options.outputTo = pTestPair.options.outputTo.replace(/{{moduleType}}/g, pModuleType);
        if (Boolean(pTestPair.options.moduleSystems)) {
            lRetval.options.moduleSystems = pTestPair.options.moduleSystems.replace(/{{moduleType}}/g, pModuleType);
        }

        return lRetval;
    });
}

function runFileBasedTests(pModuleType) {
    setModuleType(testPairs, pModuleType).forEach(pPair => {
        it(pPair.description, () => {
            const lExitCode = processCLI([pPair.dirOrFile], pPair.options);

            expect(lExitCode).to.equal(pPair.expectExitCode);
            tst.assertFileEqual(
                pPair.options.outputTo,
                path.join(FIX_DIR, pPair.expect)
            );
        });
    });
}
/* eslint mocha/no-hooks-for-single-case: off */
describe("#processCLI", () => {
    before("set up", () => {
        resetOutputDir();
    });

    after("tear down", () => {
        resetOutputDir();
    });

    describe("specials", () => {
        it("dependency-cruises multiple files and folders in one go", () => {
            const lOutputFileName = "multiple-in-one-go.json";
            const lOutputTo       = path.join(OUT_DIR, lOutputFileName);
            const lExitCode = processCLI(
                [
                    "test/cli/fixtures/cjs/sub",
                    "test/cli/fixtures/duplicate-subs/sub/more-in-sub.js",
                    "test/cli/fixtures/unresolvable-in-sub"
                ],
                {
                    outputTo: lOutputTo,
                    outputType: "json",
                    forceCircular: true
                }
            );

            expect(lExitCode).to.equal(0);
            tst.assertFileEqual(
                lOutputTo,
                path.join(FIX_DIR, lOutputFileName)
            );
        });

        it("returns 0 even if there's transgressions when outputType !== 'err' ", () => {
            const lOutputFileName = "transgression-count.json";
            const lOutputTo       = path.join(OUT_DIR, lOutputFileName);
            const lExitCode = processCLI(
                [
                    "test/cli/fixtures/cjs"
                ],
                {
                    outputTo: lOutputTo,
                    outputType: "json",
                    validate: "test/cli/fixtures/rules.sub-not-allowed-error.json"
                }
            );
            const lExpectedTransgressions = 0;

            expect(lExitCode).to.equal(lExpectedTransgressions);
        });

        it("returns the number of transgressions if outputType === 'err' ", () => {
            const lOutputFileName = "transgression-count.json";
            const lOutputTo       = path.join(OUT_DIR, lOutputFileName);
            const lExitCode = processCLI(
                [
                    "test/cli/fixtures/cjs"
                ],
                {
                    outputTo: lOutputTo,
                    outputType: "err",
                    validate: "test/cli/fixtures/rules.sub-not-allowed-error.json"
                }
            );
            const lExpectedTransgressions = 3;

            expect(lExitCode).to.equal(lExpectedTransgressions);
        });

        it("dependency-cruise -i shows meta info about the current environment", () => {
            let lCapturedStdout = "";
            const unhookIntercept = intercept(pText => {
                lCapturedStdout += pText;
            });
            const lExitCode = processCLI(null, ({info: true}));

            unhookIntercept();

            expect(lExitCode).to.equal(0);
            expect(
                lCapturedStdout
            ).to.contain(
                "If you need a supported, but not enabled transpiler"
            );
        });

        it("dependency-cruise -f cjs.dir.wontmarch.json this-doesnot-exist - non-existing generates an error", () => {
            let lCapturedStderr = "";
            const unhookInterceptStdOut = intercept(() => {
                // This space intentionally left empty
            });
            const unhookInterceptStdErr = intercept(pText => {
                lCapturedStderr += pText;
            });
            const lExitCode = processCLI(
                ["this-doesnot-exist"],
                {
                    outputTo: path.join(OUT_DIR, "cjs.dir.wontmarch.json"),
                    forceCircular: true}
            );

            unhookInterceptStdOut();
            unhookInterceptStdErr();

            expect(lExitCode).to.equal(1);
            return expect(
                lCapturedStderr
            ).to.contain(
                "ERROR: Can't open 'this-doesnot-exist' for reading. Does it exist?\n"
            );
        });

        it("dependency-cruise -f file/you/cant/write/to - generates an error", () => {
            let lCapturedStderr = "";
            const unhookInterceptStdOut = intercept(() => {
                // This space intentionally left empty
            });
            const unhookInterceptStdErr = intercept(pText => {
                lCapturedStderr += pText;
            });
            const lExitCode = processCLI(
                ["test/cli/fixtures"],
                {
                    outputTo: path.join(OUT_DIR, "file/you/cant/write/to")
                }
            );

            unhookInterceptStdOut();
            unhookInterceptStdErr();
            intercept(pText => {
                lCapturedStderr += pText;
            })();

            expect(lExitCode).to.equal(1);
            return expect(
                lCapturedStderr
            ).to.contain(
                "didn't work. Error: ENOENT: no such file or directory, open"
            );
        });

        it("dependency-cruise test/cli/fixtures without rules will report no dependency violations on stdout", () => {
            let lCapturedStderr = "";
            const unhookInterceptStdOut = intercept(() => {
                // This space intentionally left empty
            });
            const unhookInterceptStdErr = intercept(pText => {
                lCapturedStderr += pText;
            });
            const lExitCode = processCLI(
                ["test/cli/fixtures"]
            );

            unhookInterceptStdOut();
            unhookInterceptStdErr();
            intercept(pText => {
                lCapturedStderr += pText;
            })();

            expect(lExitCode).to.equal(0);
            return expect(
                lCapturedStderr
            ).to.contain(
                "no dependency violations found"
            );
        });

        it("dependency-cruise --init will generate a rules file and tells that back on stdout", () => {
            let lCapturedStdout = "";
            const lValidationFileName = "test/cli/output/some-dependency-cruiser-config.json";
            const unhookInterceptStdOut = intercept(pText => {
                lCapturedStdout += pText;
            });
            const unhookInterceptStdErr = intercept(() => {
                // This space intentionally left empty
            });

            deleteDammit(lValidationFileName);
            const lExitCode = processCLI(
                ["test/cli/fixtures"],
                {
                    validate: lValidationFileName,
                    init: true
                }
            );

            unhookInterceptStdOut();
            unhookInterceptStdErr();
            intercept(pText => {
                lCapturedStdout += pText;
            })();

            expect(lExitCode).to.equal(0);
            expect(
                lCapturedStdout
            ).to.contain(
                `Successfully created '${lValidationFileName}'`
            );
            deleteDammit(lValidationFileName);
        });

        it("dependency-cruise with a --webpack-config with an object export will respect the resolve stuff in there", () => {
            const lOutputFileName = "webpack-config-alias.json";
            const lOutputTo       = path.join(OUT_DIR, lOutputFileName);
            const lExitCode = processCLI(
                [
                    "test/cli/fixtures/webpackconfig/aliassy/src"
                ],
                {
                    outputTo: lOutputTo,
                    outputType: "json",
                    webpackConfig: "test/cli/fixtures/webpackconfig/aliassy/webpack.regularexport.config.js"
                }
            );

            expect(lExitCode).to.equal(0);
            tst.assertFileEqual(
                lOutputTo,
                path.join(FIX_DIR, lOutputFileName)
            );
        });

        it("dependency-cruise with a .dependency-cruiser config with a webpackConfig section will respect that config", () => {
            const lOutputFileName = "webpack-config-alias-cruiser-config.json";
            const lOutputTo       = path.join(OUT_DIR, lOutputFileName);
            const lExitCode = processCLI(
                [
                    "test/cli/fixtures/webpackconfig/aliassy/src"
                ],
                {
                    outputTo: lOutputTo,
                    outputType: "json",
                    validate: "test/cli/fixtures/webpackconfig/aliassy/dependency-cruiser-json-with-webpack-config.json"
                }
            );

            expect(lExitCode).to.equal(0);
            tst.assertFileEqual(
                lOutputTo,
                path.join(FIX_DIR, lOutputFileName)
            );
        });
    });

    it("dependency-cruise with a --ts-config will respect the configuration in there (working dynamic imports)", () => {
        const lOutputFileName = "dynamic-import-ok.json";
        const lOutputTo       = path.join(OUT_DIR, lOutputFileName);
        const lExitCode = processCLI(
            [
                "test/cli/fixtures/typescriptconfig/cli-dynamic-imports/import_dynamically.ts"
            ],
            {
                outputTo: lOutputTo,
                outputType: "json",
                tsConfig: "test/cli/fixtures/typescriptconfig/cli-dynamic-imports/tsconfig.compile_dynamic_imports.json"
            }
        );

        expect(lExitCode).to.equal(0);
        tst.assertFileEqual(
            lOutputTo,
            path.join(FIX_DIR, lOutputFileName)
        );
    });

    it("dependency-cruise with a --ts-config will respect the configuration in there", () => {
        const lOutputFileName = "dynamic-import-nok.json";
        const lOutputTo       = path.join(OUT_DIR, lOutputFileName);
        const lExitCode = processCLI(
            [
                "test/cli/fixtures/typescriptconfig/cli-dynamic-imports/import_dynamically2.ts"
            ],
            {
                outputTo: lOutputTo,
                outputType: "json",
                tsConfig: "test/cli/fixtures/typescriptconfig/cli-dynamic-imports/tsconfig.error_on_compile_dynamic_imports.json"
            }
        );

        expect(lExitCode).to.equal(0);
        tst.assertFileEqual(
            lOutputTo,
            path.join(FIX_DIR, lOutputFileName)
        );
    });

    it("dependency-cruise with a --ts-config with a path will resolve 'path' things", () => {
        const lOutputFileName = "typescript-path-resolution.json";
        const lOutputTo       = path.join(OUT_DIR, lOutputFileName);

        const lExitCode = processCLI(
            [
                "test/cli/fixtures/typescriptconfig/cli-config-with-path/src"
            ],
            {
                outputTo: lOutputTo,
                outputType: "json",
                tsConfig: "test/cli/fixtures/typescriptconfig/cli-config-with-path/tsconfig.json",
                webpackConfig: "test/cli/fixtures/typescriptconfig/cli-config-with-path/webpack.config.js"
            }
        );

        expect(lExitCode).to.equal(0);
        tst.assertFileEqual(
            lOutputTo,
            path.join(FIX_DIR, lOutputFileName)
        );
    });

    describe("file based tests - commonJS", () => {
        runFileBasedTests("cjs");
    });
});
