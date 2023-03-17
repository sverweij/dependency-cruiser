import { expect } from "chai";
import meta from "../../../src/extract/transpile/meta.js";
import jsWrap from "../../../src/extract/transpile/javascript-wrap.js";
import lsWrap from "../../../src/extract/transpile/livescript-wrap.js";
import babelWrap from "../../../src/extract/transpile/babel-wrap.js";
import vueTemplateWrap from "../../../src/extract/transpile/vue-template-wrap.js";

describe("[U] extract/transpile/meta", () => {
  it("tells which extensions can be scanned", () => {
    expect(meta.scannableExtensions).to.deep.equal([
      ".js",
      ".cjs",
      ".mjs",
      ".jsx",
      ".ts",
      ".tsx",
      ".d.ts",
      ".cts",
      ".d.cts",
      ".mts",
      ".d.mts",
      ".vue",
      ".svelte",
      ".coffee",
      ".litcoffee",
      ".coffee.md",
      ".csx",
      ".cjsx",
    ]);
  });

  it("returns the 'js' wrapper for unknown extensions", () => {
    expect(meta.getWrapper("")).to.deep.equal(jsWrap);
  });

  it("returns the 'ls' wrapper for livescript", () => {
    expect(meta.getWrapper(".ls")).to.deep.equal(lsWrap);
  });

  it("returns the 'javascript' wrapper for javascript when the babel config is not passed", () => {
    expect(meta.getWrapper(".js", {})).to.deep.equal(jsWrap);
  });

  it("returns the 'javascript' wrapper for javascript when there's just a typscript config", () => {
    expect(meta.getWrapper(".js", { tsConfig: {} })).to.deep.equal(jsWrap);
  });

  it("returns the 'babel' wrapper for javascript when the babel config is empty", () => {
    expect(meta.getWrapper(".js", { babelConfig: {} })).to.deep.equal(jsWrap);
  });

  it("returns the 'babel' wrapper for javascript when the babel config is not empty", () => {
    expect(
      meta.getWrapper(".js", { babelConfig: { babelrc: false } })
    ).to.deep.equal(babelWrap);
  });

  it("returns the 'babel' wrapper for typescript when the babel config is not empty", () => {
    expect(
      meta.getWrapper(".ts", { babelConfig: { babelrc: false } })
    ).to.deep.equal(babelWrap);
  });

  it("returns the 'vue' wrapper for vue templates even when the babel config is not empty", () => {
    expect(
      meta.getWrapper(".vue", { babelConfig: { babelrc: false } })
    ).to.deep.equal(vueTemplateWrap);
  });

  it("returns the 'svelte' wrapper for svelte even when the babel config is not empty", () => {
    expect(
      meta
        .getWrapper(".svelte", { babelConfig: { babelrc: false } })
        .transpile.toString()
    ).to.contains("svelte");
  });

  it("returns me the available transpilers", () => {
    expect(meta.getAvailableTranspilers()).to.deep.equal([
      {
        name: "babel",
        version: ">=7.0.0 <8.0.0",
        available: true,
      },
      {
        name: "coffee-script",
        version: ">=1.0.0 <2.0.0",
        available: true,
      },
      {
        name: "coffeescript",
        version: ">=1.0.0 <3.0.0",
        available: true,
      },
      {
        name: "livescript",
        version: ">=1.0.0 <2.0.0",
        available: false,
      },
      {
        name: "svelte",
        version: ">=3.0.0 <4.0.0",
        available: true,
      },
      {
        name: "swc",
        version: ">=1.0.0 <2.0.0",
        available: true,
      },
      {
        name: "typescript",
        version: ">=2.0.0 <6.0.0",
        available: true,
      },
      {
        name: "vue-template-compiler",
        version: ">=2.0.0 <3.0.0",
        available: true,
      },
      {
        name: "@vue/compiler-sfc",
        version: ">=3.0.0 <4.0.0",
        available: true,
      },
    ]);
  });
});
