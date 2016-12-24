"use strict";
const expect     = require('chai').expect;
const processCLI = require("../../src/cli/processCLI");
const fs         = require("fs");
const tst        = require("../utl/testutensils");
const path       = require("path");
const _          = require("lodash");
const intercept  = require("intercept-stdout");

const OUT_DIR    = "./test/cli/output";
const FIX_DIR    = "./test/cli/fixtures";

/* eslint max-len:0*/
const testPairs = [
    {
        description: "dependency-cruise -f test/output/{{moduleType}}.dir.json test/cli/fixtures/{{moduleType}}",
        dirOrFile: "test/cli/fixtures/{{moduleType}}",
        options: {
            outputTo: path.join(OUT_DIR, "{{moduleType}}.dir.json")
        },
        expect: "{{moduleType}}.dir.json",
        cleanup: true
    },
    {
        description: "dependency-cruise -f test/output/{{moduleType}}.dir.json test/cli/fixtures/{{moduleType}}",
        dirOrFile: "test/cli/fixtures/{{moduleType}}",
        options: {
            outputTo: path.join(OUT_DIR, "{{moduleType}}.dir.json")
        },
        expect: "{{moduleType}}.dir.json",
        cleanup: true
    },
    {
        description: "dependency-cruise -f test/output/{{moduleType}}.file.json test/cli/fixtures/{{moduleType}}/root_one.js",
        dirOrFile: "test/cli/fixtures/{{moduleType}}/root_one.js",
        options: {
            outputTo: path.join(OUT_DIR, "{{moduleType}}.file.json")
        },
        expect: "{{moduleType}}.file.json",
        cleanup: true
    },
    {
        description: "dependency-cruise -f test/output/{{moduleType}}.dir.filtered.json -x node_modules test/cli/fixtures/{{moduleType}}",
        dirOrFile: "test/cli/fixtures/{{moduleType}}",
        options: {
            outputTo: path.join(OUT_DIR, "{{moduleType}}.dir.filtered.json"),
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

function deleteDammit(pFileName) {
    try {
        fs.unlinkSync(pFileName);
    } catch (e) {
        // process.stderr.write(e.message || e);
    }
}

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

    deleteDammit(path.join(OUT_DIR, "cjs.dir.stdout.json"));
    deleteDammit(path.join(OUT_DIR, "amd.dir.stdout.json"));
    deleteDammit(path.join(OUT_DIR, "cjs.dir.dot"));
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

        lRetval.options = _.clone(pTestPair.options);
        lRetval.options.outputTo = pTestPair.options.outputTo.replace(/{{moduleType}}/g, pModuleType);
        if (Boolean(pTestPair.options.system)) {
            lRetval.options.system = pTestPair.options.system.replace(/{{moduleType}}/g, pModuleType);
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

describe("#processCLI", () => {
    before("set up", () => {
        resetOutputDir();
    });

    after("tear down", () => {
        resetOutputDir();
    });

    describe("file based tests - commonJS", () => {
        runFileBasedTests("cjs");
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
                    outputTo: lOutputTo
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
                "If you need a currently-not-enabled transpiler (those with a '"
            );
        });

        it("dependency-cruise test/cli/fixtures/cjs - outputs to stdout", () => {
            let lCapturedStdout = "";
            const unhookIntercept = intercept(pText => {
                lCapturedStdout += pText;
            });

            processCLI(["test/cli/fixtures/cjs"]);
            unhookIntercept();
            fs.writeFileSync(
                path.join(OUT_DIR, "cjs.dir.stdout.json"),
                lCapturedStdout,
                "utf8"
            );

            tst.assertFileEqual(
                path.join(OUT_DIR, "cjs.dir.stdout.json"),
                path.join(FIX_DIR, "cjs.dir.stdout.json")
            );
        });

        it("dependency-cruise --output-type json test/cli/fixtures/cjs - outputs a slew of json to stdout", () => {
            let lCapturedStdout = "";
            const unhookIntercept = intercept(pText => {
                lCapturedStdout += pText;
            });

            processCLI(["test/cli/fixtures/cjs"], {outputTo: "-", outputType: 'json'});
            unhookIntercept();
            fs.writeFileSync(
                path.join(OUT_DIR, "cjs.dir.stdout.json"),
                lCapturedStdout,
                "utf8"
            );

            tst.assertFileEqual(
                path.join(OUT_DIR, "cjs.dir.stdout.json"),
                path.join(FIX_DIR, "cjs.dir.stdout.json")
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

            processCLI(["this-doesnot-exist"], {outputTo: path.join(OUT_DIR, "cjs.dir.wontmarch.json")});
            unhookInterceptStdOut();
            unhookInterceptStdErr();

            return expect(
                lCapturedStderr
            ).to.equal(
                "ERROR: Can't open 'this-doesnot-exist' for reading. Does it exist?\n"
            );
        });

        it("dependency-cruise -f /dev/null -M invalidmodulesystem - generates error", () => {
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
                    outputTo: path.join(OUT_DIR, "/dev/null"),
                    system: "invalidmodulesystem"
                }
            );
            unhookInterceptStdOut();
            unhookInterceptStdErr();
            intercept(pText => {
                lCapturedStderr += pText;
            })();

            return expect(
                lCapturedStderr
            ).to.equal(
                "ERROR: Invalid module system list: 'invalidmodulesystem'\n"
            );
        });

        it("dependency-cruise -f /dev/null -T invalidoutputtype - generates error", () => {
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
                    outputTo: path.join(OUT_DIR, "/dev/null"),
                    outputType: "invalidoutputtype"
                }
            );
            unhookInterceptStdOut();
            unhookInterceptStdErr();
            intercept(pText => {
                lCapturedStderr += pText;
            })();

            return expect(
                lCapturedStderr
            ).to.equal(
                "ERROR: 'invalidoutputtype' is not a valid output type.\n"
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
                    outputTo: path.join(OUT_DIR, "file/you/cant/write/to")
                }
            );
            unhookInterceptStdOut();
            unhookInterceptStdErr();
            intercept(pText => {
                lCapturedStderr += pText;
            })();

            return expect(
                lCapturedStderr
            ).to.equal(
                "ERROR: Writing to 'test/cli/output/file/you/cant/write/to' didn't work. Error: ENOENT: no such file or directory, open 'test/cli/output/file/you/cant/write/to'"
            );
        });

        it("dependency-cruise -f /dev/null -x '([a-zA-z]+)*'  - unsafe exclusion patterns don't run", () => {
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
                    outputTo: path.join(OUT_DIR, "/dev/null"),
                    exclude: "([A-Za-z]+)*"
                }
            );
            unhookInterceptStdOut();
            unhookInterceptStdErr();

            return expect(
                lCapturedStderr
            ).to.equal(
                "ERROR: The exclude pattern '([A-Za-z]+)*' will probably run very slowly - cowardly refusing to run.\n"
            );
        });
    });
});
