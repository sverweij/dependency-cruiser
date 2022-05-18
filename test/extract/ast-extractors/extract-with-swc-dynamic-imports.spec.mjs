import { expect } from "chai";
import extractWithSwc from "./extract-with-swc.utl.mjs";

describe("[U] ast-extractors/extract-swc - dynamic imports", () => {
  it("correctly detects a dynamic import statement", () => {
    expect(
      extractWithSwc(
        "import('judeljo').then(someModule => { someModule.hochik() })"
      )
    ).to.deep.equal([
      {
        module: "judeljo",
        moduleSystem: "es6",
        dynamic: true,
        exoticallyRequired: false,
      },
    ]);
  });

  it("correctly detects a dynamic import statement with a template that has no placeholders", () => {
    expect(
      extractWithSwc("import(`judeljo`).then(judeljo => { judeljo.hochik() })")
    ).to.deep.equal([
      {
        module: "judeljo",
        moduleSystem: "es6",
        dynamic: true,
        exoticallyRequired: false,
      },
    ]);
  });

  it("ignores dynamic import statements with a template that has placeholders", () => {
    expect(
      extractWithSwc(
        // eslint-disable-next-line no-template-curly-in-string
        "import(`judeljo/${vlap}`).then(judeljo => { judeljo.hochik() })"
      )
    ).to.deep.equal([]);
  });

  it("ignores dynamic import statements with a non-string parameter", () => {
    expect(
      extractWithSwc(
        "import(elaborateFunctionCall()).then(judeljo => { judeljo.hochik() })"
      )
    ).to.deep.equal([]);
  });

  it("ignores dynamic import statements without a parameter", () => {
    expect(
      extractWithSwc(
        "import(/* nothing */).then(judeljo => { judeljo.hochik() })"
      )
    ).to.deep.equal([]);
  });
});
