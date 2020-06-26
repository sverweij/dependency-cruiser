const path = require("path");
const expect = require("chai").expect;
const getResolveConfig = require("~/src/cli/get-resolve-config");

describe("cli/getResolveConfig", () => {
  it("throws whenno config file name is passed", () => {
    expect(() => getResolveConfig()).to.throw();
  });

  it("throws when a non-existing config file is passed", () => {
    expect(() => {
      getResolveConfig("config-does-not-exist");
    }).to.throw();
  });

  it("throws when a config file is passed that does not contain valid javascript", () => {
    expect(() => {
      getResolveConfig(
        path.join(__dirname, "./fixtures/webpackconfig/invalid.config.js")
      );
    }).to.throw();
  });

  it("returns an empty object when a config file is passed without a 'resolve' section", () => {
    expect(
      getResolveConfig(
        path.join(__dirname, "./fixtures/webpackconfig/noresolve.config.js")
      )
    ).to.deep.equal({});
  });

  it("returns the resolve section of the webpack config if there's any", () => {
    expect(
      getResolveConfig(
        path.join(__dirname, "./fixtures/webpackconfig/hasaresolve.config.js")
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
      getResolveConfig(
        path.join(
          __dirname,
          "./fixtures/webpackconfig/hastwoseparateresolves.config.js"
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
      getResolveConfig(
        path.join(
          __dirname,
          "./fixtures/webpackconfig/hastwoseparateresolves.config.js"
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
      getResolveConfig(
        path.join(
          __dirname,
          "./fixtures/webpackconfig/aliassy/webpack.functionexport.config.js"
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
      getResolveConfig(
        path.join(
          __dirname,
          "./fixtures/webpackconfig/aliassy/webpack.arrayexport.config.js"
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
      getResolveConfig(
        path.join(
          __dirname,
          "./fixtures/webpackconfig/aliassy/webpack.functionarrayexport.config.js"
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
