import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect } from "chai";
import loadResolveConfig from "../../src/config-utl/extract-webpack-resolve-config.mjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

describe("[I] config-utl/extract-webpack-resolve-config - non-native formats", () => {
  it("throws an error when interpret doesn't know a loader for it", async () => {
    /* keeping the throw expectancy minimal as the throw is done by rechoir and may
       be susceptible to change
     */
    let lThrown = false;
    try {
      await loadResolveConfig(
        join(
          __dirname,
          "__mocks__",
          "webpackconfig",
          "webpack.config.unknown-extension"
        )
      );
    } catch (_pError) {
      lThrown = true;
    }
    expect(lThrown).to.equal(true);
  });

  it("throws an error with suggested modules when there's a known loader for the extension, but it isn't installed (livescript)", async () => {
    let lThrownError = "none";
    try {
      await loadResolveConfig(
        join(__dirname, "__mocks__", "webpackconfig", "webpack.config.ls")
      );
    } catch (pError) {
      lThrownError = pError.toString();
    }
    expect(lThrownError).to.match(/No module loader found for ".ls"/m);
  });

  it("throws an error with suggested modules when there's a known loader for the extension, but it isn't installed (yaml)", async () => {
    // yml is special as there's only one loader for it and 'interpret' then
    // doesn't put it in an array, but in a literal

    let lThrownError = "none";
    try {
      await loadResolveConfig(
        join(__dirname, "__mocks__", "webpackconfig", "webpack.config.yml")
      );
    } catch (pError) {
      lThrownError = pError.toString();
    }
    expect(lThrownError).to.match(/Unable to use specified module loader/m);
  });

  it("returns contents of the webpack config when the non-native extension _is_ registered", async () => {
    expect(
      await loadResolveConfig(
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
