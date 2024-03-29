import { deepEqual } from "node:assert/strict";
import extractTypescript from "./extract-typescript.utl.mjs";

describe("[U] ast-extractors/extract-typescript - regular imports", () => {
  it("extracts 'import for side effects only'", () => {
    deepEqual(extractTypescript("import './import-for-side-effects';"), [
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
      extractTypescript("import { SomeSingleExport } from './ts-thing';"),
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
      extractTypescript(
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
      extractTypescript(
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
