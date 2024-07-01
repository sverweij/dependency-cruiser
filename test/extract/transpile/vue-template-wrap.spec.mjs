import { equal } from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import normalizeNewline from "normalize-newline";
import wrap from "#extract/transpile/vue-template-wrap.cjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

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

  it("handles invalid vue (silently - as per the vue-template-compiler)", () => {
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
