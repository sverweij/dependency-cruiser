import { fileURLToPath } from "url";
import { expect } from "chai";
import normalizeCliOptions, {
  determineRulesFileName,
} from "../../src/cli/normalize-cli-options.mjs";

// eslint-disable-next-line max-statements
describe("[I] cli/normalizeCliOptions - regular normalizations", () => {
  const WORKINGDIR = process.cwd();

  afterEach(() => {
    process.chdir(WORKINGDIR);
  });

  it("normalizes empty options to no exclude, stdout, json and 'cjs, amd, es6'", () => {
    expect(normalizeCliOptions({})).to.deep.equal({
      outputTo: "-",
      outputType: "err",
      validate: false,
    });
  });

  it("normalizes --module-systems cjs,es6 to [cjs, es6]", () => {
    expect(normalizeCliOptions({ moduleSystems: "cjs,es6" })).to.deep.equal({
      outputTo: "-",
      outputType: "err",
      moduleSystems: ["cjs", "es6"],
      validate: false,
    });
  });

  it("trims module system strings", () => {
    expect(
      normalizeCliOptions({
        moduleSystems: " amd,cjs ,  es6 ",
      }).moduleSystems
    ).to.deep.equal(["amd", "cjs", "es6"]);
  });

  it("-c / --config without params gets translated to -v/ --validate.", () => {
    process.chdir("test/cli/__fixtures__/normalize-config/json-only");
    expect(normalizeCliOptions({ config: true })).to.deep.equal({
      outputTo: "-",
      outputType: "err",
      rulesFile: ".dependency-cruiser.json",
      ruleSet: {},
      config: true,
      validate: true,
    });
  });

  it("-c / --config with something gets translated to -v/ --validate.", () => {
    process.chdir("test/cli/__fixtures__/normalize-config/json-only");
    expect(
      normalizeCliOptions({ config: ".dependency-cruiser.json" })
    ).to.deep.equal({
      outputTo: "-",
      outputType: "err",
      rulesFile: ".dependency-cruiser.json",
      ruleSet: {},
      config: ".dependency-cruiser.json",
      validate: true,
    });
  });

  it("-v argument assumes .dependency-cruiser.json for rules (and borks if it doesn't exist)", () => {
    process.chdir("test/cli/__fixtures__/normalize-config/no-default-config");
    try {
      normalizeCliOptions({ validate: true });
    } catch (pError) {
      expect(pError.message).to.include(".dependency-cruiser.(c)js");
    }
  });

  it("-v finds .dependency-cruiser.js when no parameters to it are passed and it exists", () => {
    process.chdir("test/cli/__fixtures__/normalize-config/js-only");
    expect(normalizeCliOptions({ validate: true })).to.deep.equal({
      outputTo: "-",
      outputType: "err",
      rulesFile: ".dependency-cruiser.js",
      ruleSet: {},
      validate: true,
    });
  });

  it("-v finds .dependency-cruiser.json when no parameters to it are passed and it exists", () => {
    process.chdir("test/cli/__fixtures__/normalize-config/json-only");
    expect(normalizeCliOptions({ validate: true })).to.deep.equal({
      outputTo: "-",
      outputType: "err",
      rulesFile: ".dependency-cruiser.json",
      ruleSet: {},
      validate: true,
    });
  });

  it("-v finds .dependency-cruiser.json when no parameters to it are passed and also the .js variant exists", () => {
    process.chdir("test/cli/__fixtures__/normalize-config/both-js-and-json");
    expect(normalizeCliOptions({ validate: true })).to.deep.equal({
      outputTo: "-",
      outputType: "err",
      rulesFile: ".dependency-cruiser.json",
      ruleSet: {},
      validate: true,
    });
  });

  it("-v with parameter borks when that parameter doesn't exist as a rules file", () => {
    try {
      normalizeCliOptions({ validate: "./non-existing-config-file-name" });
    } catch (pError) {
      expect(pError.message).to.include("./non-existing-config-file-name");
    }
  });

  it("-v with parameter uses that parameter as rules file", () => {
    expect(
      normalizeCliOptions({
        validate: "./test/cli/__fixtures__/rules.empty.json",
      })
    ).to.deep.equal({
      outputTo: "-",
      outputType: "err",
      rulesFile: "./test/cli/__fixtures__/rules.empty.json",
      ruleSet: {},
      validate: true,
    });
  });

  it("a rules file with comments gets the comments stripped out & parsed", () => {
    expect(
      normalizeCliOptions({
        validate: "./test/cli/__fixtures__/rules.withcomments.json",
      })
    ).to.deep.equal({
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
    });
  });

  it("accepts and interprets a javascript rule file (relative path)", () => {
    expect(
      normalizeCliOptions({
        validate: "./test/cli/__fixtures__/rules.withcomments.js",
      })
    ).to.deep.equal({
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
    });
  });

  it("accepts and interprets a javascript rule file (absolute path)", () => {
    const lRulesFileName = fileURLToPath(
      new URL("__fixtures__/rules.withcomments.js", import.meta.url)
    );

    expect(normalizeCliOptions({ validate: lRulesFileName })).to.deep.equal({
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

  it("defaults tsConfig.fileName to 'tsconfig.json' if it wasn't specified", () => {
    expect(
      normalizeCliOptions({
        validate: "./test/cli/__fixtures__/rules.tsConfigNoFileName.json",
      })
    ).to.deep.equal({
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
    });
  });

  it("defaults webpackConfig.fileName to 'tsconfig.json' if it wasn't specified", () => {
    expect(
      normalizeCliOptions({
        validate: "./test/cli/__fixtures__/rules.webpackConfigNoFileName.json",
      })
    ).to.deep.equal({
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
    });
  });

  it("progress without parameter defaults to cli-feedback", () => {
    expect(normalizeCliOptions({ progress: true })).to.contain({
      progress: "cli-feedback",
    });
  });

  it("progress with parameter none ends up as progress: none", () => {
    expect(normalizeCliOptions({ progress: "performance-log" })).to.contain({
      progress: "performance-log",
    });
  });

  it("cache with value true translates to {}", () => {
    expect(normalizeCliOptions({ cache: true })).to.deep.contain({
      cache: {},
    });
  });

  it("cache with a string value translates to the folder name in the cache option", () => {
    expect(normalizeCliOptions({ cache: "some-string" })).to.deep.contain({
      cache: { folder: "some-string" },
    });
  });

  it("cache with an numerical value (which is invalid) translates to explicitly false cache option", () => {
    expect(normalizeCliOptions({ cache: 481 })).to.deep.contain({
      cache: false,
    });
  });

  it("cache with value true translates explicitly false cache option", () => {
    expect(normalizeCliOptions({ cache: false })).to.deep.contain({
      cache: false,
    });
  });

  it("no cache option translates to still not having a cache option", () => {
    expect(
      normalizeCliOptions({ "not-a-cache-option": true })
    ).to.not.haveOwnProperty("cache");
  });

  it("cache-strategy with a string value == 'content' translates to the strategy 'content' in the cache option", () => {
    expect(normalizeCliOptions({ cacheStrategy: "content" })).to.deep.contain({
      cache: { strategy: "content" },
    });
  });

  it("cache-strategy with a string value !== 'content' translates to the strategy 'metadata' in the cache option", () => {
    expect(
      normalizeCliOptions({ cacheStrategy: "some-string" })
    ).to.deep.contain({
      cache: { strategy: "metadata" },
    });
  });

  it("cache with a string value & cache-strategy with a string value translates both present in the cache option", () => {
    expect(
      normalizeCliOptions({ cache: "somewhere", cacheStrategy: "some-string" })
    ).to.deep.contain({
      cache: { folder: "somewhere", strategy: "metadata" },
    });
  });

  it("cache with a value of true & cache-strategy with a string value translates to a cache option with that strategy", () => {
    expect(
      normalizeCliOptions({ cache: true, cacheStrategy: "metadata" })
    ).to.deep.contain({
      cache: { strategy: "metadata" },
    });
  });

  it("cache with a value of false & cache-strategy with a string value translates to a cache option with that strategy", () => {
    expect(
      normalizeCliOptions({ cache: false, cacheStrategy: "metadata" })
    ).to.deep.contain({
      cache: { strategy: "metadata" },
    });
  });

  it("cache with a value of true & cache-strategy with a string value translates to a cache option with that strategy x", () => {
    expect(
      normalizeCliOptions({ cache: true, cacheStrategy: "content" })
    ).to.deep.contain({
      cache: { strategy: "content" },
    });
  });
});

describe("[I] cli/normalizeCliOptions - known violations", () => {
  const WORKING_DIR = process.cwd();

  afterEach(() => {
    process.chdir(WORKING_DIR);
  });

  it("--ignore-known without params gets the default known-violations json", () => {
    process.chdir("test/cli/__fixtures__/normalize-config/known-violations");
    expect(normalizeCliOptions({ ignoreKnown: true })).to.deep.equal({
      outputTo: "-",
      outputType: "err",
      knownViolationsFile: ".dependency-cruiser-known-violations.json",
      ignoreKnown: true,
      validate: false,
    });
  });

  it("--ignore-known with params gets the mentioned known-violations", () => {
    process.chdir("test/cli/__fixtures__/normalize-config/known-violations");
    expect(
      normalizeCliOptions({ ignoreKnown: "custom-known-violations.json" })
    ).to.deep.equal({
      outputTo: "-",
      outputType: "err",
      knownViolationsFile: "custom-known-violations.json",
      ignoreKnown: "custom-known-violations.json",
      validate: false,
    });
  });

  it("--ignore-known with non-existing file as param throws", () => {
    process.chdir("test/cli/__fixtures__/normalize-config/known-violations");
    expect(() =>
      normalizeCliOptions({ ignoreKnown: "this-file-does-not-exist" })
    ).to.throw();
  });
});

describe("[U] cli/determineRulesFileName", () => {
  it("returns '.dependency-cruiser.json' when no file name is passed", () => {
    expect(determineRulesFileName()).to.equal(".dependency-cruiser.json");
  });

  it("returns '.dependency-cruiser.json' when a non-string is passed", () => {
    expect(determineRulesFileName(true)).to.equal(".dependency-cruiser.json");
  });

  it("returns string passed when a string is passed", () => {
    expect(determineRulesFileName("a string")).to.equal("a string");
  });
});
