import { readFileSync, unlinkSync } from "node:fs";
import { doesNotThrow, equal, throws } from "node:assert/strict";
// path.posix instead of path because otherwise on win32 the resulting
// outputTo would contain \\ instead of / which for this unit test doesn't matter
import { join, posix as path } from "node:path";
import chalk from "chalk";
import { assertFileEqual, assertJSONFileEqual } from "./asserthelpers.utl.mjs";
import deleteDammit from "./delete-dammit.utl.cjs";
import {
  UnCalledWritableTestStream,
  WritableTestStream,
} from "./init-config/writable-test-stream.utl.mjs";
import cli from "#cli/index.mjs";

const OUT_DIR = "./test/cli/__output__";
const FIX_DIR = "./test/cli/__fixtures__";

/* eslint max-len:0 */
const TEST_PAIRS = [
  {
    description:
      "dependency-cruise -f test/output/{{moduleType}}.dir.json test/cli/__fixtures__/{{moduleType}}",
    dirOrFile: "test/cli/__fixtures__/{{moduleType}}",
    options: {
      outputTo: path.join(OUT_DIR, "{{moduleType}}.dir.json"),
      outputType: "json",
    },
    expect: "{{moduleType}}.dir.json",
    cleanup: true,
  },
  {
    description:
      "dependency-cruise -f test/output/{{moduleType}}.dir.json test/cli/__fixtures__/{{moduleType}}",
    dirOrFile: "test/cli/__fixtures__/{{moduleType}}",
    options: {
      outputTo: path.join(OUT_DIR, "{{moduleType}}.dir.json"),
      outputType: "json",
    },
    expect: "{{moduleType}}.dir.json",
    cleanup: true,
  },
  {
    description:
      "dependency-cruise -f test/output/{{moduleType}}.file.json test/cli/__fixtures__/{{moduleType}}/root_one.js",
    dirOrFile: "test/cli/__fixtures__/{{moduleType}}/root_one.js",
    options: {
      outputTo: path.join(OUT_DIR, "{{moduleType}}.file.json"),
      outputType: "json",
    },
    expect: "{{moduleType}}.file.json",
    cleanup: true,
  },
  {
    description:
      "dependency-cruise -f test/output/{{moduleType}}.dir.filtered.json -x node_modules test/cli/__fixtures__/{{moduleType}}",
    dirOrFile: "test/cli/__fixtures__/{{moduleType}}",
    options: {
      outputTo: path.join(OUT_DIR, "{{moduleType}}.dir.filtered.json"),
      outputType: "json",
      exclude: "node_modules",
    },
    expect: "{{moduleType}}.dir.filtered.json",
    cleanup: true,
  },
  {
    description: "html",
    dirOrFile: "test/cli/__fixtures__/{{moduleType}}",
    options: {
      outputTo: path.join(OUT_DIR, "{{moduleType}}.dir.filtered.html"),
      outputType: "html",
      validate: "test/cli/__fixtures__/rules.sub-not-allowed.json",
      exclude: "node_modules",
    },
    expect: "{{moduleType}}.dir.filtered.html",
    cleanup: true,
  },
  {
    description: "regular dot with default theme",
    dirOrFile: "test/cli/__fixtures__/{{moduleType}}",
    options: {
      outputTo: path.join(OUT_DIR, "{{moduleType}}.dir.filtered.dot"),
      validate: "test/cli/__fixtures__/rules.sub-not-allowed.json",
      outputType: "dot",
      exclude: "node_modules",
    },
    expect: "{{moduleType}}.dir.filtered.dot",
    cleanup: true,
  },
  {
    description: "dot - duplicate subs",
    dirOrFile: "test/cli/__fixtures__/duplicate-subs",
    options: {
      outputTo: path.join(OUT_DIR, "duplicate-subs.dot"),
      outputType: "dot",
      exclude: "node_modules",
    },
    expect: "duplicate-subs/expected.dot",
    cleanup: true,
  },
  {
    description: "csv",
    dirOrFile: "test/cli/__fixtures__/{{moduleType}}",
    options: {
      outputTo: path.join(OUT_DIR, "{{moduleType}}.dir.filtered.csv"),
      outputType: "csv",
      validate: "test/cli/__fixtures__/rules.sub-not-allowed.json",
      exclude: "node_modules",
    },
    expect: "{{moduleType}}.dir.filtered.csv",
    cleanup: true,
  },
  {
    description: "alternate basedir",
    dirOrFile: "src",
    options: {
      outputTo: path.join(OUT_DIR, "alternate-basedir.json"),
      outputType: "json",
      doNotFollow: "node_modules",
      ruleSet: {
        options: {
          baseDir: join(
            process.cwd(),
            "test/cli/__fixtures__/alternate-basedir",
          ),
        },
      },
    },
    expect: "alternate-basedir/expected.json",
    cleanup: true,
  },
  {
    description: "workspaces mono repo",
    dirOrFile: "apps",
    options: {
      outputTo: path.join(OUT_DIR, "workspaces-mono-repo.json"),
      outputType: "json",
      doNotFollow: "node_modules",
      ruleSet: {
        options: {
          preserveSymlinks: false,
          baseDir: join(
            process.cwd(),
            "test/cli/__fixtures__/workspaces-mono-repo",
          ),
        },
      },
    },
    expect: "workspaces-mono-repo/expected.json",
    cleanup: true,
  },
];

function resetOutputDirectory() {
  TEST_PAIRS.filter((pPair) => pPair.cleanup).forEach((pPair) => {
    try {
      unlinkSync(pPair.options.outputTo.replace("{{moduleType}}", "cjs"));
      unlinkSync(pPair.options.outputTo.replace("{{moduleType}}", "amd"));
    } catch (pError) {
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
  deleteDammit(path.join(OUT_DIR, "babel-es6-result.json"));
  deleteDammit(path.join(OUT_DIR, "babel-ts-result.json"));
  deleteDammit(path.join(OUT_DIR, "known-errors-not-known.txt"));
  deleteDammit(path.join(OUT_DIR, "known-errors-known.txt"));
  deleteDammit(path.join(OUT_DIR, "this-thing-likely-wont-exist.txt"));
  deleteDammit(path.join(OUT_DIR, "workspaces-mono-repo-aliases.json"));
}

function setModuleType(pTestPairs, pModuleType) {
  return pTestPairs.map((pTestPair) => {
    let lReturnValue = {
      description: pTestPair.description.replace(
        /{{moduleType}}/g,
        pModuleType,
      ),
      dirOrFile: pTestPair.dirOrFile.replace(/{{moduleType}}/g, pModuleType),
      expect: pTestPair.expect.replace(/{{moduleType}}/g, pModuleType),
      expectExitCode: pTestPair.expectExitCode || 0,
      cleanup: pTestPair.cleanup,
    };

    lReturnValue.options = { ...pTestPair.options };
    lReturnValue.options.outputTo = pTestPair.options.outputTo.replace(
      /{{moduleType}}/g,
      pModuleType,
    );
    if (Boolean(pTestPair.options.moduleSystems)) {
      lReturnValue.options.moduleSystems =
        pTestPair.options.moduleSystems.replace(/{{moduleType}}/g, pModuleType);
    }

    return lReturnValue;
  });
}

function runFileBasedTests(pModuleType) {
  setModuleType(TEST_PAIRS, pModuleType).forEach((pPair) => {
    it(pPair.description, async () => {
      const lExitCode = await cli([pPair.dirOrFile], pPair.options);

      equal(lExitCode, pPair.expectExitCode);
      if (pPair.options.outputType === "json") {
        assertJSONFileEqual(
          pPair.options.outputTo,
          path.join(FIX_DIR, pPair.expect),
        );
      } else {
        assertFileEqual(
          pPair.options.outputTo,
          path.join(FIX_DIR, pPair.expect),
        );
      }
    });
  });
}
/* eslint mocha/no-hooks-for-single-case: off */
describe("[E] cli/index", () => {
  const lCurrentWorkingDirectory = process.cwd();
  before("set up", () => {
    resetOutputDirectory();
  });

  after("tear down", () => {
    resetOutputDirectory();
  });

  afterEach("reset cwd", () => {
    process.chdir(lCurrentWorkingDirectory);
  });

  describe("[E] specials", () => {
    let lChalkLevel = chalk.level;

    before("disable chalk coloring", () => {
      chalk.level = 0;
    });
    after("enable chalk coloring again", () => {
      chalk.level = lChalkLevel;
    });
    it("dependency-cruises multiple files and folders in one go", async () => {
      const lOutputFileName = "multiple-in-one-go.json";
      const lOutputTo = path.join(OUT_DIR, lOutputFileName);
      const lExitCode = await cli(
        [
          "test/cli/__fixtures__/cjs/sub",
          "test/cli/__fixtures__/duplicate-subs/sub/more-in-sub.js",
          "test/cli/__fixtures__/unresolvable-in-sub",
        ],
        {
          outputTo: lOutputTo,
          outputType: "json",
        },
      );

      equal(lExitCode, 0);
      assertJSONFileEqual(lOutputTo, path.join(FIX_DIR, lOutputFileName));
    });

    it("returns 0 even if there's transgressions when outputType !== 'error' ", async () => {
      const lOutputFileName = "transgression-count.json";
      const lOutputTo = path.join(OUT_DIR, lOutputFileName);
      const lExitCode = await cli(["test/cli/__fixtures__/cjs"], {
        outputTo: lOutputTo,
        outputType: "json",
        validate: "test/cli/__fixtures__/rules.sub-not-allowed-error.json",
      });
      const lExpectedTransgressions = 0;

      equal(lExitCode, lExpectedTransgressions);
    });

    it("returns the number of transgressions if outputType === 'error' ", async () => {
      const lOutputFileName = "transgression-count.json";
      const lOutputTo = path.join(OUT_DIR, lOutputFileName);
      const lExitCode = await cli(["test/cli/__fixtures__/cjs"], {
        outputTo: lOutputTo,
        outputType: "err",
        validate: "test/cli/__fixtures__/rules.sub-not-allowed-error.json",
      });
      const lExpectedTransgressions = 3;

      equal(lExitCode, lExpectedTransgressions);
    });

    it("dependency-cruise -i shows meta info about the current environment", async () => {
      const lExitCode = await cli(
        null,
        { info: true },
        {
          stdout: new WritableTestStream(
            /If you need a supported, but not enabled transpiler/,
          ),
          stderr: new UnCalledWritableTestStream(),
        },
      );

      equal(lExitCode, 0);
    });

    it("dependency-cruise -f cjs.dir.wontmarch.json this-doesnot-exist - non-existing generates an error", async () => {
      const lExitCode = await cli(
        ["this-doesnot-exist"],
        {
          outputTo: path.join(OUT_DIR, "cjs.dir.wontmarch.json"),
        },
        {
          stdout: new UnCalledWritableTestStream(),
          stderr: new WritableTestStream(
            /ERROR: Can't open 'this-doesnot-exist' for reading[.] Does it exist[?]/,
          ),
        },
      );

      equal(lExitCode, 1);
    });

    it("dependency-cruise -f file/you/cant/write/to - generates an error", async () => {
      const lExitCode = await cli(
        ["test/cli/__fixtures__"],
        {
          outputTo: path.join(OUT_DIR, "file/you/cant/write/to"),
        },
        {
          stdout: new UnCalledWritableTestStream(),
          stderr: new WritableTestStream(
            /didn't work[.] Error: ENOENT: no such file or directory, open/,
          ),
        },
      );

      equal(lExitCode, 1);
    });

    it("dependency-cruise test/cli/__fixtures__ without rules will report no dependency violations on stdout", async () => {
      const lExitCode = await cli(["test/cli/__fixtures__"], null, {
        stdout: new UnCalledWritableTestStream(),
        stderr: new WritableTestStream(/no dependency violations found/),
      });

      equal(lExitCode, 0);
    });

    it("dependency-cruise --init will generate a rules file and tells that back on stdout", async () => {
      const lValidationFileName = ".dependency-cruiser.js";

      deleteDammit(lValidationFileName);
      const lExitCode = await cli(
        ["test/cli/__fixtures__"],
        {
          init: "js",
        },
        {
          stderr: new UnCalledWritableTestStream(),
          stdout: new WritableTestStream(
            /Successfully created '[.]dependency-cruiser[.]js'/,
          ),
        },
      );

      equal(lExitCode, 0);
      deleteDammit(lValidationFileName);
    });

    it("dependency-cruise with a --webpack-config with an object export will respect the resolve stuff in there", async () => {
      const lOutputFileName = "webpack-config-alias.json";
      const lOutputTo = path.join(OUT_DIR, lOutputFileName);
      const lExitCode = await cli(
        ["test/cli/__fixtures__/webpackconfig/aliassy/src"],
        {
          outputTo: lOutputTo,
          outputType: "json",
          webpackConfig:
            "test/cli/__fixtures__/webpackconfig/aliassy/webpack.regularexport.config.js",
        },
      );

      equal(lExitCode, 0);
      assertJSONFileEqual(lOutputTo, path.join(FIX_DIR, lOutputFileName));
    });

    it("dependency-cruise with a .dependency-cruiser config with a webpackConfig section will respect that config", async () => {
      const lOutputFileName = "webpack-config-alias-cruiser-config.json";
      const lOutputTo = path.join(OUT_DIR, lOutputFileName);
      const lExitCode = await cli(
        ["test/cli/__fixtures__/webpackconfig/aliassy/src"],
        {
          outputTo: lOutputTo,
          outputType: "json",
          validate:
            "test/cli/__fixtures__/webpackconfig/aliassy/dependency-cruiser-json-with-webpack-config.json",
        },
      );

      equal(lExitCode, 0);
      assertJSONFileEqual(lOutputTo, path.join(FIX_DIR, lOutputFileName));
    });
  });

  it("dependency-cruise with a --ts-config will respect the configuration in there (working dynamic imports)", async () => {
    const lOutputFileName = "dynamic-import-ok.json";
    const lOutputTo = path.join(OUT_DIR, lOutputFileName);
    const lExitCode = await cli(
      [
        "test/cli/__fixtures__/typescriptconfig/cli-dynamic-imports/import_dynamically.ts",
      ],
      {
        outputTo: lOutputTo,
        outputType: "json",
        tsConfig:
          "test/cli/__fixtures__/typescriptconfig/cli-dynamic-imports/tsconfig.compile_dynamic_imports.json",
      },
    );

    equal(lExitCode, 0);
    assertJSONFileEqual(lOutputTo, path.join(FIX_DIR, lOutputFileName));
  });

  it("dependency-cruise with a --ts-config will respect the configuration in there", async () => {
    const lOutputFileName = "dynamic-import-nok.json";
    const lOutputTo = path.join(OUT_DIR, lOutputFileName);
    const lExitCode = await cli(
      [
        "test/cli/__fixtures__/typescriptconfig/cli-dynamic-imports/import_dynamically2.ts",
      ],
      {
        outputTo: lOutputTo,
        outputType: "json",
        tsConfig:
          "test/cli/__fixtures__/typescriptconfig/cli-dynamic-imports/tsconfig.error_on_compile_dynamic_imports.json",
      },
    );

    equal(lExitCode, 0);
    assertJSONFileEqual(lOutputTo, path.join(FIX_DIR, lOutputFileName));
  });

  it("dependency-cruise with a --ts-config with a path will resolve 'path' things", async () => {
    const lOutputFileName = "typescript-path-resolution.json";
    const lOutputTo = path.join(OUT_DIR, lOutputFileName);

    const lExitCode = await cli(
      ["test/cli/__fixtures__/typescriptconfig/cli-config-with-path/src"],
      {
        outputTo: lOutputTo,
        outputType: "json",
        tsConfig:
          "test/cli/__fixtures__/typescriptconfig/cli-config-with-path/tsconfig.json",
        webpackConfig:
          "test/cli/__fixtures__/typescriptconfig/cli-config-with-path/webpack.config.js",
      },
    );

    equal(lExitCode, 0);
    assertJSONFileEqual(lOutputTo, path.join(FIX_DIR, lOutputFileName));
  });

  it("dependency-cruise on a mono repo with tsconfig aliases will resolve the correct alias types", async () => {
    const lOutputFileName = "workspaces-mono-repo-aliases.json";
    const lOutputTo = path.join("../../__output__", lOutputFileName);
    process.chdir("./test/cli/__fixtures__/workspaces-mono-repo-aliases");

    const lExitCode = await cli(["apps/admin/"], {
      config: ".dependency-cruiser.js",
      outputType: "json",
      outputTo: lOutputTo,
    });

    equal(lExitCode, 0);
    assertJSONFileEqual(lOutputTo, "expected.json");
  });

  it("dependency-cruise with a babelConfig will use that (es6 edition)", async () => {
    const lOutputFileName = "babel-es6-result.json";
    const lOutputTo = path.join(OUT_DIR, lOutputFileName);

    const lExitCode = await cli(["test/cli/__fixtures__/babel/es6/src"], {
      outputTo: lOutputTo,
      outputType: "json",
      babelConfig: "test/cli/__fixtures__/babel/es6/babelrc.valid.json",
      webpackConfig:
        "test/cli/__fixtures__/babel/es6/webpack-cache-bust.config.js",
    });

    equal(lExitCode, 0);
    assertJSONFileEqual(
      lOutputTo,
      path.join(FIX_DIR, "babel", lOutputFileName),
    );
  });

  it("dependency-cruise with a babelConfig will use that (TypeScript edition)", async () => {
    const lOutputFileName = "babel-ts-result.json";
    const lOutputTo = path.join(OUT_DIR, lOutputFileName);

    const lExitCode = await cli(["test/cli/__fixtures__/babel/ts/src"], {
      outputTo: lOutputTo,
      outputType: "json",
      babelConfig: "test/cli/__fixtures__/babel/ts/babelrc.json",
      webpackConfig:
        "test/cli/__fixtures__/babel/ts/webpack-cache-bust.config.js",
    });

    equal(lExitCode, 0);
    assertJSONFileEqual(
      lOutputTo,
      path.join(FIX_DIR, "babel", lOutputFileName),
    );
  });

  it("dependency-cruise on a violation-ridden code base will return the errors", async () => {
    const lOutputFileName = "known-errors-not-known.txt";
    const lOutputTo = path.join(OUT_DIR, lOutputFileName);
    const lExpectedAmountOfErrors = 2;

    const lExitCode = await cli(
      ["test/cli/__fixtures__/known-violations/src"],
      {
        outputTo: lOutputTo,
        outputType: "err",
        validate: "test/cli/__fixtures__/known-violations/config.js",
      },
    );

    equal(lExitCode, lExpectedAmountOfErrors);

    // assertJSONFileEqual(
    //   lOutputTo,
    //   path.join(FIX_DIR, "babel", lOutputFileName)
    // );
  });

  it("dependency-cruise on a violation-ridden code base with known errors will only return unknown errors", async () => {
    const lOutputFileName = "known-errors-known.txt";
    const lOutputTo = path.join(OUT_DIR, lOutputFileName);
    let lResult = "";
    const lExpectedAmountOfErrors = 1;

    const lExitCode = await cli(
      ["test/cli/__fixtures__/known-violations/src"],
      {
        outputTo: lOutputTo,
        outputType: "err",
        validate: "test/cli/__fixtures__/known-violations/config.js",
        ignoreKnown: "test/cli/__fixtures__/known-violations/known.json",
      },
    );

    equal(lExitCode, lExpectedAmountOfErrors);
    doesNotThrow(() => {
      lResult = readFileSync(lOutputTo, { encoding: "utf8" });
    });
    equal(
      lResult.includes(
        "1 dependency violations (1 errors, 0 warnings). 6 modules, 3 dependencies cruised",
      ),
      true,
    );
    equal(lResult.includes("1 known violations ignored"), true);
  });

  it("will barf when the known violations file is invalid", async () => {
    const lOutputFileName = "this-thing-likely-wont-exist.txt";
    const lOutputTo = path.join(OUT_DIR, lOutputFileName);
    const lExpectedAmountOfErrors = 1;

    const lExitCode = await cli(
      ["test/cli/__fixtures__/known-violations/src"],
      {
        outputTo: lOutputTo,
        outputType: "err",
        validate: "test/cli/__fixtures__/known-violations/config.js",
        ignoreKnown:
          "test/cli/__fixtures__/known-violations/invalid-known-violations-file.json",
      },
      {
        stdout: new UnCalledWritableTestStream(),
        stderr: new WritableTestStream(
          /Can't open 'test\/cli\/__fixtures__\/known-violations\/invalid-known-violations-file[.]json' for reading[.] Does it exist[?]/,
        ),
      },
    );

    equal(lExitCode, lExpectedAmountOfErrors);
    throws(() => {
      readFileSync(lOutputTo, { encoding: "utf8" });
    });
  });

  describe("[I] file based tests - commonJS", () => {
    runFileBasedTests("cjs");
  });
});
