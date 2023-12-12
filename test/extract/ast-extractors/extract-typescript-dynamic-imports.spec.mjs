import { deepEqual } from "node:assert/strict";
import extractTypescript from "./extract-typescript.utl.mjs";

describe("[U] ast-extractors/extract-typescript - dynamic imports", () => {
  it("correctly detects a dynamic import statement", () => {
    deepEqual(
      extractTypescript(
        "import('judeljo').then(judeljo => { judeljo.hochik() })",
      ),
      [
        {
          module: "judeljo",
          moduleSystem: "es6",
          dynamic: true,
          exoticallyRequired: false,
          dependencyTypes: ["dynamic-import"],
        },
      ],
    );
  });

  it("correctly detects a dynamic import statement with a template that has no placeholders", () => {
    deepEqual(
      extractTypescript(
        "import(`judeljo`).then(judeljo => { judeljo.hochik() })",
      ),
      [
        {
          module: "judeljo",
          moduleSystem: "es6",
          dynamic: true,
          exoticallyRequired: false,
          dependencyTypes: ["dynamic-import"],
        },
      ],
    );
  });

  it("ignores dynamic import statements with a template that has placeholders", () => {
    deepEqual(
      extractTypescript(
        // eslint-disable-next-line no-template-curly-in-string
        "import(`judeljo/${vlap}`).then(judeljo => { judeljo.hochik() })",
      ),
      [],
    );
  });

  it("ignores dynamic import statements with a non-string parameter", () => {
    deepEqual(
      extractTypescript(
        "import(elaborateFunctionCall()).then(judeljo => { judeljo.hochik() })",
      ),
      [],
    );
  });

  it("ignores dynamic import statements without a parameter", () => {
    deepEqual(
      extractTypescript(
        "import(/* nothing */).then(judeljo => { judeljo.hochik() })",
      ),
      [],
    );
  });
});
