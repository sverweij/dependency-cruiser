import { join } from "path";
import { fileURLToPath } from "url";
import { expect } from "chai";
import extractTSConfig from "../../../src/config-utl/extract-ts-config.js";
import resolve from "../../../src/extract/resolve/index.js";
import normalizeResolveOptions from "../../../src/main/resolve-options/normalize.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const TSCONFIG = join(
  __dirname,
  "__mocks__",
  "ts-config-with-path",
  "tsconfig.json"
);
const PARSED_TSCONFIG = extractTSConfig(TSCONFIG);
const TSCONFIG_RESOLUTIONS = join(
  __dirname,
  "__mocks__",
  "ts-config-with-path-correct-resolution-prio",
  "tsconfig.json"
);
const PARSED_TSCONFIG_RESOLUTIONS = extractTSConfig(TSCONFIG);

describe("[I] extract/resolve/index - typescript tsconfig processing", () => {
  it("considers a typescript config - non-* alias", () => {
    expect(
      resolve(
        {
          module: "shared",
          moduleSystem: "es6",
        },
        join(__dirname, "__mocks__"),
        join(__dirname, "__mocks__", "ts-config-with-path"),
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
        join(__dirname, "__mocks__"),
        join(__dirname, "__mocks__", "ts-config-with-path"),
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
        join(__dirname, "__mocks__"),
        join(__dirname, "__mocks__", "ts-config-with-path"),
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
    const TSCONFIG_NO_PATHS = join(
      __dirname,
      "__mocks__",
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
        join(__dirname, "__mocks__"),
        join(__dirname, "__mocks__", "ts-config-with-path", "src", "typos"),
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

  it("for aliases resolves in the same fashion as the typescript compiler - dts-vs-ts", () => {
    expect(
      resolve(
        {
          module: "things/dts-before-ts",
          moduleSystem: "es6",
        },
        join(__dirname, "__mocks__"),
        join(
          __dirname,
          "__mocks__",
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

  it("for aliases resolves in the same fashion as the typescript compiler - js-vs-ts", () => {
    expect(
      resolve(
        {
          module: "things/js-before-ts",
          moduleSystem: "es6",
        },
        join(__dirname, "__mocks__"),
        join(
          __dirname,
          "__mocks__",
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
        join(__dirname, "__mocks__"),
        join(__dirname, "__mocks__", "ts-config-with-path"),
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
});
