import { expect } from "chai";
import getExtension from "../../src/utl/get-extension.mjs";

describe("[U] utl/getExtension", () => {
  it(".coffee.md classifies as .coffee.md", () => {
    expect(getExtension("./aap/noot/mies.coffee.md")).to.equal(".coffee.md");
  });

  it(".tea.md classifies as .md", () => {
    expect(getExtension("./aap/noot/mies.tes.md")).to.equal(".md");
  });

  it("types.d.ts classifies as .d.ts", () => {
    expect(getExtension("./types/types.d.ts")).to.equal(".d.ts");
  });

  it("types.d.mts classifies as .d.mts", () => {
    expect(getExtension("./types/types.d.mts")).to.equal(".d.mts");
  });

  it("any extension (e.g. .ts) classifies as that", () => {
    expect(getExtension("./types/typed.ts")).to.equal(".ts");
  });

  it("any extension (e.g. .js) classifies as that", () => {
    expect(getExtension("./aap/noot/mies.js")).to.equal(".js");
  });

  it("no extension classifies as nothing", () => {
    expect(getExtension("./aap/noot/mies")).to.equal("");
  });
});
