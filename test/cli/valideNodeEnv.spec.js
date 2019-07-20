const expect        = require("chai").expect;
const validateNodeEnv = require("../../src/cli/validateNodeEnv");

describe("cli/validateNodeEnv", () => {
    it("throws when no node version is passed", () => {
        expect(() => validateNodeEnv()).to.throw();
    });

    it("throws when an empty node version is passed", () => {
        expect(() => validateNodeEnv("")).to.throw();
    });

    it("doesn't throw when an older and unsupported node version is passed", () => {
        expect(() => validateNodeEnv("6.0.0")).to.throw();
    });

    it("doesn't throw when a newer but unsupported node version is passed", () => {
        expect(() => validateNodeEnv("9.0.0")).to.throw();
    });

    it("doesn't throw when a supported node version is passed", () => {
        expect(() => validateNodeEnv("12.0.0")).to.not.throw();
    });
});
