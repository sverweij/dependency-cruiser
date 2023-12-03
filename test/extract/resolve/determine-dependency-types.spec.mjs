/* eslint-disable max-statements */
import { deepEqual } from "node:assert/strict";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import determineDependencyTypes from "#extract/resolve/determine-dependency-types.mjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

describe("[U] extract/resolve/determineDependencyTypes - determine dependencyTypes", () => {
  it("sorts local dependencies into 'local'", () => {
    deepEqual(
      determineDependencyTypes(
        {
          couldNotResolve: false,
          resolved: "src/bla/localthing",
        },
        "./localthing",
      ),
      ["local"],
    );
  });

  it("sorts core modules into 'core'", () => {
    deepEqual(
      determineDependencyTypes(
        {
          couldNotResolve: false,
          resolved: "fs",
          coreModule: true,
        },
        "fs",
      ),
      ["core"],
    );
  });

  it("sorts unresolvable modules into 'unknown'", () => {
    deepEqual(
      determineDependencyTypes(
        {
          couldNotResolve: true,
          resolved: "unresolvable-thing",
        },
        "unresolvable-thing",
      ),
      ["unknown"],
    );
  });

  it("sorts node_modules into 'npm-unknown' when no package dependencies were supplied", () => {
    deepEqual(
      determineDependencyTypes(
        {
          couldNotResolve: false,
          resolved: "node_modules/cool-module/main/index/js",
        },
        "cool-module",
      ),
      ["npm-unknown"],
    );
  });

  it("sorts node_modules into 'npm-no-pkg' when they're not in the supplied package dependencies", () => {
    deepEqual(
      determineDependencyTypes(
        {
          module: "cool-module",
          couldNotResolve: false,
          resolved: "node_modules/cool-module/main/index.js",
        },
        "cool-module",
        {},
      ),
      ["npm-no-pkg"],
    );
  });

  it("sorts node_modules into 'npm' when they're in the supplied package dependencies", () => {
    deepEqual(
      determineDependencyTypes(
        {
          module: "cool-module",
          couldNotResolve: false,
          resolved: "node_modules/cool-module/main/index.js",
        },
        "cool-module",
        {
          dependencies: {
            "cool-module": "1.2.3",
          },
        },
      ),
      ["npm"],
    );
  });

  it("sorts node_modules into 'npm-dev' when they're in the supplied package devDependencies", () => {
    deepEqual(
      determineDependencyTypes(
        {
          couldNotResolve: false,
          resolved: "node_modules/cool-module/main/index.js",
        },
        "cool-module",
        {
          devDependencies: {
            "cool-module": "1.2.3",
          },
        },
      ),
      ["npm-dev"],
    );
  });

  it("sorts node_modules into 'npm-dev' when they're in the supplied package devDependencies with an @types scope", () => {
    deepEqual(
      determineDependencyTypes(
        {
          couldNotResolve: false,
          resolved: "node_modules/@types/my-totally-weird-types/index.d.ts",
        },
        "my-totally-weird-types",
        {
          devDependencies: {
            "@types/my-totally-weird-types": "1.2.3",
          },
        },
      ),
      ["npm-dev"],
    );
  });

  it("Only picks the 'npm' dependency-type when it's in the manifest as a regular dependency and a devDependencies @types dependency ", () => {
    deepEqual(
      determineDependencyTypes(
        {
          couldNotResolve: false,
          resolved: "node_modules/snodash/index.js",
        },
        "snodash",
        {
          dependencies: {
            snodash: "1.2.3",
          },
          devDependencies: {
            "@types/snodash": "1.2.3",
          },
        },
      ),
      ["npm"],
    );
  });

  it("sorts node_modules into 'npm-no-pkg' when they're in the supplied package devDependencies with an @types scope, but the resolve modules don't include 'node_modules/@types'", () => {
    deepEqual(
      determineDependencyTypes(
        {
          couldNotResolve: false,
          resolved: "node_modules/@types/my-totally-weird-types/index.d.ts",
        },
        "my-totally-weird-types",
        {
          devDependencies: {
            "@types/my-totally-weird-types": "1.2.3",
          },
        },
        "whatever",
        {
          modules: ["node_modules"],
        },
      ),
      ["npm-no-pkg"],
    );
  });

  it("sorts node_modules into 'npm' and 'npm-dev' when they're both the deps and the devDeps", () => {
    deepEqual(
      determineDependencyTypes(
        {
          couldNotResolve: false,
          resolved: "node_modules/cool-module/main/index.js",
        },
        "cool-module",
        {
          dependencies: {
            "cool-module": "1.2.3",
          },
          devDependencies: {
            "cool-module": "1.2.3",
          },
        },
      ),
      ["npm", "npm-dev"],
    );
  });

  it("only sorts up to the first / ", () => {
    deepEqual(
      determineDependencyTypes(
        {
          couldNotResolve: false,
          resolved: "node_modules/cool-module/wappie.js",
        },
        "cool-module/wappie",
        {
          dependencies: {
            "cool-module": "1.2.3",
          },
          devDependencies: {
            "cool-module/wappie": "1.2.3",
          },
        },
      ),
      ["npm"],
    );
  });

  it("sorts node_modules into 'npm-no-pkg' when they're in a weird *Dependencies in the package.json", () => {
    deepEqual(
      determineDependencyTypes(
        {
          couldNotResolve: false,
          resolved: "node_modules/cool-module/main/index.js",
        },
        "cool-module",
        {
          vagueDependencies: {
            "cool-module": "1.2.3",
          },
        },
      ),
      ["npm-no-pkg"],
    );
  });

  it("classifies fixed subpath imports as aliased & aliased-subpath-import", () => {
    deepEqual(
      determineDependencyTypes(
        {
          couldNotResolve: false,
          resolved: "src/i-was-aliased.js",
        },
        "#the-alias",
        {
          imports: {
            "#the-alias": "./src/i-was-aliased.js",
          },
        },
        ".",
        {
          modules: ["node_modules"],
        },
      ),
      ["aliased", "aliased-subpath-import", "local"],
    );
  });

  it("classifies wildcard subpath imports as aliased & aliased-subpath-import", () => {
    deepEqual(
      determineDependencyTypes(
        {
          couldNotResolve: false,
          resolved: "src/folder/source.mjs",
        },
        "#some/folder/source.mjs",
        {
          imports: {
            "#*": "./src/*",
          },
        },
        ".",
        {
          modules: ["node_modules"],
        },
      ),
      ["aliased", "aliased-subpath-import", "local"],
    );
  });

  it("classifies subpath imports that resolve to an external modules both as external module and as aliased", () => {
    deepEqual(
      determineDependencyTypes(
        {
          couldNotResolve: false,
          resolved: "node_modules/cool-module/main/index.js",
        },
        "#the-alias",
        {
          imports: {
            "#the-alias": "cool-module",
          },
        },
        ".",
        {
          modules: ["node_modules"],
        },
      ),
      ["aliased", "aliased-subpath-import", "npm-no-pkg"],
    );
  });

  it("classifies subpath imports that resolve to an builtin module both as core module and as aliased", () => {
    deepEqual(
      determineDependencyTypes(
        {
          couldNotResolve: false,
          resolved: "test",
          coreModule: true,
        },
        "#the-alias",
        {
          imports: {
            "#the-alias": "test",
          },
        },
        ".",
        {
          modules: ["node_modules"],
        },
      ),
      ["aliased", "aliased-subpath-import", "core"],
    );
  });

  it("does not classify modules starting with # that aren't subpath imports as aliased (but as 'undetermined')", () => {
    deepEqual(
      determineDependencyTypes(
        {
          couldNotResolve: false,
          resolved: "src/i-was-not-aliased.js",
        },
        "#not-the-alias",
        {
          imports: {
            "#the-alias": "src/i-was-aliased.js",
          },
        },
        ".",
        {
          modules: ["node_modules"],
        },
      ),
      ["undetermined"],
    );
  });

  it("classifies webpack aliased modules as aliased & aliased-webpack", () => {
    deepEqual(
      determineDependencyTypes(
        // dependency
        {
          couldNotResolve: false,
          resolved: "src/wappie.js",
        },
        // pModuleName
        "@wappie",
        // pManifest
        {},
        // pFileDirectory
        ".",
        // pResolveOptions
        {
          alias: {
            "@": "src",
          },
        },
        // pBaseDirectory
      ),
      ["aliased", "aliased-webpack", "local"],
    );
  });

  it("classifies likely TS aliased modules as aliased & aliased-tsconfig", () => {
    const lDependency = {
      couldNotResolve: false,
      resolved: "src/wappie.js",
    };
    const lModuleName = "@wappie";
    const lManifest = {};
    const lFileDirectory = ".";
    const lResolveOptions = {
      tsConfig: "tsconfig.json",
    };
    const lBaseDirectory = null;
    const lTranspileOptions = {
      tsConfig: {
        options: {
          paths: {
            "@wappie": ["src"],
          },
        },
      },
    };
    deepEqual(
      determineDependencyTypes(
        lDependency,
        lModuleName,
        lManifest,
        lFileDirectory,
        lResolveOptions,
        lBaseDirectory,
        lTranspileOptions,
      ),
      ["aliased", "aliased-tsconfig", "local"],
    );
  });

  it("has a fallback for weirdistan situations", () => {
    deepEqual(
      determineDependencyTypes(
        {
          couldNotResolve: false,
          resolved: "wappie.js",
        },
        "cool-module",
        {
          cerebralDependencies: {
            "cool-module": "1.2.3",
          },
        },
      ),
      ["undetermined"],
    );
  });

  it("classifies local, non-node_modules modules as localmodule", () => {
    deepEqual(
      determineDependencyTypes(
        {
          couldNotResolve: false,
          resolved: "src/bla/somethinglocal.ts",
        },
        "bla/somethinglocal",
        {},
        "whatever",
        {
          modules: ["node_modules", "src"],
        },
      ),
      ["localmodule"],
    );
  });

  it("classifies local, non-node_modules modules with an absolute path as localmodule (posix & win32 paths)", () => {
    deepEqual(
      determineDependencyTypes(
        {
          couldNotResolve: false,
          resolved: "src/bla/somethinglocal.ts",
        },
        "bla/somethinglocal",
        {},
        resolve(__dirname, "socrates", "hemlock", "src", "bla"),
        {
          modules: [
            "node_modules",
            resolve(__dirname, "socrates", "hemlock", "src"),
          ],
        },
        resolve(__dirname, "socrates", "hemlock", "src", "bla"),
      ),
      ["localmodule"],
    );
  });

  it("classifies local, non-node_modules non-modules as undetermined", () => {
    deepEqual(
      determineDependencyTypes(
        {
          couldNotResolve: false,
          resolved: "test/bla/localthing.spec.js",
        },
        "test/bla/localthing.spec",
        {},
        "whatever",
        {
          modules: ["node_modules", "src"],
        },
      ),
      ["undetermined"],
    );
  });

  it("classifies a type only import as a type-only dependency", () => {
    deepEqual(
      determineDependencyTypes(
        {
          dependencyTypes: ["type-only"],
          couldNotResolve: false,
          resolved: "src/bla/something-local",
        },
        "./something-local",
        {},
        "whatever",
        {
          modules: ["node_modules", "src"],
        },
      ),
      ["local", "type-only"],
    );
  });
});
