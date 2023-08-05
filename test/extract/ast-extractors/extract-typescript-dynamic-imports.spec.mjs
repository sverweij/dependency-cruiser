import { deepStrictEqual } from "node:assert";
import extractTypescript from "./extract-typescript.utl.mjs";

describe("[U] ast-extractors/extract-typescript - dynamic imports", () => {
  it("correctly detects a dynamic import statement", () => {
    deepStrictEqual(
      extractTypescript(
        "import('judeljo').then(judeljo => { judeljo.hochik() })",
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
    deepStrictEqual(
      extractTypescript(
        "import(`judeljo`).then(judeljo => { judeljo.hochik() })",
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

  it("ignores dynamic import statements with a template that has placeholders", () => {
    deepStrictEqual(
      extractTypescript(
        // eslint-disable-next-line no-template-curly-in-string
        "import(`judeljo/${vlap}`).then(judeljo => { judeljo.hochik() })",
      ),
      [],
    );
  });

  it("ignores dynamic import statements with a non-string parameter", () => {
    deepStrictEqual(
      extractTypescript(
        "import(elaborateFunctionCall()).then(judeljo => { judeljo.hochik() })",
      ),
      [],
    );
  });

  it("ignores dynamic import statements without a parameter", () => {
    deepStrictEqual(
      extractTypescript(
        "import(/* nothing */).then(judeljo => { judeljo.hochik() })",
      ),
      [],
    );
  });
});
