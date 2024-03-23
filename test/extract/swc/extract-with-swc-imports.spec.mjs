import { deepEqual } from "node:assert/strict";
import extractWithSwc from "./extract-with-swc.utl.mjs";

describe("[U] ast-extractors/extract-swc - regular imports", () => {
  it("extracts 'import for side effects only'", () => {
    deepEqual(extractWithSwc("import './import-for-side-effects';"), [
      {
        module: "./import-for-side-effects",
        moduleSystem: "es6",
        dynamic: false,
        exoticallyRequired: false,
        dependencyTypes: ["import"],
      },
    ]);
  });

  it("extracts 'import some stuff only'", () => {
    deepEqual(
      extractWithSwc("import { SomeSingleExport } from './ts-thing';"),
      [
        {
          module: "./ts-thing",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: ["import"],
        },
      ],
    );
  });

  it("extracts 'import some stuff only and rename that'", () => {
    deepEqual(
      extractWithSwc(
        "import { SomeSingleExport as RenamedSingleExport } from './ts-thing';",
      ),
      [
        {
          module: "./ts-thing",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: ["import"],
        },
      ],
    );
  });

  it("extracts 'import everything into a variable'", () => {
    deepEqual(
      extractWithSwc(
        "import * as entireTsOtherThingAsVariable from './ts-thing';",
      ),
      [
        {
          module: "./ts-thing",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: ["import"],
        },
      ],
    );
  });
});
