import { fileURLToPath } from "node:url";
import { expect } from "chai";
import loadTSConfig from "../../src/config-utl/extract-ts-config.mjs";
import pathToPosix from "../../src/utl/path-to-posix.mjs";

function getFullPath(pRelativePath) {
  return fileURLToPath(new URL(pRelativePath, import.meta.url));
}
describe("[I] config-utl/extract-ts-config - flatten typescript config - simple config scenarios", () => {
  it("throws when no config file name is passed", () => {
    expect(() => {
      loadTSConfig();
    }).to.throw();
  });

  it("throws when a non-existing config file is passed", () => {
    expect(() => {
      loadTSConfig("config-does-not-exist");
    }).to.throw();
  });

  it("throws when a config file is passed that does not contain valid json", () => {
    expect(() => {
      loadTSConfig(
        getFullPath("./__mocks__/typescriptconfig/tsconfig.invalid.json")
      );
    }).to.throw();
  });

  it("returns an empty object when an empty config file is passed", () => {
    expect(
      loadTSConfig(
        getFullPath("./__mocks__/typescriptconfig/tsconfig.empty.json")
      ).options
    ).to.deep.equal({
      configFilePath: pathToPosix(
        getFullPath("./__mocks__/typescriptconfig/tsconfig.empty.json")
      ),
    });
  });

  it("returns an empty object when an empty config file with comments is passed", () => {
    expect(
      loadTSConfig(
        getFullPath("./__mocks__/typescriptconfig/tsconfig.withcomments.json")
      ).options
    ).to.deep.equal({
      configFilePath: pathToPosix(
        getFullPath("./__mocks__/typescriptconfig/tsconfig.withcomments.json")
      ),
    });
  });

  it("returns an object with a bunch of options when the default ('--init') config file is passed", () => {
    expect(
      loadTSConfig(
        getFullPath(
          "./__mocks__/typescriptconfig/tsconfig.asgeneratedbydefault.json"
        )
      ).options
    ).to.deep.equal({
      configFilePath: pathToPosix(
        getFullPath(
          "./__mocks__/typescriptconfig/tsconfig.asgeneratedbydefault.json"
        )
      ),
      esModuleInterop: true,
      module: 1,
      strict: true,
      target: 1,
    });
  });
});

describe("[I] config-utl/extract-ts-config - flatten typescript config - 'extend' config scenarios", () => {
  it("throws when a config file is passed that contains a extends to a non-existing file", () => {
    expect(() => {
      loadTSConfig(
        getFullPath(
          "./__mocks__/typescriptconfig/tsconfig.extendsnonexisting.json"
        )
      );
    }).to.throw();
  });

  it("throws when a config file is passed that has a circular reference", () => {
    expect(() => {
      loadTSConfig(
        getFullPath("./__mocks__/typescriptconfig/tsconfig.circular.json")
      );
    }).to.throw(
      "error TS18000: Circularity detected while resolving configuration"
    );
  });

  it("returns an empty object (even no 'extend') when a config with an extend to an empty base is passed", () => {
    expect(
      loadTSConfig(
        getFullPath("./__mocks__/typescriptconfig/tsconfig.simpleextends.json")
      ).options
    ).to.deep.equal({
      configFilePath: pathToPosix(
        getFullPath("./__mocks__/typescriptconfig/tsconfig.simpleextends.json")
      ),
    });
  });

  it("returns an object with properties from base, extends & overrides from extends - non-compilerOptions", () => {
    const lParseResult = loadTSConfig(
      getFullPath(
        "./__mocks__/typescriptconfig/tsconfig.noncompileroptionsextends.json"
      )
    );
    const lWildCardDirectories = {};

    lWildCardDirectories[
      // from TypeScript 4 the key name is lower case ¯\_(ツ)_/¯
      pathToPosix(
        getFullPath("./__mocks__/typescriptconfig/override from extends here")
      ).toLowerCase()
    ] = 1;

    /* eslint no-undefined:0 */
    expect(lParseResult).to.deep.equal({
      // only in the base
      // filesSpecs: ["./dummysrc.ts"],
      options: {
        configFilePath: pathToPosix(
          getFullPath(
            "__mocks__/typescriptconfig/tsconfig.noncompileroptionsextends.json"
          )
        ),
      },
      fileNames: [
        pathToPosix(getFullPath("__mocks__/typescriptconfig/dummysrc.ts")),
        // "/Users/sander/prg/js/dependency-cruiser/test/config-utl/__mocks__/typescriptconfig/dummysrc.ts",
      ],
      projectReferences: undefined,
      // validatedIncludeSpecs: ["override from extends here"],
      typeAcquisition: { enable: false, include: [], exclude: [] },
      raw: {
        extends: "./tsconfig.noncompileroptionsbase.json",
        exclude: ["only in the extends"],
        include: ["override from extends here"],
        compileOnSave: false,
        files: ["./dummysrc.ts"],
      },
      watchOptions: undefined,
      errors: [],
      wildcardDirectories: lWildCardDirectories,
      compileOnSave: false,
    });

    // from base:
    // this expect should be ok, but it isn't. For one
    // reason or other typescript's TSConfig parser overrides this again with false
    // even though it isn't specified in the file that extends it =>
    // I suspect a bug in typescripts' TSConfig parser ...
    // expect(lParseResult.compileOnSave).to.equal(true);
  });

  it("returns an object with properties from base, extends & overrides from extends - compilerOptions", () => {
    expect(
      loadTSConfig(
        getFullPath(
          "./__mocks__/typescriptconfig/tsconfig.compileroptionsextends.json"
        )
      ).options
    ).to.deep.equal({
      configFilePath: pathToPosix(
        getFullPath(
          "./__mocks__/typescriptconfig/tsconfig.compileroptionsextends.json"
        )
      ),
      // only in extends:
      allowJs: true,
      // overridden from base:
      allowUnreachableCode: false,
      // only in base:
      rootDirs: [
        pathToPosix(getFullPath("__mocks__/typescriptconfig/foo")),
        pathToPosix(getFullPath("__mocks__/typescriptconfig/bar")),
        pathToPosix(getFullPath("__mocks__/typescriptconfig/baz")),
      ],
    });
  });

  it("returns an object with properties from base, extends compilerOptions.lib array", () => {
    expect(
      loadTSConfig(
        getFullPath(
          "./__mocks__/typescriptconfig/tsconfig.compileroptionsextendslib.json"
        )
      ).options
    ).to.deep.equal({
      configFilePath: pathToPosix(
        getFullPath(
          "./__mocks__/typescriptconfig/tsconfig.compileroptionsextendslib.json"
        )
      ),
      lib: [
        // "dom.iterable",
        "lib.dom.iterable.d.ts",
        // I'd expected these from base as well as per the specification, but
        // apparently the typescript TSConfig parser chooses to override instead of extend ...
        // "es2016.array.include",
        // "dom"
      ],
    });
  });
});
