import { deepEqual } from "node:assert/strict";
import extractTypescript from "./extract-typescript.utl.mjs";

describe("[U] ast-extractors/extract-typescript - type imports and exports", () => {
  it("extracts type imports in const declarations", () => {
    deepEqual(extractTypescript("const tiepetjes: import('./types').T;"), [
      {
        module: "./types",
        moduleSystem: "es6",
        dynamic: false,
        exoticallyRequired: false,
      },
    ]);
  });

  it("extracts type imports in const declarations (template literal argument)", () => {
    deepEqual(extractTypescript("const tiepetjes: import(`./types`).T;"), [
      {
        module: "./types",
        moduleSystem: "es6",
        dynamic: false,
        exoticallyRequired: false,
      },
    ]);
  });

  it("extracts type imports in parameter declarations", () => {
    deepEqual(
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
    deepEqual(
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
    deepEqual(
      // typescript/lib/protocol.d.ts has this thing
      // eslint-disable-next-line no-template-curly-in-string
      extractTypescript("const tiepetjes: import(`./types/${lalala()}`).T;"),
      [],
    );
  });

  it("leaves 'import equals' of variables alone", () => {
    deepEqual(
      // typescript/lib/protocol.d.ts has this thing
      extractTypescript("import protocol = ts.server.protocol"),
      [],
    );
  });

  it("extracts imports that explicitly state they only import a type - default import", () => {
    deepEqual(extractTypescript("import type slork from './ts-typical';"), [
      {
        module: "./ts-typical",
        moduleSystem: "es6",
        dynamic: false,
        exoticallyRequired: false,
        dependencyTypes: ["type-only"],
      },
    ]);
  });

  it("extracts imports that explicitly state they only import a type - just a part of the module", () => {
    deepEqual(
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
    deepEqual(
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

  it("extracts imports with inline type imports - only type imports", () => {
    deepEqual(
      extractTypescript(
        "import { type slork, type klaatu } from './ts-typical';",
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

  it("extracts imports with inline type imports - mixing type and non-type", () => {
    deepEqual(
      extractTypescript("import { type slork, klaatu } from './ts-typical';"),
      [
        {
          module: "./ts-typical",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
        },
      ],
    );
  });

  it("extracts re-exports that explicitly state they only re-export a type", () => {
    deepEqual(
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
    deepEqual(extractTypescript("export type * from './vehicles';"), [
      {
        module: "./vehicles",
        moduleSystem: "es6",
        dynamic: false,
        exoticallyRequired: false,
        dependencyTypes: ["type-only"],
      },
    ]);
  });

  it("extracts re-exports with inline type re-exports - only type re-exports", () => {
    deepEqual(
      extractTypescript("export { type foobar, type baz } from './vehicles';"),
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

  it("extracts re-exports with inline type re-exports - mixing type and non-type", () => {
    deepEqual(
      extractTypescript("export { type foobar, baz } from './vehicles';"),
      [
        {
          module: "./vehicles",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
        },
      ],
    );
  });
});
