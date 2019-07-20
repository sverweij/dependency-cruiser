const expect = require("chai").expect;
const validateNodeEnv = require("../../src/cli/validateNodeEnv");

describe("cli/validateNodeEnv", () => {
  it("throws when an older and unsupported node version is passed", () => {
    expect(() => validateNodeEnv("6.0.0")).to.throw();
  });

  it("throws when a newer but unsupported node version is passed", () => {
    expect(() => validateNodeEnv("9.0.0")).to.throw();
  });

  it("doesn't throw when an empty node version is passed (assuming test is run on a supported platform)", () => {
    expect(() => validateNodeEnv("")).to.not.throw();
  });

  it("doesn't throw when a null node version is passed (assuming test is run on a supported platform)", () => {
    // eslint-disable-next-line no-undefined
    expect(() => validateNodeEnv(null)).to.not.throw();
  });

  it("doesn't throw when an undefined node version is passed (assuming test is run on a supported platform)", () => {
    // eslint-disable-next-line no-undefined
    expect(() => validateNodeEnv(undefined)).to.not.throw();
  });

  it("doesn't throw when no node version is passed (assuming this test is run on a supported platform ...)", () => {
    expect(() => validateNodeEnv()).to.not.throw();
  });

  it("doesn't throw when a supported node version is passed", () => {
    expect(() => validateNodeEnv("12.0.0")).to.not.throw();
  });
});
