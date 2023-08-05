import { strictEqual } from "node:assert";
import { describe, it } from "node:test";
import getExtension from "../../src/utl/get-extension.mjs";

describe("[U] utl/getExtension", () => {
  it(".coffee.md classifies as .coffee.md", () => {
    strictEqual(getExtension("./aap/noot/mies.coffee.md"), ".coffee.md");
  });

  it(".tea.md classifies as .md", () => {
    strictEqual(getExtension("./aap/noot/mies.tes.md"), ".md");
  });

  it("types.d.ts classifies as .d.ts", () => {
    strictEqual(getExtension("./types/types.d.ts"), ".d.ts");
  });

  it("types.d.mts classifies as .d.mts", () => {
    strictEqual(getExtension("./types/types.d.mts"), ".d.mts");
  });

  it("any extension (e.g. .ts) classifies as that", () => {
    strictEqual(getExtension("./types/typed.ts"), ".ts");
  });

  it("any extension (e.g. .js) classifies as that", () => {
    strictEqual(getExtension("./aap/noot/mies.js"), ".js");
  });

  it("no extension classifies as nothing", () => {
    strictEqual(getExtension("./aap/noot/mies"), "");
  });
});
