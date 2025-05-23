import { deepEqual, ok, equal } from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import normalizeSource from "../normalize-source.utl.mjs";
import transpile, { getWrapper } from "#extract/transpile/index.mjs";

import jsWrap from "#extract/transpile/javascript-wrap.mjs";
import lsWrap from "#extract/transpile/livescript-wrap.mjs";
import babelWrap from "#extract/transpile/babel-wrap.mjs";
import vueTemplateWrap from "#extract/transpile/vue-template-wrap.cjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

describe("[I] transpile", () => {
  it("As the 'livescript' transpiler is not available, returns the original source", () => {
    equal(
      transpile({ extension: ".ls", source: "whatever the bever" }),
      "whatever the bever",
    );
  });

  it("As the 'bf-script' transpiler is not supported at all, returns the original source", () => {
    equal(
      transpile({
        extension: ".bfs",
        source: "'brane-fuchs-skrybd'|#$'nicht unterstutzt'|^^^",
      }),
      "'brane-fuchs-skrybd'|#$'nicht unterstutzt'|^^^",
    );
  });

  it("Returns svelte compiled down to js", async () => {
    const lInput = readFileSync(
      join(__dirname, "__mocks__", "svelte-ts.svelte"),
      "utf8",
    );
    const lObservedOutput = await normalizeSource(
      transpile({ extension: ".svelte", source: lInput }),
    );
    const lExpectedOutput = await normalizeSource(
      readFileSync(join(__dirname, "__fixtures__", "svelte.js"), "utf8"),
    );
    equal(lObservedOutput, lExpectedOutput);
  });

  it("Does not confuse .ts for .tsx", async () => {
    const lInputFixture = readFileSync(
      join(__dirname, "__mocks__/dontconfuse_ts_for_tsx/input/Observable.ts"),
      "utf8",
    );
    const lTranspiledFixture = readFileSync(
      join(
        __dirname,
        "__mocks__/dontconfuse_ts_for_tsx/transpiled/Observable.js",
      ),
      "utf8",
    );
    const lExpected = await normalizeSource(lTranspiledFixture);
    const lFound = await normalizeSource(
      transpile({ extension: ".ts", source: lInputFixture }),
    );
    equal(lExpected, lFound);
  });

  it("Takes a tsconfig and takes that into account on transpilation", async () => {
    const lInputFixture = readFileSync(
      join(__dirname, "__mocks__/dontconfuse_ts_for_tsx/input/Observable.ts"),
      "utf8",
    );
    const lTranspiledFixture = readFileSync(
      join(
        __dirname,
        "__mocks__/dontconfuse_ts_for_tsx/transpiled/Observable.js",
      ),
      "utf8",
    );

    const lTranspilerOptions = {
      baseUrl: "src",
      paths: {
        "@core/*": ["core/*"],
      },
      rootDirs: ["shared", "hello"],
      typeRoots: ["../../types"],
      types: ["foo", "bar", "baz"],
    };
    const lExpected = await normalizeSource(
      transpile(
        { extension: ".ts", source: lInputFixture },
        lTranspilerOptions,
      ),
    );
    equal(lExpected, lTranspiledFixture);
  });
});

describe("[I] transpile/wrapper", () => {
  it("returns the 'js' wrapper for unknown extensions", () => {
    deepEqual(getWrapper(""), jsWrap);
  });

  it("returns the 'ls' wrapper for livescript", () => {
    deepEqual(getWrapper(".ls"), lsWrap);
  });

  it("returns the 'javascript' wrapper for javascript when the babel config is not passed", () => {
    deepEqual(getWrapper(".js", {}), jsWrap);
  });

  it("returns the 'javascript' wrapper for javascript when there's just a typscript config", () => {
    deepEqual(getWrapper(".js", { tsConfig: {} }), jsWrap);
  });

  it("returns the 'babel' wrapper for javascript when the babel config is empty", () => {
    deepEqual(getWrapper(".js", { babelConfig: {} }), jsWrap);
  });

  it("returns the 'babel' wrapper for javascript when the babel config is not empty", () => {
    deepEqual(
      getWrapper(".js", { babelConfig: { babelrc: false } }),
      babelWrap,
    );
  });

  it("returns the 'babel' wrapper for typescript when the babel config is not empty", () => {
    deepEqual(
      getWrapper(".ts", { babelConfig: { babelrc: false } }),
      babelWrap,
    );
  });

  it("returns the 'vue' wrapper for vue templates even when the babel config is not empty", () => {
    deepEqual(
      getWrapper(".vue", { babelConfig: { babelrc: false } }),
      vueTemplateWrap,
    );
  });

  it("returns the 'svelte' wrapper for svelte even when the babel config is not empty", () => {
    const lTheThing = getWrapper(".svelte", {
      babelConfig: { babelrc: false },
    })
      .transpile("")
      .toString();
    ok(lTheThing.includes("import * as $ from 'svelte/internal/client';"));
  });
});
