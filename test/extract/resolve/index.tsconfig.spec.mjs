import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { deepEqual } from "node:assert/strict";
import extractTSConfig from "#config-utl/extract-ts-config.mjs";
import normalizeResolveOptions from "#main/resolve-options/normalize.mjs";
import resolve from "#extract/resolve/index.mjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const TSCONFIG = join(
  __dirname,
  "__mocks__",
  "ts-config-with-path",
  "tsconfig.json",
);
const PARSED_TSCONFIG = extractTSConfig(TSCONFIG);
const TSCONFIG_RESOLUTIONS = join(
  __dirname,
  "__mocks__",
  "ts-config-with-path-correct-resolution-prio",
  "tsconfig.json",
);
const PARSED_TSCONFIG_RESOLUTIONS = extractTSConfig(TSCONFIG);

describe("[I] extract/resolve/index - typescript tsconfig processing", () => {
  it("considers a typescript config - non-* alias", async () => {
    deepEqual(
      resolve(
        {
          module: "shared",
          moduleSystem: "es6",
        },
        join(__dirname, "__mocks__"),
        join(__dirname, "__mocks__", "ts-config-with-path"),
        await normalizeResolveOptions(
          {
            tsConfig: TSCONFIG,
            bustTheCache: true,
          },
          {},
          PARSED_TSCONFIG,
        ),
      ),
      {
        coreModule: false,
        couldNotResolve: false,
        dependencyTypes: ["aliased", "aliased-tsconfig", "local"],
        followable: true,
        resolved: "ts-config-with-path/src/shared/index.ts",
      },
    );
  });

  it("considers a typescript config - combined/* alias", async () => {
    deepEqual(
      resolve(
        {
          module: "gewoon/wood/tree",
          moduleSystem: "es6",
        },
        join(__dirname, "__mocks__"),
        join(__dirname, "__mocks__", "ts-config-with-path"),
        await normalizeResolveOptions(
          {
            tsConfig: TSCONFIG,
            bustTheCache: true,
          },
          {},
          PARSED_TSCONFIG,
        ),
      ),
      {
        coreModule: false,
        couldNotResolve: false,
        dependencyTypes: ["aliased", "aliased-tsconfig", "local"],
        followable: true,
        resolved: "ts-config-with-path/src/common/wood/tree.ts",
      },
    );
  });

  it("considers a typescript config - * alias", async () => {
    deepEqual(
      resolve(
        {
          module: "daddayaddaya",
          moduleSystem: "es6",
        },
        join(__dirname, "__mocks__"),
        join(__dirname, "__mocks__", "ts-config-with-path"),
        await normalizeResolveOptions(
          {
            tsConfig: TSCONFIG,
            bustTheCache: true,
          },
          {},
          PARSED_TSCONFIG,
        ),
      ),
      {
        coreModule: false,
        couldNotResolve: false,
        dependencyTypes: ["aliased", "aliased-tsconfig", "local"],
        followable: true,
        resolved: "ts-config-with-path/src/typos/daddayaddaya.ts",
      },
    );
  });

  it("considers a typescript config - no paths, no aliases, resolves relative to baseUrl", async () => {
    const TSCONFIG_NO_PATHS = join(
      __dirname,
      "__mocks__",
      "ts-config-with-path",
      "tsconfig-no-paths.json",
    );
    const PARSED_TSCONFIG_NO_PATHS = extractTSConfig(TSCONFIG_NO_PATHS);
    deepEqual(
      resolve(
        {
          module: "common/wood/tree",
          moduleSystem: "es6",
        },
        join(__dirname, "__mocks__"),
        join(__dirname, "__mocks__", "ts-config-with-path", "src", "typos"),
        await normalizeResolveOptions(
          {
            tsConfig: TSCONFIG_NO_PATHS,
            bustTheCache: true,
          },
          {},
          PARSED_TSCONFIG_NO_PATHS,
        ),
      ),
      {
        coreModule: false,
        couldNotResolve: false,
        dependencyTypes: ["aliased", "aliased-tsconfig", "local"],
        followable: true,
        resolved: "ts-config-with-path/src/common/wood/tree.ts",
      },
    );
  });

  it("for aliases resolves in the same fashion as the typescript compiler - dts-vs-ts", async () => {
    deepEqual(
      resolve(
        {
          module: "things/dts-before-ts",
          moduleSystem: "es6",
        },
        join(__dirname, "__mocks__"),
        join(
          __dirname,
          "__mocks__",
          "ts-config-with-path-correct-resolution-prio",
        ),
        await normalizeResolveOptions(
          {
            tsConfig: TSCONFIG_RESOLUTIONS,
            bustTheCache: true,
          },
          {},
          PARSED_TSCONFIG_RESOLUTIONS,
        ),
      ),
      {
        coreModule: false,
        couldNotResolve: false,
        dependencyTypes: ["aliased", "aliased-tsconfig", "local"],
        followable: true,
        resolved:
          "ts-config-with-path-correct-resolution-prio/src/aliassed/dts-before-ts.ts",
      },
    );
  });

  it("for aliases resolves in the same fashion as the typescript compiler - js-vs-ts", async () => {
    deepEqual(
      resolve(
        {
          module: "things/js-before-ts",
          moduleSystem: "es6",
        },
        join(__dirname, "__mocks__"),
        join(
          __dirname,
          "__mocks__",
          "ts-config-with-path-correct-resolution-prio",
        ),
        await normalizeResolveOptions(
          {
            tsConfig: TSCONFIG_RESOLUTIONS,
            bustTheCache: true,
          },
          {},
          PARSED_TSCONFIG_RESOLUTIONS,
        ),
      ),
      {
        coreModule: false,
        couldNotResolve: false,
        dependencyTypes: ["aliased", "aliased-tsconfig", "local"],
        followable: true,
        resolved:
          "ts-config-with-path-correct-resolution-prio/src/aliassed/js-before-ts.js",
      },
    );
  });

  it("gives a different result for the same input without a webpack config", async () => {
    deepEqual(
      resolve(
        {
          module: "shared",
          moduleSystem: "es6",
        },
        join(__dirname, "__mocks__"),
        join(__dirname, "__mocks__", "ts-config-with-path"),
        await normalizeResolveOptions(
          {
            bustTheCache: true,
          },
          {},
        ),
      ),
      {
        coreModule: false,
        couldNotResolve: true,
        dependencyTypes: ["unknown"],
        followable: false,
        resolved: "shared",
      },
    );
  });
});
