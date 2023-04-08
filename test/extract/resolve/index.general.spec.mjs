import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect } from "chai";
import resolve from "../../../src/extract/resolve/index.mjs";
import normalizeResolveOptions from "../../../src/main/resolve-options/normalize.mjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const WORKING_DIRECTORY = process.cwd();

async function wrappedResolve(pModuleAttributes) {
  return resolve(
    pModuleAttributes,
    process.cwd(),
    process.cwd(),
    await normalizeResolveOptions(
      {
        bustTheCache: true,
      },
      {}
    )
  );
}

describe("[I] extract/resolve/index - general", () => {
  beforeEach("reset current wd", () => {
    process.chdir(WORKING_DIRECTORY);
  });

  afterEach("reset current wd", () => {
    process.chdir(WORKING_DIRECTORY);
  });

  it("resolves a local dependency to a file on disk", async () => {
    expect(
      resolve(
        {
          module: "./hots",
          moduleSystem: "es6",
        },
        join(__dirname, "__mocks__"),
        join(__dirname, "__mocks__", "resolve"),
        await normalizeResolveOptions({}, {})
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
        join(__dirname, "__mocks__"),
        join(__dirname, "__mocks__", "resolve"),
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
        join(__dirname, "__mocks__"),
        join(__dirname, "__mocks__", "followability"),
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

  it("resolves known non-followables as not followable: json", async () => {
    expect(
      resolve(
        {
          module: "./something.json",
          moduleSystem: "es6",
        },
        join(__dirname, "__mocks__"),
        join(__dirname, "__mocks__", "followability"),
        await normalizeResolveOptions({ bustTheCache: true }, {})
      )
    ).to.deep.equal({
      coreModule: false,
      couldNotResolve: false,
      dependencyTypes: ["local"],
      followable: false,
      resolved: "followability/something.json",
    });
  });

  it("resolves known non-followables as not followable, even when it's a resolve registered extension: json", async () => {
    expect(
      resolve(
        {
          module: "./something.json",
          moduleSystem: "es6",
        },
        join(__dirname, "__mocks__"),
        join(__dirname, "__mocks__", "followability"),
        await normalizeResolveOptions(
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

  it("resolves known non-followables as not followable, even when it's a resolve registered extension: sass", async () => {
    expect(
      resolve(
        {
          module: "./something.scss",
          moduleSystem: "es6",
        },
        join(__dirname, "__mocks__"),
        join(__dirname, "__mocks__", "followability"),
        await normalizeResolveOptions(
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

  it("considers passed (webpack) aliases", async () => {
    expect(
      resolve(
        {
          module: "hoepla/hoi",
          moduleSystem: "es6",
        },
        join(__dirname, "__mocks__"),
        join(__dirname, "__mocks__", "resolve"),
        await normalizeResolveOptions(
          {
            alias: {
              hoepla: join(__dirname, "__mocks__", "i-got-aliased-to-hoepla"),
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

  it("considers a passed (webpack) modules array", async () => {
    expect(
      resolve(
        {
          module: "shared",
          moduleSystem: "es6",
        },
        join(__dirname, "__mocks__"),
        join(__dirname, "__mocks__", "resolve"),
        await normalizeResolveOptions(
          {
            modules: [
              "node_modules",
              join(
                __dirname,
                "__mocks__",
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

  it("strips query parameters from file names", async () => {
    expect(
      resolve(
        {
          module: "./hots.js?blah",
          moduleSystem: "es6",
        },
        join(__dirname, "__mocks__"),
        join(__dirname, "__mocks__", "resolve"),
        await normalizeResolveOptions({}, {})
      )
    ).to.deep.equal({
      coreModule: false,
      couldNotResolve: false,
      dependencyTypes: ["local"],
      followable: true,
      resolved: "resolve/hots.js",
    });
  });

  it("by default does not look at 'exports' fields in package.json", async () => {
    process.chdir("test/extract/resolve/__mocks__/package-json-with-exports");
    expect(
      await wrappedResolve({
        module: "export-testinga/conditionalExports",
        moduleSystem: "cjs",
      })
    ).to.deep.equal({
      coreModule: false,
      couldNotResolve: true,
      dependencyTypes: ["unknown"],
      followable: false,
      resolved: "export-testinga/conditionalExports",
    });
  });

  it("looks at the 'exports' fields in package.json when enhanced-resolve is instructed to", async () => {
    process.chdir("test/extract/resolve/__mocks__/package-json-with-exports");
    expect(
      resolve(
        {
          module: "export-testinga/conditionalExports",
          moduleSystem: "cjs",
        },
        process.cwd(),
        process.cwd(),
        await normalizeResolveOptions(
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

  it("Correctly resolves file names with #'s in it (formerly an upstream issue in enhanced-resolve)", async () => {
    process.chdir("test/extract/resolve/__mocks__/resolve-hashmarks");
    expect(
      await wrappedResolve({
        module: "./#/hashmark.js",
        moduleSystem: "cjs",
      })
    ).to.deep.equal({
      coreModule: false,
      couldNotResolve: false,
      dependencyTypes: ["local"],
      followable: true,
      resolved: "#/hashmark.js",
    });
  });

  it("Correctly resolves file names that _correctly_ use #'s (in the 'URL' fashion) in it (formerly an upstream issue in enhanced-resolve)", async () => {
    process.chdir("test/extract/resolve/__mocks__/resolve-hashmarks");
    expect(
      await wrappedResolve({
        module: "./hashmark-after-this.js#this-is-extra",
        moduleSystem: "cjs",
      })
    ).to.deep.equal({
      coreModule: false,
      couldNotResolve: false,
      dependencyTypes: ["local"],
      // because the extion is '.js#this-is-extra' and not '.js'
      followable: false,
      resolved: "hashmark-after-this.js#this-is-extra",
    });
  });

  it("Passes mainFields correctly so it's possible to resolve type-only packages", async () => {
    process.chdir("test/extract/resolve/__mocks__/resolve-type-only-packages");
    expect(
      resolve(
        {
          module: "lalala-interfaces",
          moduleSystem: "es6",
        },
        process.cwd(),
        process.cwd(),
        await normalizeResolveOptions({
          bustTheCache: true,
          mainFields: ["main", "types"],
        })
      )
    ).to.deep.equal({
      coreModule: false,
      couldNotResolve: false,
      dependencyTypes: ["npm-no-pkg"],
      followable: true,
      resolved: "node_modules/lalala-interfaces/dist/interfaces/index.d.ts",
    });
  });
});
