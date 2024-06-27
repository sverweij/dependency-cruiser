import { equal } from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import normalizeNewline from "normalize-newline";

const require = createRequire(import.meta.url);
// declare proxyquire, and ensure it doesn't load modules from cache
// see https://github.com/thlorenz/proxyquire#forcing-proxyquire-to-reload-modules
const proxyquire = require("proxyquire").noPreserveCache();

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// instead of requiring the module under test, proxyquire it
const wrap = proxyquire.load("#extract/transpile/vue-template-wrap.cjs", {
  // Force the tryRequire on "vue-template-compiler" to fail
  // so that we ensure we are using Vue 3 for this test
  "#utl/try-require.cjs": (pModuleName) =>
    pModuleName === "vue-template-compiler"
      ? false
      : require("@vue/compiler-sfc"),
});

describe("[I] vue transpiler", () => {
  it("extracts the script content from a vue SFC", () => {
    equal(
      normalizeNewline(
        wrap.transpile(
          readFileSync(join(__dirname, "__mocks__/vue.vue"), "utf8"),
        ),
      ),
      normalizeNewline(
        readFileSync(join(__dirname, "__fixtures__/vue.js"), "utf8"),
      ),
    );
  });

  it("returns the empty string from a vue SFC without a script part", () => {
    equal(
      normalizeNewline(
        wrap.transpile(
          readFileSync(join(__dirname, "__mocks__/vue-noscript.vue"), "utf8"),
        ),
      ),
      normalizeNewline(""),
    );
  });

  it("handles invalid vue (silently - for backwards compatibility with Vue 2)", () => {
    equal(
      normalizeNewline(
        wrap.transpile(
          readFileSync(join(__dirname, "__mocks__/vue-invalid.vue"), "utf8"),
        ),
      ),
      normalizeNewline(""),
    );
  });

  it("extracts the script setup content from a vue SFC", () => {
    equal(
      normalizeNewline(
        wrap.transpile(
          readFileSync(
            join(__dirname, "__mocks__/vue-script-setup.vue"),
            "utf8",
          ),
        ),
      ),
      normalizeNewline(
        readFileSync(
          join(__dirname, "__fixtures__/vue-script-setup.js"),
          "utf8",
        ),
      ),
    );
  });

  it("extracts the script setup content and script content from a vue SFC", () => {
    equal(
      normalizeNewline(
        wrap.transpile(
          readFileSync(
            join(__dirname, "__mocks__/vue-script-setup-and-script.vue"),
            "utf8",
          ),
        ),
      ),
      normalizeNewline(
        readFileSync(
          join(__dirname, "__fixtures__/vue-script-setup-and-script.js"),
          "utf8",
        ),
      ),
    );
  });
});
