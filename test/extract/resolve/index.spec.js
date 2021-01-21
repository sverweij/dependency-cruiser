/* eslint-disable max-statements */
const path = require("path");
const { expect } = require("chai");
const extractTSConfig = require("../../../src/config-utl/extract-ts-config");
const resolve = require("../../../src/extract/resolve");
const normalizeResolveOptions = require("../../../src/main/resolve-options/normalize");

const TSCONFIG = path.join(
  __dirname,
  "fixtures",
  "ts-config-with-path",
  "tsconfig.json"
);
const PARSED_TSCONFIG = extractTSConfig(TSCONFIG);
const TSCONFIG_RESOLUTIONS = path.join(
  __dirname,
  "fixtures",
  "ts-config-with-path-correct-resolution-prio",
  "tsconfig.json"
);
const PARSED_TSCONFIG_RESOLUTIONS = extractTSConfig(TSCONFIG);
const WORKING_DIRECTORY = process.cwd();

describe("extract/resolve/index", () => {
  beforeEach("reset current wd", () => {
    process.chdir(WORKING_DIRECTORY);
  });

  afterEach("reset current wd", () => {
    process.chdir(WORKING_DIRECTORY);
  });
  it("resolves a local dependency to a file on disk", () => {
    expect(
      resolve(
        {
          module: "./hots",
          moduleSystem: "es6",
        },
        path.join(__dirname, "fixtures"),
        path.join(__dirname, "fixtures", "resolve"),
        normalizeResolveOptions({}, {})
      )
    ).to.deep.equal({
      coreModule: false,
      couldNotResolve: false,
      dependencyTypes: ["local"],
      followable: true,
      resolved: "resolve/hots.js",
    });
  });

  it("resolves a core module as core module", () => {
    expect(
      resolve(
        {
          module: "path",
          moduleSystem: "es6",
        },
        path.join(__dirname, "fixtures"),
        path.join(__dirname, "fixtures", "resolve"),
        {}
      )
    ).to.deep.equal({
      coreModule: true,
      couldNotResolve: false,
      dependencyTypes: ["core"],
      followable: false,
      resolved: "path",
    });
  });

  it("resolves to the moduleName input (and depType 'unknown') when not resolvable on disk", () => {
    expect(
      resolve(
        {
          module: "./doesnotexist",
          moduleSystem: "es6",
        },
        path.join(__dirname, "fixtures"),
        path.join(__dirname, "fixtures", "followability"),
        {
          bustTheCache: true,
        }
      )
    ).to.deep.equal({
      coreModule: false,
      couldNotResolve: true,
      dependencyTypes: ["unknown"],
      followable: false,
      resolved: "./doesnotexist",
    });
  });

  it("resolves known non-followables as not followable: json", () => {
    expect(
      resolve(
        {
          module: "./something.json",
          moduleSystem: "es6",
        },
        path.join(__dirname, "fixtures"),
        path.join(__dirname, "fixtures", "followability"),
        normalizeResolveOptions({ bustTheCache: true }, {})
      )
    ).to.deep.equal({
      coreModule: false,
      couldNotResolve: false,
      dependencyTypes: ["local"],
      followable: false,
      resolved: "followability/something.json",
    });
  });

  it("resolves known non-followables as not followable, even when it's a resolve registered extension: json", () => {
    expect(
      resolve(
        {
          module: "./something.json",
          moduleSystem: "es6",
        },
        path.join(__dirname, "fixtures"),
        path.join(__dirname, "fixtures", "followability"),
        normalizeResolveOptions(
          {
            extensions: [".js", ".json"],
            bustTheCache: true,
          },
          {}
        )
      )
    ).to.deep.equal({
      coreModule: false,
      couldNotResolve: false,
      dependencyTypes: ["local"],
      followable: false,
      resolved: "followability/something.json",
    });
  });

  it("resolves known non-followables as not followable, even when it's a resolve registered extension: sass", () => {
    expect(
      resolve(
        {
          module: "./something.scss",
          moduleSystem: "es6",
        },
        path.join(__dirname, "fixtures"),
        path.join(__dirname, "fixtures", "followability"),
        normalizeResolveOptions(
          {
            extensions: [".js", ".json", ".scss"],
            bustTheCache: true,
          },
          {}
        )
      )
    ).to.deep.equal({
      coreModule: false,
      couldNotResolve: false,
      dependencyTypes: ["local"],
      followable: false,
      resolved: "followability/something.scss",
    });
  });

  it("resolves to ts before it considers vue", () => {
    expect(
      resolve(
        {
          module: "./x",
          moduleSystem: "es6",
        },
        path.join(__dirname, "fixtures"),
        path.join(__dirname, "fixtures", "vue-last"),
        normalizeResolveOptions(
          {
            bustTheCache: true,
          },
          {}
        )
      )
    ).to.deep.equal({
      coreModule: false,
      couldNotResolve: false,
      dependencyTypes: ["local"],
      followable: true,
      resolved: "vue-last/x.ts",
    });
  });

  it("considers passed (webpack) aliases", () => {
    expect(
      resolve(
        {
          module: "hoepla/hoi",
          moduleSystem: "es6",
        },
        path.join(__dirname, "fixtures"),
        path.join(__dirname, "fixtures", "resolve"),
        normalizeResolveOptions(
          {
            alias: {
              hoepla: path.join(
                __dirname,
                "fixtures",
                "i-got-aliased-to-hoepla"
              ),
            },
            bustTheCache: true,
          },
          {}
        )
      )
    ).to.deep.equal({
      coreModule: false,
      couldNotResolve: false,
      dependencyTypes: ["aliased"],
      followable: true,
      resolved: "i-got-aliased-to-hoepla/hoi/index.js",
    });
  });

  it("considers a passed (webpack) modules array", () => {
    expect(
      resolve(
        {
          module: "shared",
          moduleSystem: "es6",
        },
        path.join(__dirname, "fixtures"),
        path.join(__dirname, "fixtures", "resolve"),
        normalizeResolveOptions(
          {
            modules: [
              "node_modules",
              path.join(
                __dirname,
                "fixtures",
                "localmodulesfix",
                "localmoduleshere"
              ),
            ],
            bustTheCache: true,
          },
          {}
        )
      )
    ).to.deep.equal({
      coreModule: false,
      couldNotResolve: false,
      dependencyTypes: ["localmodule"],
      followable: true,
      resolved: "localmodulesfix/localmoduleshere/shared/index.js",
    });
  });

  it("considers a typescript config - non-* alias", () => {
    expect(
      resolve(
        {
          module: "shared",
          moduleSystem: "es6",
        },
        path.join(__dirname, "fixtures"),
        path.join(__dirname, "fixtures", "ts-config-with-path"),
        normalizeResolveOptions(
          {
            tsConfig: TSCONFIG,
            bustTheCache: true,
          },
          {},
          PARSED_TSCONFIG
        )
      )
    ).to.deep.equal({
      coreModule: false,
      couldNotResolve: false,
      dependencyTypes: ["aliased"],
      followable: true,
      resolved: "ts-config-with-path/src/shared/index.ts",
    });
  });

  it("considers a typescript config - combined/* alias", () => {
    expect(
      resolve(
        {
          module: "gewoon/wood/tree",
          moduleSystem: "es6",
        },
        path.join(__dirname, "fixtures"),
        path.join(__dirname, "fixtures", "ts-config-with-path"),
        normalizeResolveOptions(
          {
            tsConfig: TSCONFIG,
            bustTheCache: true,
          },
          {},
          PARSED_TSCONFIG
        )
      )
    ).to.deep.equal({
      coreModule: false,
      couldNotResolve: false,
      dependencyTypes: ["aliased"],
      followable: true,
      resolved: "ts-config-with-path/src/common/wood/tree.ts",
    });
  });

  it("considers a typescript config - * alias", () => {
    expect(
      resolve(
        {
          module: "daddayaddaya",
          moduleSystem: "es6",
        },
        path.join(__dirname, "fixtures"),
        path.join(__dirname, "fixtures", "ts-config-with-path"),
        normalizeResolveOptions(
          {
            tsConfig: TSCONFIG,
            bustTheCache: true,
          },
          {},
          PARSED_TSCONFIG
        )
      )
    ).to.deep.equal({
      coreModule: false,
      couldNotResolve: false,
      dependencyTypes: ["aliased"],
      followable: true,
      resolved: "ts-config-with-path/src/typos/daddayaddaya.ts",
    });
  });

  it("considers a typescript config - no paths, no aliases, resolves relative to baseUrl", () => {
    const TSCONFIG_NO_PATHS = path.join(
      __dirname,
      "fixtures",
      "ts-config-with-path",
      "tsconfig-no-paths.json"
    );
    const PARSED_TSCONFIG_NO_PATHS = extractTSConfig(TSCONFIG_NO_PATHS);
    expect(
      resolve(
        {
          module: "common/wood/tree",
          moduleSystem: "es6",
        },
        path.join(__dirname, "fixtures"),
        path.join(__dirname, "fixtures", "ts-config-with-path", "src", "typos"),
        normalizeResolveOptions(
          {
            tsConfig: TSCONFIG_NO_PATHS,
            bustTheCache: true,
          },
          {},
          PARSED_TSCONFIG_NO_PATHS
        )
      )
    ).to.deep.equal({
      coreModule: false,
      couldNotResolve: false,
      dependencyTypes: ["aliased"],
      followable: true,
      resolved: "ts-config-with-path/src/common/wood/tree.ts",
    });
  });

  it("for aliasses resolves in the same fashion as the typescript compiler - dts-vs-ts", () => {
    expect(
      resolve(
        {
          module: "things/dts-before-ts",
          moduleSystem: "es6",
        },
        path.join(__dirname, "fixtures"),
        path.join(
          __dirname,
          "fixtures",
          "ts-config-with-path-correct-resolution-prio"
        ),
        normalizeResolveOptions(
          {
            tsConfig: TSCONFIG_RESOLUTIONS,
            bustTheCache: true,
          },
          {},
          PARSED_TSCONFIG_RESOLUTIONS
        )
      )
    ).to.deep.equal({
      coreModule: false,
      couldNotResolve: false,
      dependencyTypes: ["aliased"],
      followable: true,
      resolved:
        "ts-config-with-path-correct-resolution-prio/src/aliassed/dts-before-ts.ts",
    });
  });

  it("for aliasses resolves in the same fashion as the typescript compiler - js-vs-ts", () => {
    expect(
      resolve(
        {
          module: "things/js-before-ts",
          moduleSystem: "es6",
        },
        path.join(__dirname, "fixtures"),
        path.join(
          __dirname,
          "fixtures",
          "ts-config-with-path-correct-resolution-prio"
        ),
        normalizeResolveOptions(
          {
            tsConfig: TSCONFIG_RESOLUTIONS,
            bustTheCache: true,
          },
          {},
          PARSED_TSCONFIG_RESOLUTIONS
        )
      )
    ).to.deep.equal({
      coreModule: false,
      couldNotResolve: false,
      dependencyTypes: ["aliased"],
      followable: true,
      resolved:
        "ts-config-with-path-correct-resolution-prio/src/aliassed/js-before-ts.js",
    });
  });

  it("gives a different result for the same input without a webpack config", () => {
    expect(
      resolve(
        {
          module: "shared",
          moduleSystem: "es6",
        },
        path.join(__dirname, "fixtures"),
        path.join(__dirname, "fixtures", "ts-config-with-path"),
        normalizeResolveOptions(
          {
            bustTheCache: true,
          },
          {}
        )
      )
    ).to.deep.equal({
      coreModule: false,
      couldNotResolve: true,
      dependencyTypes: ["unknown"],
      followable: false,
      resolved: "shared",
    });
  });

  it("strips query parameters from file names", () => {
    expect(
      resolve(
        {
          module: "./hots.js?blah",
          moduleSystem: "es6",
        },
        path.join(__dirname, "fixtures"),
        path.join(__dirname, "fixtures", "resolve"),
        normalizeResolveOptions({}, {})
      )
    ).to.deep.equal({
      coreModule: false,
      couldNotResolve: false,
      dependencyTypes: ["local"],
      followable: true,
      resolved: "resolve/hots.js",
    });
  });

  it("by default does not look at 'exports' fields in package.json", () => {
    process.chdir("test/extract/resolve/fixtures/package-json-with-exports");
    expect(
      resolve(
        {
          module: "export-testinga/conditionalExports",
          moduleSystem: "cjs",
        },
        process.cwd(),
        process.cwd(),
        normalizeResolveOptions({ bustTheCache: true }, {})
      )
    ).to.deep.equal({
      coreModule: false,
      couldNotResolve: true,
      dependencyTypes: ["unknown"],
      followable: false,
      resolved: "export-testinga/conditionalExports",
    });
  });

  it("looks at the 'exports' fields in package.json when enhanced-resolve is instructed to", () => {
    process.chdir("test/extract/resolve/fixtures/package-json-with-exports");
    expect(
      resolve(
        {
          module: "export-testinga/conditionalExports",
          moduleSystem: "cjs",
        },
        process.cwd(),
        process.cwd(),
        normalizeResolveOptions(
          {
            bustTheCache: true,
            exportsFields: ["exports"],
            conditionNames: ["require"],
          },
          {}
        )
      )
    ).to.deep.equal({
      coreModule: false,
      couldNotResolve: false,
      dependencyTypes: ["npm-no-pkg"],
      followable: true,
      resolved: "node_modules/export-testinga/feature.cjs",
    });
  });

  it("Resolves the .ts even when the import includes a (non-existing) .js with explicit extension", () => {
    process.chdir(
      "test/extract/resolve/fixtures/resolve-to-ts-even-when-imported-as-js"
    );
    expect(
      resolve(
        {
          module: "./i-am-secretly-typescript.js",
          moduleSystem: "es6",
        },
        process.cwd(),
        process.cwd(),
        normalizeResolveOptions(
          {
            bustTheCache: true,
          },
          {}
        )
      )
    ).to.deep.equal({
      coreModule: false,
      couldNotResolve: false,
      dependencyTypes: ["local"],
      followable: true,
      resolved: "i-am-secretly-typescript.ts",
    });
  });

  it("Does NOT resolve the .ts when the import includes a (non-existing) .cjs with explicit extension", () => {
    process.chdir(
      "test/extract/resolve/fixtures/resolve-to-ts-even-when-imported-as-js"
    );
    expect(
      resolve(
        {
          module: "./i-am-secretly-typescript.cjs",
          moduleSystem: "es6",
        },
        process.cwd(),
        process.cwd(),
        normalizeResolveOptions(
          {
            bustTheCache: true,
          },
          {}
        )
      )
    ).to.deep.equal({
      coreModule: false,
      couldNotResolve: true,
      dependencyTypes: ["unknown"],
      followable: false,
      resolved: "./i-am-secretly-typescript.cjs",
    });
  });

  it("Does NOT resolve to something non-typescriptish when the import includes a (non-existing) .js with explicit extension", () => {
    process.chdir("test/extract/resolve/fixtures/donot-resolve-to-non-ts");
    expect(
      resolve(
        {
          module: "./there-is-a-cjs-variant-of-me-but-you-will-not-find-it.js",
          moduleSystem: "es6",
        },
        process.cwd(),
        process.cwd(),
        normalizeResolveOptions(
          {
            bustTheCache: true,
          },
          {}
        )
      )
    ).to.deep.equal({
      coreModule: false,
      couldNotResolve: true,
      dependencyTypes: ["unknown"],
      followable: false,
      resolved: "./there-is-a-cjs-variant-of-me-but-you-will-not-find-it.js",
    });
  });
});
