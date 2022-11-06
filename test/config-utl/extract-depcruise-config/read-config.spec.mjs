import { fileURLToPath } from "url";
import { expect } from "chai";
import readConfig from "../../../src/config-utl/extract-depcruise-config/read-config.js";

function getFullPath(pRelativePath) {
  return fileURLToPath(new URL(pRelativePath, import.meta.url));
}

describe("[U] config-utl/extract-depcruise-config/read-config", () => {
  it("requires when it encounters .js", () => {
    const lConfig = readConfig(getFullPath("__mocks__/read-config/dc.js"));
    expect(lConfig).to.deep.equal({});
  });
  it("requires when it encounters .cjs", () => {
    const lConfig = readConfig(getFullPath("__mocks__/read-config/dc.cjs"));
    expect(lConfig).to.deep.equal({});
  });
  it("json5 parse when it encounters .json", () => {
    const lConfig = readConfig(getFullPath("__mocks__/read-config/dc.json"));
    expect(lConfig).to.deep.equal({});
  });
  it("json5 parse when it encounters something alien", () => {
    const lConfig = readConfig(getFullPath("__mocks__/read-config/dc.alien"));
    expect(lConfig).to.deep.equal({});
  });
});
