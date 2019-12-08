const path = require("path");
const expect = require("chai").expect;
const parseTSConfig = require("../../../src/cli/parseTSConfig");
const resolve = require("../../../src/extract/resolve");
const normalizeResolveOptions = require("../../../src/main/resolveOptions/normalize");

const TSCONFIG = path.join(
  __dirname,
  "fixtures",
  "ts-config-with-path",
  "tsconfig.json"
);
const PARSED_TSCONFIG = parseTSConfig(TSCONFIG);

describe("extract/resolve/index", () => {
  it("resolves a local dependency to a file on disk", () => {
    expect(
      resolve(
        {
          module: "./hots",
          moduleSystem: "es6"
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
      resolved: "resolve/hots.js"
    });
  });

  it("resolves a core module as core module", () => {
    expect(
      resolve(
        {
          module: "path",
          moduleSystem: "es6"
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
      resolved: "path"
    });
  });

  it("resolves to the moduleName input (and depType 'unknown') when not resolvable on disk", () => {
    expect(
      resolve(
        {
          module: "./doesnotexist",
          moduleSystem: "es6"
        },
        path.join(__dirname, "fixtures"),
        path.join(__dirname, "fixtures", "followability"),
        {
          bustTheCache: true
        }
      )
    ).to.deep.equal({
      coreModule: false,
      couldNotResolve: true,
      dependencyTypes: ["unknown"],
      followable: false,
      resolved: "./doesnotexist"
    });
  });

  it("resolves known non-followables as not followable: json", () => {
    expect(
      resolve(
        {
          module: "./something.json",
          moduleSystem: "es6"
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
      resolved: "followability/something.json"
    });
  });

  it("resolves known non-followables as not followable, even when it's a resolve registered extension: json", () => {
    expect(
      resolve(
        {
          module: "./something.json",
          moduleSystem: "es6"
        },
        path.join(__dirname, "fixtures"),
        path.join(__dirname, "fixtures", "followability"),
        normalizeResolveOptions(
          {
            extensions: [".js", ".json"],
            bustTheCache: true
          },
          {}
        )
      )
    ).to.deep.equal({
      coreModule: false,
      couldNotResolve: false,
      dependencyTypes: ["local"],
      followable: false,
      resolved: "followability/something.json"
    });
  });

  it("resolves known non-followables as not followable, even when it's a resolve registered extension: sass", () => {
    expect(
      resolve(
        {
          module: "./something.scss",
          moduleSystem: "es6"
        },
        path.join(__dirname, "fixtures"),
        path.join(__dirname, "fixtures", "followability"),
        normalizeResolveOptions(
          {
            extensions: [".js", ".json", ".scss"],
            bustTheCache: true
          },
          {}
        )
      )
    ).to.deep.equal({
      coreModule: false,
      couldNotResolve: false,
      dependencyTypes: ["local"],
      followable: false,
      resolved: "followability/something.scss"
    });
  });

  it("considers passed (webpack) aliases", () => {
    expect(
      resolve(
        {
          module: "hoepla/hoi",
          moduleSystem: "es6"
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
              )
            },
            bustTheCache: true
          },
          {}
        )
      )
    ).to.deep.equal({
      coreModule: false,
      couldNotResolve: false,
      dependencyTypes: ["aliased"],
      followable: true,
      resolved: "i-got-aliased-to-hoepla/hoi/index.js"
    });
  });

  it("considers a passed (webpack) modules array", () => {
    expect(
      resolve(
        {
          module: "shared",
          moduleSystem: "es6"
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
              )
            ],
            bustTheCache: true
          },
          {}
        )
      )
    ).to.deep.equal({
      coreModule: false,
      couldNotResolve: false,
      dependencyTypes: ["localmodule"],
      followable: true,
      resolved: "localmodulesfix/localmoduleshere/shared/index.js"
    });
  });

  it("considers a typescript config - non-* alias", () => {
    expect(
      resolve(
        {
          module: "shared",
          moduleSystem: "es6"
        },
        path.join(__dirname, "fixtures"),
        path.join(__dirname, "fixtures", "ts-config-with-path"),
        normalizeResolveOptions(
          {
            tsConfig: TSCONFIG,
            bustTheCache: true
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
      resolved: "ts-config-with-path/src/shared/index.ts"
    });
  });

  it("considers a typescript config - combined/* alias", () => {
    expect(
      resolve(
        {
          module: "gewoon/wood/tree",
          moduleSystem: "es6"
        },
        path.join(__dirname, "fixtures"),
        path.join(__dirname, "fixtures", "ts-config-with-path"),
        normalizeResolveOptions(
          {
            tsConfig: TSCONFIG,
            bustTheCache: true
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
      resolved: "ts-config-with-path/src/common/wood/tree.ts"
    });
  });

  it("considers a typescript config - * alias", () => {
    expect(
      resolve(
        {
          module: "daddayaddaya",
          moduleSystem: "es6"
        },
        path.join(__dirname, "fixtures"),
        path.join(__dirname, "fixtures", "ts-config-with-path"),
        normalizeResolveOptions(
          {
            tsConfig: TSCONFIG,
            bustTheCache: true
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
      resolved: "ts-config-with-path/src/typos/daddayaddaya.ts"
    });
  });

  it("gives a different result for the same input without a webpack config", () => {
    expect(
      resolve(
        {
          module: "shared",
          moduleSystem: "es6"
        },
        path.join(__dirname, "fixtures"),
        path.join(__dirname, "fixtures", "ts-config-with-path"),
        normalizeResolveOptions(
          {
            bustTheCache: true
          },
          {}
        )
      )
    ).to.deep.equal({
      coreModule: false,
      couldNotResolve: true,
      dependencyTypes: ["unknown"],
      followable: false,
      resolved: "shared"
    });
  });

  it("strips query parameters from file names", () => {
    expect(
      resolve(
        {
          module: "./hots.js?blah",
          moduleSystem: "es6"
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
      resolved: "resolve/hots.js"
    });
  });
});
