import { expect } from "chai";
import extractWithSwc from "./extract-with-swc.utl.mjs";

describe("[U] ast-extractors/extract-swc - regular imports", () => {
  it("extracts 'import for side effects only'", () => {
    expect(extractWithSwc("import './import-for-side-effects';")).to.deep.equal(
      [
        {
          module: "./import-for-side-effects",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
        },
      ]
    );
  });

  it("extracts 'import some stuff only'", () => {
    expect(
      extractWithSwc("import { SomeSingleExport } from './ts-thing';")
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
      extractWithSwc(
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
      extractWithSwc(
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
