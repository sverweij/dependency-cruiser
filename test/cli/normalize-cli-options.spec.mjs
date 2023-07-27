/* eslint-disable no-prototype-builtins */
import { fileURLToPath } from "node:url";
import { deepStrictEqual, strictEqual } from "node:assert";
import normalizeCliOptions, {
  determineRulesFileName,
} from "../../src/cli/normalize-cli-options.mjs";

// eslint-disable-next-line max-statements
describe("[I] cli/normalizeCliOptions - regular normalizations", () => {
  const WORKINGDIR = process.cwd();

  afterEach(() => {
    process.chdir(WORKINGDIR);
  });

  it("normalizes empty options to no exclude, stdout, json and 'cjs, amd, es6'", async () => {
    deepStrictEqual(await normalizeCliOptions({}), {
      outputTo: "-",
      outputType: "err",
      validate: false,
    });
  });

  it("normalizes --module-systems cjs,es6 to [cjs, es6]", async () => {
    deepStrictEqual(await normalizeCliOptions({ moduleSystems: "cjs,es6" }), {
      outputTo: "-",
      outputType: "err",
      moduleSystems: ["cjs", "es6"],
      validate: false,
    });
  });

  it("trims module system strings", async () => {
    const lNormalizedCliOptions = await normalizeCliOptions({
      moduleSystems: " amd,cjs ,  es6 ",
    });
    deepStrictEqual(lNormalizedCliOptions.moduleSystems, ["amd", "cjs", "es6"]);
  });

  it("-c / --config without params gets translated to -v/ --validate.", async () => {
    process.chdir("test/cli/__fixtures__/normalize-config/json-only");
    deepStrictEqual(await normalizeCliOptions({ config: true }), {
      outputTo: "-",
      outputType: "err",
      rulesFile: ".dependency-cruiser.json",
      ruleSet: {},
      config: true,
      validate: true,
    });
  });

  it("-c / --config with something gets translated to -v/ --validate.", async () => {
    process.chdir("test/cli/__fixtures__/normalize-config/json-only");
    deepStrictEqual(
      await normalizeCliOptions({ config: ".dependency-cruiser.json" }),
      {
        outputTo: "-",
        outputType: "err",
        rulesFile: ".dependency-cruiser.json",
        ruleSet: {},
        config: ".dependency-cruiser.json",
        validate: true,
      },
    );
  });

  it("-v argument assumes .dependency-cruiser.json for rules (and borks if it doesn't exist)", async () => {
    process.chdir("test/cli/__fixtures__/normalize-config/no-default-config");
    try {
      await normalizeCliOptions({ validate: true });
    } catch (pError) {
      strictEqual(pError.message.includes(".dependency-cruiser.(c)js"), true);
    }
  });

  it("-v finds .dependency-cruiser.js when no parameters to it are passed and it exists", async () => {
    process.chdir("test/cli/__fixtures__/normalize-config/js-only");
    deepStrictEqual(await normalizeCliOptions({ validate: true }), {
      outputTo: "-",
      outputType: "err",
      rulesFile: ".dependency-cruiser.js",
      ruleSet: {},
      validate: true,
    });
  });

  it("-v finds .dependency-cruiser.json when no parameters to it are passed and it exists", async () => {
    process.chdir("test/cli/__fixtures__/normalize-config/json-only");
    deepStrictEqual(await normalizeCliOptions({ validate: true }), {
      outputTo: "-",
      outputType: "err",
      rulesFile: ".dependency-cruiser.json",
      ruleSet: {},
      validate: true,
    });
  });

  it("-v finds .dependency-cruiser.json when no parameters to it are passed and also the .js variant exists", async () => {
    process.chdir("test/cli/__fixtures__/normalize-config/both-js-and-json");
    deepStrictEqual(await normalizeCliOptions({ validate: true }), {
      outputTo: "-",
      outputType: "err",
      rulesFile: ".dependency-cruiser.json",
      ruleSet: {},
      validate: true,
    });
  });

  it("-v with parameter borks when that parameter doesn't exist as a rules file", async () => {
    try {
      await normalizeCliOptions({
        validate: "./non-existing-config-file-name",
      });
    } catch (pError) {
      strictEqual(
        pError.message.includes("non-existing-config-file-name"),
        true,
      );
    }
  });

  it("-v with parameter uses that parameter as rules file", async () => {
    deepStrictEqual(
      await normalizeCliOptions({
        validate: "./test/cli/__fixtures__/rules.empty.json",
      }),
      {
        outputTo: "-",
        outputType: "err",
        rulesFile: "./test/cli/__fixtures__/rules.empty.json",
        ruleSet: {},
        validate: true,
      },
    );
  });

  it("a rules file with comments gets the comments stripped out & parsed", async () => {
    deepStrictEqual(
      await normalizeCliOptions({
        validate: "./test/cli/__fixtures__/rules.withcomments.json",
      }),
      {
        outputTo: "-",
        outputType: "err",
        rulesFile: "./test/cli/__fixtures__/rules.withcomments.json",
        ruleSet: {
          forbidden: [
            {
              name: "sub-not-allowed",
              severity: "warn",
              from: {},
              to: {
                path: "sub",
              },
            },
          ],
        },
        validate: true,
      },
    );
  });

  it("accepts and interprets a javascript rule file (relative path)", async () => {
    deepStrictEqual(
      await normalizeCliOptions({
        validate: "./test/cli/__fixtures__/rules.withcomments.js",
      }),
      {
        outputTo: "-",
        outputType: "err",
        rulesFile: "./test/cli/__fixtures__/rules.withcomments.js",
        ruleSet: {
          forbidden: [
            {
              name: "sub-not-allowed",
              severity: "warn",
              from: {},
              to: {
                path: "sub",
              },
            },
          ],
        },
        validate: true,
      },
    );
  });

  it("accepts and interprets a javascript rule file (absolute path)", async () => {
    const lRulesFileName = fileURLToPath(
      new URL("__fixtures__/rules.withcomments.js", import.meta.url),
    );

    deepStrictEqual(await normalizeCliOptions({ validate: lRulesFileName }), {
      outputTo: "-",
      outputType: "err",
      rulesFile: lRulesFileName,
      ruleSet: {
        forbidden: [
          {
            name: "sub-not-allowed",
            severity: "warn",
            from: {},
            to: {
              path: "sub",
            },
          },
        ],
      },
      validate: true,
    });
  });

  it("defaults tsConfig.fileName to 'tsconfig.json' if it wasn't specified", async () => {
    deepStrictEqual(
      await normalizeCliOptions({
        validate: "./test/cli/__fixtures__/rules.tsConfigNoFileName.json",
      }),
      {
        outputTo: "-",
        outputType: "err",
        rulesFile: "./test/cli/__fixtures__/rules.tsConfigNoFileName.json",
        ruleSet: {
          options: {
            tsConfig: {
              fileName: "tsconfig.json",
            },
          },
        },
        validate: true,
      },
    );
  });

  it("defaults webpackConfig.fileName to 'tsconfig.json' if it wasn't specified", async () => {
    deepStrictEqual(
      await normalizeCliOptions({
        validate: "./test/cli/__fixtures__/rules.webpackConfigNoFileName.json",
      }),
      {
        outputTo: "-",
        outputType: "err",
        rulesFile: "./test/cli/__fixtures__/rules.webpackConfigNoFileName.json",
        ruleSet: {
          options: {
            webpackConfig: {
              fileName: "webpack.config.js",
            },
          },
        },
        validate: true,
      },
    );
  });

  it("progress without parameter defaults to cli-feedback", async () => {
    const lResult = await normalizeCliOptions({ progress: true });
    strictEqual(lResult.progress, "cli-feedback");
  });

  it("progress with parameter none ends up as progress: none", async () => {
    const lResult = await normalizeCliOptions({ progress: "none" });
    strictEqual(lResult.progress, "none");
  });

  it("cache with value true translates to {}", async () => {
    const lResult = await normalizeCliOptions({ cache: true });
    deepStrictEqual(lResult.cache, {});
  });

  it("cache with a string value translates to the folder name in the cache option", async () => {
    const lResult = await normalizeCliOptions({ cache: "some-string" });
    deepStrictEqual(lResult.cache, { folder: "some-string" });
  });

  it("cache with an numerical value (which is invalid) translates to explicitly false cache option", async () => {
    const lResult = await normalizeCliOptions({ cache: 481 });
    strictEqual(lResult.cache, false);
  });

  it("cache with value false translates explicitly false cache option", async () => {
    const lResult = await normalizeCliOptions({ cache: false });
    strictEqual(lResult.cache, false);
  });

  it("no cache option translates to still not having a cache option", async () => {
    const lResult = await normalizeCliOptions({ "not-a-cache-option": true });
    strictEqual(lResult.hasOwnProperty("cache"), false);
  });

  it("cache-strategy with a string value == 'content' translates to the strategy 'content' in the cache option", async () => {
    const lResult = await normalizeCliOptions({ cacheStrategy: "content" });
    deepStrictEqual(lResult.cache, { strategy: "content" });
  });

  it("cache-strategy with a string value !== 'content' translates to the strategy 'metadata' in the cache option", async () => {
    const lResult = await normalizeCliOptions({ cacheStrategy: "some-string" });
    deepStrictEqual(lResult.cache, { strategy: "metadata" });
  });

  it("cache with a string value & cache-strategy with a string value translates both present in the cache option", async () => {
    const lResult = await normalizeCliOptions({
      cache: "somewhere",
      cacheStrategy: "some-string",
    });
    deepStrictEqual(lResult.cache, {
      folder: "somewhere",
      strategy: "metadata",
    });
  });

  it("cache with a value of true & cache-strategy with a string value translates to a cache option with that strategy", async () => {
    const lResult = await normalizeCliOptions({
      cache: true,
      cacheStrategy: "metadata",
    });
    deepStrictEqual(lResult.cache, { strategy: "metadata" });
  });

  it("cache with a value of false & cache-strategy with a string value translates to a cache option with that strategy", async () => {
    const lResult = await normalizeCliOptions({
      cache: false,
      cacheStrategy: "metadata",
    });
    deepStrictEqual(lResult.cache, { strategy: "metadata" });
  });

  it("cache with a value of true & cache-strategy with a string value translates to a cache option with that strategy x", async () => {
    const lResult = await normalizeCliOptions({
      cache: true,
      cacheStrategy: "content",
    });
    deepStrictEqual(lResult.cache, { strategy: "content" });
  });
});

describe("[I] cli/normalizeCliOptions - known violations", () => {
  const WORKING_DIR = process.cwd();

  afterEach(() => {
    process.chdir(WORKING_DIR);
  });

  it("--ignore-known without params gets the default known-violations json", async () => {
    process.chdir("test/cli/__fixtures__/normalize-config/known-violations");
    deepStrictEqual(await normalizeCliOptions({ ignoreKnown: true }), {
      outputTo: "-",
      outputType: "err",
      knownViolationsFile: ".dependency-cruiser-known-violations.json",
      ignoreKnown: true,
      validate: false,
    });
  });

  it("--ignore-known with params gets the mentioned known-violations", async () => {
    process.chdir("test/cli/__fixtures__/normalize-config/known-violations");
    deepStrictEqual(
      await normalizeCliOptions({
        ignoreKnown: "custom-known-violations.json",
      }),
      {
        outputTo: "-",
        outputType: "err",
        knownViolationsFile: "custom-known-violations.json",
        ignoreKnown: "custom-known-violations.json",
        validate: false,
      },
    );
  });

  it("--ignore-known with non-existing file as param throws", async () => {
    process.chdir("test/cli/__fixtures__/normalize-config/known-violations");
    let lError = "none";

    try {
      await normalizeCliOptions({
        ignoreKnown: "this-file-does-not-exist",
      });
    } catch (pError) {
      lError = pError.toString();
    }
    strictEqual(
      lError.includes(
        `Can't open 'this-file-does-not-exist' for reading. Does it exist?`,
      ),
      true,
    );
  });
});

describe("[U] cli/determineRulesFileName", () => {
  it("returns '.dependency-cruiser.json' when no file name is passed", () => {
    strictEqual(determineRulesFileName(), ".dependency-cruiser.json");
  });

  it("returns '.dependency-cruiser.json' when a non-string is passed", () => {
    strictEqual(determineRulesFileName(true), ".dependency-cruiser.json");
  });

  it("returns string passed when a string is passed", () => {
    strictEqual(determineRulesFileName("a string"), "a string");
  });
});
