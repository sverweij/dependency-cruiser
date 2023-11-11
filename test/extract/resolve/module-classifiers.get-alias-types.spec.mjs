import { deepEqual } from "node:assert/strict";
import { getAliasTypes } from "#extract/resolve/module-classifiers.mjs";

describe("[I] extract/resolve/module-classifiers - getAliasTypes", () => {
  it("returns an empty array for non-aliased modules", () => {
    const lManifest = {
      name: "test",
      version: "1.0.0",
      dependencies: {},
    };
    const lResolveOptions = {
      baseDirectory: "over/the/rainbow",
      alias: {
        "@": "./src",
      },
    };
    deepEqual(getAliasTypes("fs", "fs", lResolveOptions, lManifest), []);
  });

  it("returns aliased and aliased-subpath-import for subpath imports", () => {
    const lManifest = {
      name: "test",
      version: "1.0.0",
      dependencies: {},
      imports: {
        "#*": "./src/*",
      },
    };
    const lResolveOptions = {
      baseDirectory: "over/the/rainbow",
      alias: {
        "@": "./src",
      },
    };
    deepEqual(
      getAliasTypes(
        "#some/thing.js",
        "src/some/thing.js",
        lResolveOptions,
        lManifest,
      ),
      ["aliased", "aliased-subpath-import"],
    );
  });

  it("doesn't run aliased and aliased-subpath-import when a thing starts with #, but it isn't in the imports", () => {
    const lManifest = {
      name: "test",
      version: "1.0.0",
      dependencies: {},
      imports: {
        "#different/things": "./lib/*",
      },
    };
    const lResolveOptions = {
      baseDirectory: "over/the/rainbow",
      alias: {
        "@": "./src",
      },
    };
    deepEqual(
      getAliasTypes(
        "#some/thing.js",
        "src/some/thing.js",
        lResolveOptions,
        lManifest,
      ),
      [],
    );
  });
  it("doesn't run aliased and aliased-subpath-import when a thing starts with #, but there are no imports", () => {
    const lManifest = {
      name: "test",
      version: "1.0.0",
      dependencies: {},
    };
    const lResolveOptions = {
      baseDirectory: "over/the/rainbow",
      alias: {
        "@": "./src",
      },
    };
    deepEqual(
      getAliasTypes(
        "#some/thing.js",
        "src/some/thing.js",
        lResolveOptions,
        lManifest,
      ),
      [],
    );
  });

  it("returns aliased and aliased-webpack for webpack aliases", () => {
    const lManifest = {
      name: "test",
      version: "1.0.0",
      dependencies: {},
    };
    const lResolveOptions = {
      baseDirectory: "over/the/rainbow",
      alias: {
        "@": "./src",
      },
    };
    deepEqual(
      getAliasTypes(
        "@some/thing.js",
        "src/some/thing.js",
        lResolveOptions,
        lManifest,
      ),
      ["aliased", "aliased-webpack"],
    );
  });

  it("returns aliased and aliased-workspace for workspace alias (literals)", () => {
    const lManifest = {
      name: "test",
      version: "1.0.0",
      dependencies: {},
      workspaces: [
        "packages/b-package",
        "packages/a-package",
        "packages/c-package",
      ],
    };
    const lResolveOptions = {
      baseDirectory: "over/the/rainbow",
      alias: {
        "@": "./src",
      },
    };
    deepEqual(
      getAliasTypes(
        "some-workspaced-local-package",
        "packages/a-package/index.js",
        lResolveOptions,
        lManifest,
      ),
      ["aliased", "aliased-workspace"],
    );
  });

  it("returns aliased and aliased-workspace for workspace alias (globs)", () => {
    const lManifest = {
      name: "test",
      version: "1.0.0",
      dependencies: {},
      workspaces: ["packages/*"],
    };
    const lResolveOptions = {};
    deepEqual(
      getAliasTypes(
        "some-workspaced-local-package",
        "packages/a-package/index.js",
        lResolveOptions,
        lManifest,
      ),
      ["aliased", "aliased-workspace"],
    );
  });

  it("returns aliased and aliased-workspace for workspace alias (glob ending with /)", () => {
    const lManifest = {
      name: "test",
      version: "1.0.0",
      dependencies: {},
      workspaces: ["*/"],
    };
    const lResolveOptions = {};
    deepEqual(
      getAliasTypes(
        "some-workspaced-local-package",
        "packages/a-package/index.js",
        lResolveOptions,
        lManifest,
      ),
      ["aliased", "aliased-workspace"],
    );
  });

  it("returns aliased and aliased-workspace for workspace alias (convoluted glob)", () => {
    const lManifest = {
      name: "test",
      version: "1.0.0",
      dependencies: {},
      workspaces: ["*/?-package"],
    };
    const lResolveOptions = {};
    deepEqual(
      getAliasTypes(
        "some-workspaced-local-package",
        "packages/a-package/index.js",
        lResolveOptions,
        lManifest,
      ),
      ["aliased", "aliased-workspace"],
    );
  });

  it("should return aliased and aliased-tsconfig for tsconfig alias", () => {
    const lManifest = {
      name: "test",
      version: "1.0.0",
      dependencies: {},
    };
    const lResolveOptions = {
      tsConfig: "tsconfig.json",
    };
    deepEqual(
      getAliasTypes(
        "@tsconfig/package",
        "aap/noot/mies.js",
        lResolveOptions,
        lManifest,
      ),
      ["aliased", "aliased-tsconfig"],
    );
  });
});
