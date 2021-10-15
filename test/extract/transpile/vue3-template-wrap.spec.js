const readFileSync = require("fs").readFileSync;
const join = require("path").join;
const expect = require("chai").expect;
const normalizeNewline = require("normalize-newline");

// declare proxyquire, and ensure it doesn't load modules from cache
// see https://github.com/thlorenz/proxyquire#forcing-proxyquire-to-reload-modules
const proxyquire = require("proxyquire").noPreserveCache();

// instead of requiring the module under test, proxyquire it
const wrap = proxyquire.load(
  "../../../src/extract/transpile/vue-template-wrap.js",
  {
    // Force the tryRequire on "vue-template-compiler" to fail
    // so that we ensure we are using Vue 3 for this test
    "semver-try-require": (pModuleName) =>
      pModuleName === "vue-template-compiler"
        ? false
        : // eslint-disable-next-line node/global-require
          require("@vue/compiler-sfc"),
  }
);

describe("vue transpiler", () => {
  it("extracts the script content from a vue SFC", () => {
    expect(
      normalizeNewline(
        wrap.transpile(
          readFileSync(join(__dirname, "fixtures/vue.vue"), "utf8")
        )
      )
    ).to.equal(
      normalizeNewline(readFileSync(join(__dirname, "fixtures/vue.js"), "utf8"))
    );
  });

  it("returns the empty string from a vue SFC without a script part", () => {
    expect(
      normalizeNewline(
        wrap.transpile(
          readFileSync(join(__dirname, "fixtures/vue-noscript.vue"), "utf8")
        )
      )
    ).to.equal(normalizeNewline(""));
  });

  it("handles invalid vue (silently - for backwards compatibility with Vue 2)", () => {
    expect(
      normalizeNewline(
        wrap.transpile(
          readFileSync(join(__dirname, "fixtures/vue-invalid.vue"), "utf8")
        )
      )
    ).to.equal(normalizeNewline(""));
  });
});
