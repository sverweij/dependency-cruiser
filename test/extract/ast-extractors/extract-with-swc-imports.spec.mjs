import { deepStrictEqual } from "node:assert";
import extractWithSwc from "./extract-with-swc.utl.mjs";

describe("[U] ast-extractors/extract-swc - regular imports", () => {
  it("extracts 'import for side effects only'", () => {
    deepStrictEqual(extractWithSwc("import './import-for-side-effects';"), [
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
      extractWithSwc("import { SomeSingleExport } from './ts-thing';"),
      [
        {
          module: "./ts-thing",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
        },
      ],
    );
  });

  it("extracts 'import some stuff only and rename that'", () => {
    deepStrictEqual(
      extractWithSwc(
        "import { SomeSingleExport as RenamedSingleExport } from './ts-thing';",
      ),
      [
        {
          module: "./ts-thing",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
        },
      ],
    );
  });

  it("extracts 'import everything into a variable'", () => {
    deepStrictEqual(
      extractWithSwc(
        "import * as entireTsOtherThingAsVariable from './ts-thing';",
      ),
      [
        {
          module: "./ts-thing",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
        },
      ],
    );
  });
});
