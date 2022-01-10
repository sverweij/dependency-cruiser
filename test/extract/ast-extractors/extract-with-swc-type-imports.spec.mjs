import { expect } from "chai";
import extractWithSwc from "./extract-with-swc.utl.mjs";

describe("[U] ast-extractors/extract-swc - type imports", () => {
  // normal fail, but Visitor.visitTsTypeAnnotation doesn't seem to get called
  // it("extracts type imports in const declarations", () => {
  //   expect(
  //     extractWithSwc("const tiepetjes: import('./types').T;")
  //   ).to.deep.equal([
  //     {
  //       module: "./types",
  //       moduleSystem: "es6",
  //       dynamic: false,
  //       exoticallyRequired: false,
  //     },
  //   ]);
  // });

  // swc barfs with: Error: internal error: entered unreachable code: parse_lit should not be called
  // it("extracts type imports in const declarations (template literal argument)", () => {
  //   expect(
  //     extractWithSwc("const tiepetjes: import(`./types`).T;")
  //   ).to.deep.equal([
  //     {
  //       module: "./types",
  //       moduleSystem: "es6",
  //       dynamic: false,
  //       exoticallyRequired: false,
  //     },
  //   ]);
  // });

  // normal fail, but pNode in Visitor.visitTsTypeAnnotation(pNode) equals null
  // it("extracts type imports in parameter declarations", () => {
  //   expect(
  //     extractWithSwc(
  //       "function f(snort: import('./vypes').T){console.log(snort.bla)}"
  //     )
  //   ).to.deep.equal([
  //     {
  //       module: "./vypes",
  //       moduleSystem: "es6",
  //       dynamic: false,
  //       exoticallyRequired: false,
  //     },
  //   ]);
  // });

  it("extracts type imports in class members", () => {
    expect(
      extractWithSwc(
        "class Klass{ private membert: import('./wypes').T; constructor() { membert = 'x'}}"
      )
    ).to.deep.equal([
      {
        module: "./wypes",
        moduleSystem: "es6",
        dynamic: false,
        exoticallyRequired: false,
      },
    ]);
  });

  // swc fails with: "Error: internal error: entered unreachable code: parse_lit should not be called"
  // it("leaves type imports with template literals with placeholders alone", () => {
  //   expect(
  //     // typescript/lib/protocol.d.ts has this thing
  //     // eslint-disable-next-line no-template-curly-in-string
  //     extractWithSwc("const tiepetjes: import(`./types/${lalala()}`).T;")
  //   ).to.deep.equal([]);
  // });

  it("leaves 'import equals' of variables alone", () => {
    expect(
      // typescript/lib/protocol.d.ts has this thing
      extractWithSwc("import protocol = ts.server.protocol")
    ).to.deep.equal([]);
  });

  it("extracts type imports (typescript 3.8+)", () => {
    expect(
      extractWithSwc("import type { SomeType } from './some-module'")
    ).to.deep.equal([
      {
        module: "./some-module",
        moduleSystem: "es6",
        dynamic: false,
        exoticallyRequired: false,
      },
    ]);
  });
});
