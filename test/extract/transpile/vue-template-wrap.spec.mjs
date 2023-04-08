import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect } from "chai";
import normalizeNewline from "normalize-newline";
import wrap from "../../../src/extract/transpile/vue-template-wrap.cjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

describe("[I] vue transpiler", () => {
  it("extracts the script content from a vue SFC", () => {
    expect(
      normalizeNewline(
        wrap.transpile(
          readFileSync(join(__dirname, "__mocks__/vue.vue"), "utf8")
        )
      )
    ).to.equal(
      normalizeNewline(
        readFileSync(join(__dirname, "__fixtures__/vue.js"), "utf8")
      )
    );
  });

  it("returns the empty string from a vue SFC without a script part", () => {
    expect(
      normalizeNewline(
        wrap.transpile(
          readFileSync(join(__dirname, "__mocks__/vue-noscript.vue"), "utf8")
        )
      )
    ).to.equal(normalizeNewline(""));
  });

  it("handles invalid vue (silently - as per the vue-template-compiler)", () => {
    expect(
      normalizeNewline(
        wrap.transpile(
          readFileSync(join(__dirname, "__mocks__/vue-invalid.vue"), "utf8")
        )
      )
    ).to.equal(normalizeNewline(""));
  });
});
