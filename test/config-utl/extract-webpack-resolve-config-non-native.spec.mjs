import { join } from "path";
import { fileURLToPath } from "url";
import { expect } from "chai";
import loadResolveConfig from "../../src/config-utl/extract-webpack-resolve-config.mjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

describe("[I] config-utl/extract-webpack-resolve-config - non-native formats", () => {
  it("throws an error when the config is .mjs ", () => {
    expect(() =>
      loadResolveConfig(
        join(__dirname, "__mocks__", "webpackconfig", "webpack.config.mjs")
      )
    ).to.throw(
      /dependency-cruiser currently does not support webpack configurations/
    );
  });

  it("throws an error when interpret doesn't know a loader for it", () => {
    /* keeping the throw expectancy minimal as the throw is done by rechoir and may
       be susceptible to change
     */
    expect(() =>
      loadResolveConfig(
        join(
          __dirname,
          "__mocks__",
          "webpackconfig",
          "webpack.config.unknown-extension"
        )
      )
    ).to.throw();
  });

  it("throws an error with suggested modules when there's a known loader for the extension, but it isn't installed (livescript)", () => {
    expect(() =>
      loadResolveConfig(
        join(__dirname, "__mocks__", "webpackconfig", "webpack.config.ls")
      )
    ).to.throw(/No module loader found for ".ls"/m);
  });

  it("throws an error with suggested modules when there's a known loader for the extension, but it isn't installed (yaml)", () => {
    // yml is special as there's only one loader for it and 'interpret' then
    // doesn't put it in an array, but in a literal
    expect(() =>
      loadResolveConfig(
        join(__dirname, "__mocks__", "webpackconfig", "webpack.config.yml")
      )
    ).to.throw(/Unable to use specified module loader/m);
  });

  it("returns contents of the webpack config when the non-native extension _is_ registered", () => {
    expect(
      loadResolveConfig(
        join(__dirname, "__mocks__", "webpackconfig", "webpack.config.json5")
      )
    ).to.deep.equal({
      alias: {
        config: "src/config",
        magic$: "src/merlin/browserify/magic",
      },
    });
  });
});
