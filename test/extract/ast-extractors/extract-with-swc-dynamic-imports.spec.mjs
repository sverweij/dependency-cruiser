import { deepEqual } from "node:assert/strict";
import extractWithSwc from "./extract-with-swc.utl.mjs";

describe("[U] ast-extractors/extract-swc - dynamic imports", () => {
  it("correctly detects a dynamic import statement", () => {
    deepEqual(
      extractWithSwc(
        "import('judeljo').then(someModule => { someModule.hochik() })",
      ),
      [
        {
          module: "judeljo",
          moduleSystem: "es6",
          dynamic: true,
          exoticallyRequired: false,
        },
      ],
    );
  });

  it("correctly detects a dynamic import statement with a template that has no placeholders", () => {
    deepEqual(
      extractWithSwc("import(`judeljo`).then(judeljo => { judeljo.hochik() })"),
      [
        {
          module: "judeljo",
          moduleSystem: "es6",
          dynamic: true,
          exoticallyRequired: false,
        },
      ],
    );
  });

  it("ignores dynamic import statements with a template that has placeholders", () => {
    deepEqual(
      extractWithSwc(
        // eslint-disable-next-line no-template-curly-in-string
        "import(`judeljo/${vlap}`).then(judeljo => { judeljo.hochik() })",
      ),
      [],
    );
  });

  it("ignores dynamic import statements with a non-string parameter", () => {
    deepEqual(
      extractWithSwc(
        "import(elaborateFunctionCall()).then(judeljo => { judeljo.hochik() })",
      ),
      [],
    );
  });

  it("ignores dynamic import statements without a parameter", () => {
    deepEqual(
      extractWithSwc(
        "import(/* nothing */).then(judeljo => { judeljo.hochik() })",
      ),
      [],
    );
  });
});
