const path = require("path");
const expect = require("chai").expect;
const readConfig = require("../../../src/config-utl/extract-depcruise-config/read-config");

describe("config-utl/extract-depcruise-config/read-config", () => {
  it("requires when it encounters .js", () => {
    const lConfig = readConfig(
      path.join(__dirname, "mocks", "read-config", "dc.js")
    );
    expect(lConfig).to.deep.equal({});
  });
  it("requires when it encounters .cjs", () => {
    const lConfig = readConfig(
      path.join(__dirname, "mocks", "read-config", "dc.cjs")
    );
    expect(lConfig).to.deep.equal({});
  });
  it("json5 parse when it encounters .json", () => {
    const lConfig = readConfig(
      path.join(__dirname, "mocks", "read-config", "dc.json")
    );
    expect(lConfig).to.deep.equal({});
  });
  it("json5 parse when it encounters something alien", () => {
    const lConfig = readConfig(
      path.join(__dirname, "mocks", "read-config", "dc.alien")
    );
    expect(lConfig).to.deep.equal({});
  });
});
