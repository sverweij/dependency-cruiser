"use strict";
const fs           = require("fs");
const path         = require("path");
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
}

function setModuleType(pTestPairs, pModuleType) {
    return pTestPairs.map(pTestPair => {
        let lRetval = {
            description: pTestPair.description.replace(/{{moduleType}}/g, pModuleType),
            dirOrFile: pTestPair.dirOrFile.replace(/{{moduleType}}/g, pModuleType),
            expect: pTestPair.expect.replace(/{{moduleType}}/g, pModuleType),
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
            processCLI([pPair.dirOrFile], pPair.options);
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

            processCLI(
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
            tst.assertFileEqual(
                lOutputTo,
                path.join(FIX_DIR, lOutputFileName)
            );
        });

        it("dependency-cruise -i shows meta info about the current environment", () => {
            let lCapturedStdout = "";
            const unhookIntercept = intercept(pText => {
                lCapturedStdout += pText;
            });

            processCLI(null, ({info: true}));
            unhookIntercept();

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

            processCLI(["this-doesnot-exist"], {outputTo: path.join(OUT_DIR, "cjs.dir.wontmarch.json"), forceCircular: true});
            unhookInterceptStdOut();
            unhookInterceptStdErr();

            return expect(
                lCapturedStderr
            ).to.contain(
                "ERROR: Can't open 'this-doesnot-exist' for reading. Does it exist?\n"
            );
        });

        it("dependency-cruise -f file/you/cant/write/to - generates error", () => {
            let lCapturedStderr = "";
            const unhookInterceptStdOut = intercept(() => {
                // This space intentionally left empty
            });

            const unhookInterceptStdErr = intercept(pText => {
                lCapturedStderr += pText;
            });

            processCLI(
                ["test/cli/fixtures"],
                {
                    outputTo: path.join(OUT_DIR, "file/you/cant/write/to"),
                    forceCircular: true
                }
            );
            unhookInterceptStdOut();
            unhookInterceptStdErr();
            intercept(pText => {
                lCapturedStderr += pText;
            })();

            return expect(
                lCapturedStderr
            ).to.contain(
                "ERROR: Writing to 'test/cli/output/file/you/cant/write/to' didn't work. Error: ENOENT: no such file or directory, open 'test/cli/output/file/you/cant/write/to'"
            );
        });

        it("dependency-cruise --system cjs,es6 will generates a deprecation warning", () => {
            let lCapturedStderr = "";
            const unhookInterceptStdOut = intercept(() => {
                // This space intentionally left empty
            });

            const unhookInterceptStdErr = intercept(pText => {
                lCapturedStderr += pText;
            });

            processCLI(
                ["test/cli/fixtures"],
                {
                    system: "cjs,es6"
                }
            );
            unhookInterceptStdOut();
            unhookInterceptStdErr();
            intercept(pText => {
                lCapturedStderr += pText;
            })();

            return expect(
                lCapturedStderr
            ).to.contain(
                "depcrecated"
            );
        });

        it("dependency-cruise --init-rules will generate a rules file and tells that back on stdout", () => {
            let lCapturedStdout = "";
            const lValidationFileName = "test/cli/output/some-dependency-cruiser-config.json";
            const unhookInterceptStdOut = intercept(pText => {
                lCapturedStdout += pText;
            });
            const unhookInterceptStdErr = intercept(() => {
                // This space intentionally left empty
            });

            deleteDammit(lValidationFileName);
            processCLI(
                ["test/cli/fixtures"],
                {
                    validate: lValidationFileName,
                    initRules: true
                }
            );
            unhookInterceptStdOut();
            unhookInterceptStdErr();
            intercept(pText => {
                lCapturedStdout += pText;
            })();

            expect(
                lCapturedStdout
            ).to.contain(
                `Successfully created '${lValidationFileName}'`
            );
            deleteDammit(lValidationFileName);
        });

        describe("file based tests - commonJS", () => {
            runFileBasedTests("cjs");
        });

    });
});
