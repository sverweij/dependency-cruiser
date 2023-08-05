import { deepStrictEqual } from "node:assert";
import extractWithSwc from "./extract-with-swc.utl.mjs";

describe("[U] ast-extractors/extract-swc - type imports", () => {
  // normal fail, but Visitor.visitTsTypeAnnotation doesn't seem to get called
  // it("extracts type imports in const declarations", () => {
  //   deepStrictEqual(
  //     extractWithSwc("const tiepetjes: import('./types').T;"),
  //   [
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
  //   deepStrictEqual(
  //     extractWithSwc("const tiepetjes: import(`./types`).T;"),
  //   [
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
  //   deepStrictEqual(
  //     extractWithSwc(
  //       "function f(snort: import('./vypes').T){console.log(snort.bla)}"
  //     ),
  //   [
  //     {
  //       module: "./vypes",
  //       moduleSystem: "es6",
  //       dynamic: false,
  //       exoticallyRequired: false,
  //     },
  //   ]);
  // });

  it("extracts type imports in class members", () => {
    deepStrictEqual(
      extractWithSwc(
        "class Klass{ private membert: import('./wypes').T; constructor() { membert = 'x'}}",
      ),
      [
        {
          module: "./wypes",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
        },
      ],
    );
  });

  // swc fails with: "Error: internal error: entered unreachable code: parse_lit should not be called"
  // it("leaves type imports with template literals with placeholders alone", () => {
  //   deepStrictEqual(
  //     // typescript/lib/protocol.d.ts has this thing
  //     // eslint-disable-next-line no-template-curly-in-string
  //     extractWithSwc("const tiepetjes: import(`./types/${lalala()}`).T;")
  //   []);
  // });

  it("leaves 'import equals' of variables alone", () => {
    deepStrictEqual(
      // typescript/lib/protocol.d.ts has this thing
      extractWithSwc("import protocol = ts.server.protocol"),
      [],
    );
  });

  it("extracts type imports (typescript 3.8+)", () => {
    deepStrictEqual(
      extractWithSwc("import type { SomeType } from './some-module'"),
      [
        {
          module: "./some-module",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
        },
      ],
    );
  });
});
