const path             = require('path');
const expect           = require('chai').expect;
const getResolveConfig = require('../../src/cli/getResolveConfig');

describe("getResolveConfig", () => {
    it("throws whenno config file name is passed", () => {
        expect(() => getResolveConfig()).to.throw();
    });

    it("throws when a non-existing config file is passed", () => {
        expect((() => getResolveConfig("config-does-not-exist"))).to.throw();
    });

    it("throws when a config file is passed that does not contain valid javascript", () => {
        expect(
            () => getResolveConfig(path.join(__dirname, "./fixtures/webpackconfig/invalid.config.js"))
        ).to.throw();
    });

    it("returns an empty object when a config file is passed without a 'resolve' section", () => {
        expect(
            getResolveConfig(path.join(__dirname, "./fixtures/webpackconfig/noresolve.config.js"))
        ).to.deep.equal({});
    });

    it("returns the resolve section of the webpack config if there's any", () => {
        expect(
            getResolveConfig(path.join(__dirname, "./fixtures/webpackconfig/hasaresolve.config.js"))
        ).to.deep.equal({
            alias: {
                'config': "src/config",
                'magic$': "src/merlin/browserify/magic"
            }
        });
    });
});
