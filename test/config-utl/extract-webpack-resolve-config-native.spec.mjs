import { fileURLToPath } from "url";
import { expect } from "chai";
import loadResolveConfig from "../../src/config-utl/extract-webpack-resolve-config.mjs";

function getFullPath(pRelativePath) {
  return fileURLToPath(new URL(pRelativePath, import.meta.url));
}
describe("[I] config-utl/extract-webpack-resolve-config - native formats", () => {
  it("throws when no config file name is passed", () => {
    expect(() => loadResolveConfig()).to.throw();
  });

  it("throws when a non-existing config file is passed", () => {
    expect(() => {
      loadResolveConfig("config-does-not-exist");
    }).to.throw();
  });

  it("throws when a config file is passed that does not contain valid javascript", () => {
    expect(() => {
      loadResolveConfig(
        getFullPath("./__mocks__/webpackconfig/invalid.config.js")
      );
    }).to.throw();
  });

  it("returns an empty object when a config file is passed without a 'resolve' section", () => {
    expect(
      loadResolveConfig(
        getFullPath("./__mocks__/webpackconfig/noresolve.config.js")
      )
    ).to.deep.equal({});
  });

  it("returns the resolve section of the webpack config if there's any", () => {
    expect(
      loadResolveConfig(
        getFullPath("./__mocks__/webpackconfig/hasaresolve.config.js")
      )
    ).to.deep.equal({
      alias: {
        config: "src/config",
        magic$: "src/merlin/browserify/magic",
      },
    });
  });

  it("returns the production resolve section of the webpack config if that's an environment specific", () => {
    expect(
      loadResolveConfig(
        getFullPath(
          "./__mocks__/webpackconfig/hastwoseparateresolves.config.js"
        ),
        { production: true }
      )
    ).to.deep.equal({
      alias: {
        config: "src/config",
        magic$: "src/merlin/browserify/magic",
      },
    });
  });

  it("returns the 'other' resolve section of the webpack config if development environment is requested", () => {
    expect(
      loadResolveConfig(
        getFullPath(
          "./__mocks__/webpackconfig/hastwoseparateresolves.config.js"
        ),
        { develop: true }
      )
    ).to.deep.equal({
      alias: {
        config: "src/dev-config",
        magic$: "src/merlin/browserify/hipsterlib",
      },
    });
  });

  it("returns the resolve section of the function returning webpack config if there's any", () => {
    expect(
      loadResolveConfig(
        getFullPath(
          "./__mocks__/webpackconfig/aliassy/webpack.functionexport.config.js"
        )
      )
    ).to.deep.equal({
      alias: {
        configSpullenAlias: "./configspullen",
      },
      bustTheCache: true,
    });
  });

  it("returns the resolve section of the first element of the array returning webpack config if there's any", () => {
    expect(
      loadResolveConfig(
        getFullPath(
          "./__mocks__/webpackconfig/aliassy/webpack.arrayexport.config.js"
        )
      )
    ).to.deep.equal({
      alias: {
        configSpullenAlias: "./configspullen",
      },
      bustTheCache: true,
    });
  });

  it("returns the resolve section of the result of the first element of the array if that's a function", () => {
    expect(
      loadResolveConfig(
        getFullPath(
          "./__mocks__/webpackconfig/aliassy/webpack.functionarrayexport.config.js"
        )
      )
    ).to.deep.equal({
      alias: {
        configSpullenAlias: "./configspullen",
      },
      bustTheCache: true,
    });
  });
});
