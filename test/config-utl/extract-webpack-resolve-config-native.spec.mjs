import { fileURLToPath } from "node:url";
import { deepStrictEqual, strictEqual } from "node:assert";

import loadResolveConfig from "../../src/config-utl/extract-webpack-resolve-config.mjs";

function getFullPath(pRelativePath) {
  return fileURLToPath(new URL(pRelativePath, import.meta.url));
}
describe("[I] config-utl/extract-webpack-resolve-config - native formats", () => {
  it("throws when no config file name is passed", async () => {
    let lThrown = false;
    try {
      await loadResolveConfig();
    } catch (_pError) {
      lThrown = true;
    }
    strictEqual(lThrown, true);
  });

  it("throws when a non-existing config file is passed", async () => {
    let lThrown = false;
    try {
      await loadResolveConfig("config-does-not-exist");
    } catch (_pError) {
      lThrown = true;
    }
    strictEqual(lThrown, true);
  });

  it("throws when a config file is passed that does not contain valid javascript", async () => {
    let lThrown = false;
    try {
      await loadResolveConfig(
        getFullPath("./__mocks__/webpackconfig/invalid.config.js"),
      );
    } catch (_pError) {
      lThrown = true;
    }
    strictEqual(lThrown, true);
  });

  it("returns an empty object when a config file is passed without a 'resolve' section", async () => {
    deepStrictEqual(
      await loadResolveConfig(
        getFullPath("./__mocks__/webpackconfig/noresolve.config.js"),
      ),
      {},
    );
  });

  it("returns the resolve section of the webpack config if there's any", async () => {
    deepStrictEqual(
      await loadResolveConfig(
        getFullPath("./__mocks__/webpackconfig/hasaresolve.config.js"),
      ),
      {
        alias: {
          config: "src/config",
          magic$: "src/merlin/browserify/magic",
        },
      },
    );
  });

  it("returns the resolve section of the webpack config if there's any (.mjs variant)", async () => {
    deepStrictEqual(
      await loadResolveConfig(
        getFullPath("./__mocks__/webpackconfig/webpack.config.mjs"),
      ),
      {
        alias: {
          config: "src/config",
          magic$: "src/merlin/browserify/magic",
        },
      },
    );
  });

  it("returns the production resolve section of the webpack config if that's an environment specific", async () => {
    deepStrictEqual(
      await loadResolveConfig(
        getFullPath(
          "./__mocks__/webpackconfig/hastwoseparateresolves.config.js",
        ),
        { production: true },
      ),
      {
        alias: {
          config: "src/config",
          magic$: "src/merlin/browserify/magic",
        },
      },
    );
  });

  it("returns the 'other' resolve section of the webpack config if development environment is requested", async () => {
    deepStrictEqual(
      await loadResolveConfig(
        getFullPath(
          "./__mocks__/webpackconfig/hastwoseparateresolves.config.js",
        ),
        { develop: true },
      ),
      {
        alias: {
          config: "src/dev-config",
          magic$: "src/merlin/browserify/hipsterlib",
        },
      },
    );
  });

  it("returns the resolve section of the function returning webpack config if there's any", async () => {
    deepStrictEqual(
      await loadResolveConfig(
        getFullPath(
          "./__mocks__/webpackconfig/aliassy/webpack.functionexport.config.js",
        ),
      ),
      {
        alias: {
          configSpullenAlias: "./configspullen",
        },
        bustTheCache: true,
      },
    );
  });

  it("returns the resolve section of the first element of the array returning webpack config if there's any", async () => {
    deepStrictEqual(
      await loadResolveConfig(
        getFullPath(
          "./__mocks__/webpackconfig/aliassy/webpack.arrayexport.config.js",
        ),
      ),
      {
        alias: {
          configSpullenAlias: "./configspullen",
        },
        bustTheCache: true,
      },
    );
  });

  it("returns the resolve section of the result of the first element of the array if that's a function", async () => {
    deepStrictEqual(
      await loadResolveConfig(
        getFullPath(
          "./__mocks__/webpackconfig/aliassy/webpack.functionarrayexport.config.js",
        ),
      ),
      {
        alias: {
          configSpullenAlias: "./configspullen",
        },
        bustTheCache: true,
      },
    );
  });
});
