import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { expect } from "chai";
import determineDependencyTypes from "../../../src/extract/resolve/determine-dependency-types.mjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

describe("[U] extract/resolve/determineDependencyTypes - determine dependencyTypes", () => {
  it("sorts local dependencies into 'local'", () => {
    expect(
      determineDependencyTypes(
        {
          couldNotResolve: false,
          resolved: "src/bla/localthing",
        },
        "./localthing"
      )
    ).to.deep.equal(["local"]);
  });

  it("sorts core modules into 'core'", () => {
    expect(
      determineDependencyTypes(
        {
          couldNotResolve: false,
          resolved: "fs",
          coreModule: true,
        },
        "fs"
      )
    ).to.deep.equal(["core"]);
  });

  it("sorts unresolvable modules into 'unknown'", () => {
    expect(
      determineDependencyTypes(
        {
          couldNotResolve: true,
          resolved: "unresolvable-thing",
        },
        "unresolvable-thing"
      )
    ).to.deep.equal(["unknown"]);
  });

  it("sorts node_modules into 'npm-unknown' when no package dependencies were supplied", () => {
    expect(
      determineDependencyTypes(
        {
          couldNotResolve: false,
          resolved: "node_modules/cool-module/main/index/js",
        },
        "cool-module"
      )
    ).to.deep.equal(["npm-unknown"]);
  });

  it("sorts node_modules into 'npm-no-pkg' when they're not in the supplied package dependencies", () => {
    expect(
      determineDependencyTypes(
        {
          module: "cool-module",
          couldNotResolve: false,
          resolved: "node_modules/cool-module/main/index.js",
        },
        "cool-module",
        {}
      )
    ).to.deep.equal(["npm-no-pkg"]);
  });

  it("sorts node_modules into 'npm' when they're in the supplied package dependencies", () => {
    expect(
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
        }
      )
    ).to.deep.equal(["npm"]);
  });

  it("sorts node_modules into 'npm-dev' when they're in the supplied package devDependencies", () => {
    expect(
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
        }
      )
    ).to.deep.equal(["npm-dev"]);
  });

  it("sorts node_modules into 'npm-dev' when they're in the supplied package devDependencies with an @types scope", () => {
    expect(
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
        }
      )
    ).to.deep.equal(["npm-dev"]);
  });

  it("Only picks the 'npm' dependency-type when it's in the manifest as a regular dependency and a devDependencies @types dependency ", () => {
    expect(
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
        }
      )
    ).to.deep.equal(["npm"]);
  });

  it("sorts node_modules into 'npm-no-pkg' when they're in the supplied package devDependencies with an @types scope, but the resolve modules don't include 'node_modules/@types'", () => {
    expect(
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
        }
      )
    ).to.deep.equal(["npm-no-pkg"]);
  });

  it("sorts node_modules into 'npm' and 'npm-dev' when they're both the deps and the devDeps", () => {
    expect(
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
        }
      )
    ).to.deep.equal(["npm", "npm-dev"]);
  });

  it("only sorts up to the first / ", () => {
    expect(
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
        }
      )
    ).to.deep.equal(["npm"]);
  });

  it("sorts node_modules into 'npm-no-pkg' when they're in a weird *Dependencies in the package.json", () => {
    expect(
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
        }
      )
    ).to.deep.equal(["npm-no-pkg"]);
  });

  it("classifies aliased modules as aliased", () => {
    expect(
      determineDependencyTypes(
        {
          couldNotResolve: false,
          resolved: "src/wappie.js",
        },
        "@wappie",
        {},
        ".",
        {
          alias: {
            "@": "src",
          },
        }
      )
    ).to.deep.equal(["aliased"]);
  });

  it("has a fallback for weirdistan situations", () => {
    expect(
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
        }
      )
    ).to.deep.equal(["undetermined"]);
  });

  it("classifies local, non-node_modules modules as localmodule", () => {
    expect(
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
        }
      )
    ).to.deep.equal(["localmodule"]);
  });

  it("classifies local, non-node_modules modules with an absolute path as localmodule (posix & win32 paths)", () => {
    expect(
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
        resolve(__dirname, "socrates", "hemlock", "src", "bla")
      )
    ).to.deep.equal(["localmodule"]);
  });

  it("classifies local, non-node_modules non-modules as undetermined", () => {
    expect(
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
        }
      )
    ).to.deep.equal(["undetermined"]);
  });

  it("classifies a type only import as a type-only dependency", () => {
    expect(
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
        }
      )
    ).to.deep.equal(["local", "type-only"]);
  });
});
