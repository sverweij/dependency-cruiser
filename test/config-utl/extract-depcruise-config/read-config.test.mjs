import { deepStrictEqual } from "node:assert";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import readConfig from "../../../src/config-utl/extract-depcruise-config/read-config.mjs";

function getFullPath(pRelativePath) {
  return fileURLToPath(new URL(pRelativePath, import.meta.url));
}

describe("[U] config-utl/extract-depcruise-config/read-config", () => {
  it("imports when it encounters .js", async () => {
    const lConfig = await readConfig(
      getFullPath("__mocks__/read-config/dc.js")
    );
    deepStrictEqual(lConfig, {});
  });
  it("imports when it encounters .cjs", async () => {
    const lConfig = await readConfig(
      getFullPath("__mocks__/read-config/dc.cjs")
    );
    deepStrictEqual(lConfig, {});
  });
  it("imports when it encounters .mjs", async () => {
    const lConfig = await readConfig(
      getFullPath("__mocks__/read-config/dc.mjs")
    );
    deepStrictEqual(lConfig, {});
  });
  it("json5 parse when it encounters .json", async () => {
    const lConfig = await readConfig(
      getFullPath("__mocks__/read-config/dc.json")
    );
    deepStrictEqual(lConfig, {});
  });
  it("json5 parse when it encounters something alien", async () => {
    const lConfig = await readConfig(
      getFullPath("__mocks__/read-config/dc.alien")
    );
    deepStrictEqual(lConfig, {});
  });
});
