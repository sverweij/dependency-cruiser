import { deepStrictEqual } from "node:assert";
import { describe, it } from "node:test";
import extractWithSwc from "./extract-with-swc.utl.mjs";

describe("[U] ast-extractors/extract-swc - dynamic imports", () => {
  it("correctly detects a dynamic import statement", () => {
    deepStrictEqual(
      extractWithSwc(
        "import('judeljo').then(someModule => { someModule.hochik() })"
      ),
      [
        {
          module: "judeljo",
          moduleSystem: "es6",
          dynamic: true,
          exoticallyRequired: false,
        },
      ]
    );
  });

  it("correctly detects a dynamic import statement with a template that has no placeholders", () => {
    deepStrictEqual(
      extractWithSwc("import(`judeljo`).then(judeljo => { judeljo.hochik() })"),
      [
        {
          module: "judeljo",
          moduleSystem: "es6",
          dynamic: true,
          exoticallyRequired: false,
        },
      ]
    );
  });

  it("ignores dynamic import statements with a template that has placeholders", () => {
    deepStrictEqual(
      extractWithSwc(
        // eslint-disable-next-line no-template-curly-in-string
        "import(`judeljo/${vlap}`).then(judeljo => { judeljo.hochik() })"
      ),
      []
    );
  });

  it("ignores dynamic import statements with a non-string parameter", () => {
    deepStrictEqual(
      extractWithSwc(
        "import(elaborateFunctionCall()).then(judeljo => { judeljo.hochik() })"
      ),
      []
    );
  });

  it("ignores dynamic import statements without a parameter", () => {
    deepStrictEqual(
      extractWithSwc(
        "import(/* nothing */).then(judeljo => { judeljo.hochik() })"
      ),
      []
    );
  });
});
