const expect = require("chai").expect;
const extractTypescript = require("./extract-typescript.utl");

describe("ast-extractors/extract-typescript - dynamic imports", () => {
  it("correctly detects a dynamic import statement", () => {
    expect(
      extractTypescript(
        "import('judeljo').then(judeljo => { judeljo.hochik() }"
      )
    ).to.deep.equal([
      {
        moduleName: "judeljo",
        moduleSystem: "es6",
        dynamic: true
      }
    ]);
  });

  it("correctly detects a dynamic import statement with a template that has no placeholders", () => {
    expect(
      extractTypescript(
        "import(`judeljo`).then(judeljo => { judeljo.hochik() }"
      )
    ).to.deep.equal([
      {
        moduleName: "judeljo",
        moduleSystem: "es6",
        dynamic: true
      }
    ]);
  });

  it("ignores dynamic import statements with a template that has placeholders", () => {
    expect(
      extractTypescript(
        "import(`judeljo/${vlap}`).then(judeljo => { judeljo.hochik() }"
      )
    ).to.deep.equal([]);
  });

  it("ignores dynamic import statements with a non-string parameter", () => {
    expect(
      extractTypescript(
        "import(elaborateFunctionCall()).then(judeljo => { judeljo.hochik() }"
      )
    ).to.deep.equal([]);
  });

  it("ignores dynamic import statements without a parameter", () => {
    expect(
      extractTypescript(
        "import(/* nothing */).then(judeljo => { judeljo.hochik() }"
      )
    ).to.deep.equal([]);
  });
});
