const fs = require("fs");
const path = require("path");
const expect = require("chai").expect;
const normalizeNewline = require("normalize-newline");
const wrap = require("../../../src/extract/transpile/vueWrap");

describe("vue transpiler", () => {
  it("extracts the script content from a vue SFC", () => {
    expect(
      normalizeNewline(
        wrap.transpile(
          fs.readFileSync(path.join(__dirname, "fixtures/vue.vue"), "utf8")
        )
      )
    ).to.equal(
      normalizeNewline(
        fs.readFileSync(path.join(__dirname, "fixtures/vue.js"), "utf8")
      )
    );
  });

  it("returns the empty string from a vue SFC without a script part", () => {
    expect(
      normalizeNewline(
        wrap.transpile(
          fs.readFileSync(
            path.join(__dirname, "fixtures/vue-noscript.vue"),
            "utf8"
          )
        )
      )
    ).to.equal(normalizeNewline(""));
  });

  it("handles invalid vue (silently - as per the vue-template-compiler)", () => {
    expect(
      normalizeNewline(
        wrap.transpile(
          fs.readFileSync(
            path.join(__dirname, "fixtures/vue-invalid.vue"),
            "utf8"
          )
        )
      )
    ).to.equal(normalizeNewline(""));
  });
});
