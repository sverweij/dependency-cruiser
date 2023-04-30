import { expect } from "chai";
import {
  getAvailableTranspilers,
  scannableExtensions,
} from "../../../src/extract/transpile/meta.mjs";

describe("[U] extract/transpile/meta", () => {
  it("tells which extensions can be scanned", () => {
    expect(scannableExtensions).to.deep.equal([
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

  it("returns the available transpilers", () => {
    expect(getAvailableTranspilers()).to.deep.equal([
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
