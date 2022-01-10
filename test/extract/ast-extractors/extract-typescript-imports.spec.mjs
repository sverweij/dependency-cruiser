import { expect } from "chai";
import extractTypescript from "./extract-typescript.utl.mjs";

describe("[U] ast-extractors/extract-typescript - regular imports", () => {
  it("extracts 'import for side effects only'", () => {
    expect(
      extractTypescript("import './import-for-side-effects';")
    ).to.deep.equal([
      {
        module: "./import-for-side-effects",
        moduleSystem: "es6",
        dynamic: false,
        exoticallyRequired: false,
      },
    ]);
  });

  it("extracts 'import some stuff only'", () => {
    expect(
      extractTypescript("import { SomeSingleExport } from './ts-thing';")
    ).to.deep.equal([
      {
        module: "./ts-thing",
        moduleSystem: "es6",
        dynamic: false,
        exoticallyRequired: false,
      },
    ]);
  });

  it("extracts 'import some stuff only and rename that'", () => {
    expect(
      extractTypescript(
        "import { SomeSingleExport as RenamedSingleExport } from './ts-thing';"
      )
    ).to.deep.equal([
      {
        module: "./ts-thing",
        moduleSystem: "es6",
        dynamic: false,
        exoticallyRequired: false,
      },
    ]);
  });

  it("extracts 'import everything into a variable'", () => {
    expect(
      extractTypescript(
        "import * as entireTsOtherThingAsVariable from './ts-thing';"
      )
    ).to.deep.equal([
      {
        module: "./ts-thing",
        moduleSystem: "es6",
        dynamic: false,
        exoticallyRequired: false,
      },
    ]);
  });
});
