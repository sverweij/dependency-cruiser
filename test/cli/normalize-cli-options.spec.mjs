import { fileURLToPath } from "url";
import { expect } from "chai";
import normalizeCliOptions from "../../src/cli/normalize-cli-options.js";

// eslint-disable max-statements
describe("[I] cli/normalizeCliOptions", () => {
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
      expect(pError.message).to.include("'.dependency-cruiser.js(on)'");
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
});

describe("[I] cli/normalizeCliOptions - cache", () => {
  it("when cache is true it gets the value of the default cache folder", () => {
    expect(normalizeCliOptions({ cache: true })).to.contain({
      cache: "node_modules/.cache/dependency-cruiser",
    });
  });

  it("when cache is a string it's set as the value of the cache folder", () => {
    expect(normalizeCliOptions({ cache: "some/string" })).to.contain({
      cache: "some/string",
    });
  });
});

describe("[I] cli/normalizeCliOptions - known violations", () => {
  const WORKINGDIR = process.cwd();

  afterEach(() => {
    process.chdir(WORKINGDIR);
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

describe("[U] cli/normalizeCliOptions.determineRulesFileName", () => {
  it("returns '.dependency-cruiser.json' when no file name is passed", () => {
    expect(normalizeCliOptions.determineRulesFileName()).to.equal(
      ".dependency-cruiser.json"
    );
  });

  it("returns '.dependency-cruiser.json' when a non-string is passed", () => {
    expect(normalizeCliOptions.determineRulesFileName(true)).to.equal(
      ".dependency-cruiser.json"
    );
  });

  it("returns string passed when a string is passed", () => {
    expect(normalizeCliOptions.determineRulesFileName("a string")).to.equal(
      "a string"
    );
  });
});
