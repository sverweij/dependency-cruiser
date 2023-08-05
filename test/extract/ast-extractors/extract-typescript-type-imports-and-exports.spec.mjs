import { deepStrictEqual } from "node:assert";
import extractTypescript from "./extract-typescript.utl.mjs";

describe("[U] ast-extractors/extract-typescript - type imports and exports", () => {
  it("extracts type imports in const declarations", () => {
    deepStrictEqual(
      extractTypescript("const tiepetjes: import('./types').T;"),
      [
        {
          module: "./types",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
        },
      ],
    );
  });

  it("extracts type imports in const declarations (template literal argument)", () => {
    deepStrictEqual(
      extractTypescript("const tiepetjes: import(`./types`).T;"),
      [
        {
          module: "./types",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
        },
      ],
    );
  });

  it("extracts type imports in parameter declarations", () => {
    deepStrictEqual(
      extractTypescript(
        "function f(snort: import('./vypes').T){console.log(snort.bla)}",
      ),
      [
        {
          module: "./vypes",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
        },
      ],
    );
  });

  it("extracts type imports in class members", () => {
    deepStrictEqual(
      extractTypescript(
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

  it("leaves type imports with template literals with placeholders alone", () => {
    deepStrictEqual(
      // typescript/lib/protocol.d.ts has this thing
      // eslint-disable-next-line no-template-curly-in-string
      extractTypescript("const tiepetjes: import(`./types/${lalala()}`).T;"),
      [],
    );
  });

  it("leaves 'import equals' of variables alone", () => {
    deepStrictEqual(
      // typescript/lib/protocol.d.ts has this thing
      extractTypescript("import protocol = ts.server.protocol"),
      [],
    );
  });

  it("extracts imports that explicitly state they only import a type - default import", () => {
    deepStrictEqual(
      extractTypescript("import type slork from './ts-typical';"),
      [
        {
          module: "./ts-typical",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: ["type-only"],
        },
      ],
    );
  });

  it("extracts imports that explicitly state they only import a type - just a part of the module", () => {
    deepStrictEqual(
      extractTypescript("import type {IZwabbernoot} from './ts-typical';"),
      [
        {
          module: "./ts-typical",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: ["type-only"],
        },
      ],
    );
  });

  it("extracts imports that explicitly state they only import a type - default import plus parts", () => {
    deepStrictEqual(
      extractTypescript(
        "import type Robbedoes, {IZwabbernoot} from './ts-typical';",
      ),
      [
        {
          module: "./ts-typical",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: ["type-only"],
        },
      ],
    );
  });

  it("extracts re-exports that explicitly state they only re-export a type", () => {
    deepStrictEqual(
      extractTypescript("export type * as vehicles from './vehicles';"),
      [
        {
          module: "./vehicles",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: ["type-only"],
        },
      ],
    );
  });

  it("extracts re-exports that explicitly state they only re-export a type (without aliases)", () => {
    deepStrictEqual(extractTypescript("export type * from './vehicles';"), [
      {
        module: "./vehicles",
        moduleSystem: "es6",
        dynamic: false,
        exoticallyRequired: false,
        dependencyTypes: ["type-only"],
      },
    ]);
  });
});
