import { equal } from "node:assert/strict";
import getExtension from "#utl/get-extension.mjs";

describe("[U] utl/getExtension", () => {
  it(".coffee.md classifies as .coffee.md", () => {
    equal(getExtension("./aap/noot/mies.coffee.md"), ".coffee.md");
  });

  it(".tea.md classifies as .md", () => {
    equal(getExtension("./aap/noot/mies.tes.md"), ".md");
  });

  it("types.d.ts classifies as .d.ts", () => {
    equal(getExtension("./types/types.d.ts"), ".d.ts");
  });

  it("types.d.mts classifies as .d.mts", () => {
    equal(getExtension("./types/types.d.mts"), ".d.mts");
  });

  it("any extension (e.g. .ts) classifies as that", () => {
    equal(getExtension("./types/typed.ts"), ".ts");
  });

  it("any extension (e.g. .js) classifies as that", () => {
    equal(getExtension("./aap/noot/mies.js"), ".js");
  });

  it("no extension classifies as nothing", () => {
    equal(getExtension("./aap/noot/mies"), "");
  });
});
