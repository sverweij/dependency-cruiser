import { deepStrictEqual } from "node:assert";
import { describe, it } from "node:test";
import extractTypescript from "./extract-typescript.utl.mjs";

describe("[U] ast-extractors/extract-typescript - regular imports", () => {
  it("extracts 'import for side effects only'", () => {
    deepStrictEqual(extractTypescript("import './import-for-side-effects';"), [
      {
        module: "./import-for-side-effects",
        moduleSystem: "es6",
        dynamic: false,
        exoticallyRequired: false,
      },
    ]);
  });

  it("extracts 'import some stuff only'", () => {
    deepStrictEqual(
      extractTypescript("import { SomeSingleExport } from './ts-thing';"),
      [
        {
          module: "./ts-thing",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
        },
      ]
    );
  });

  it("extracts 'import some stuff only and rename that'", () => {
    deepStrictEqual(
      extractTypescript(
        "import { SomeSingleExport as RenamedSingleExport } from './ts-thing';"
      ),
      [
        {
          module: "./ts-thing",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
        },
      ]
    );
  });

  it("extracts 'import everything into a variable'", () => {
    deepStrictEqual(
      extractTypescript(
        "import * as entireTsOtherThingAsVariable from './ts-thing';"
      ),
      [
        {
          module: "./ts-thing",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
        },
      ]
    );
  });
});
