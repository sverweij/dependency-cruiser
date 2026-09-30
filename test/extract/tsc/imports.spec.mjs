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

  it("does not extract imports inside ambient module declarations by default", () => {
    deepEqual(
      extractTypescript('declare module "some-package" { import "./nested"; }'),
      [],
    );
  });

  it("extracts imports inside nested ambient namespaces when enabled", () => {
    deepEqual(
      extractTypescript(
        'declare namespace Outer { namespace Inner { import "./nested"; } }',
        [],
        false,
        false,
        true,
      ),
      [
        {
          module: "./nested",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: ["import"],
        },
      ],
    );
  });

  it("still extracts top-level imports when ambient module detection is disabled", () => {
    deepEqual(extractTypescript('import "./top-level";'), [
      {
        module: "./top-level",
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
