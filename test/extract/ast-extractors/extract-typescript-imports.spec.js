const expect = require("chai").expect;
const extractTypescript = require("./extract-typescript.utl");

describe("ast-extractors/extract-typescript - regular imports", () => {
  it("extracts 'import for side effects only'", () => {
    expect(
      extractTypescript("import './import-for-side-effects';")
    ).to.deep.equal([
      {
        moduleName: "./import-for-side-effects",
        moduleSystem: "es6",
        dynamic: false
      }
    ]);
  });

  it("extracts 'import some stuff only'", () => {
    expect(
      extractTypescript("import { SomeSingleExport } from './ts-thing';")
    ).to.deep.equal([
      {
        moduleName: "./ts-thing",
        moduleSystem: "es6",
        dynamic: false
      }
    ]);
  });

  it("extracts 'import some stuff only and rename that'", () => {
    expect(
      extractTypescript(
        "import { SomeSingleExport as RenamedSingleExport } from './ts-thing';"
      )
    ).to.deep.equal([
      {
        moduleName: "./ts-thing",
        moduleSystem: "es6",
        dynamic: false
      }
    ]);
  });

  it("extracts 'import everything into a variable'", () => {
    expect(
      extractTypescript(
        "import * as entireTsOtherThingAsVariable from './ts-thing';"
      )
    ).to.deep.equal([
      {
        moduleName: "./ts-thing",
        moduleSystem: "es6",
        dynamic: false
      }
    ]);
  });

  it("extracts type imports in const declarations", () => {
    expect(
      extractTypescript("const tiepetjes: import('./types').T;")
    ).to.deep.equal([
      {
        moduleName: "./types",
        moduleSystem: "es6",
        dynamic: false
      }
    ]);
  });

  it("extracts type imports in const declarations (template literal argument)", () => {
    expect(
      extractTypescript("const tiepetjes: import(`./types`).T;")
    ).to.deep.equal([
      {
        moduleName: "./types",
        moduleSystem: "es6",
        dynamic: false
      }
    ]);
  });

  it("extracts type imports in parameter declarations", () => {
    expect(
      extractTypescript(
        "function f(snort: import('./vypes').T){console.log(snort.bla)}"
      )
    ).to.deep.equal([
      {
        moduleName: "./vypes",
        moduleSystem: "es6",
        dynamic: false
      }
    ]);
  });

  it("extracts type imports in class members", () => {
    expect(
      extractTypescript(
        "class Klass{ private membert: import('./wypes').T); constructor() { membert = 'x'}}"
      )
    ).to.deep.equal([
      {
        moduleName: "./wypes",
        moduleSystem: "es6",
        dynamic: false
      }
    ]);
  });

  it("leaves type imports with template literals with placeholders alone", () => {
    expect(
      // typescript/lib/protocol.d.ts has this thing
      extractTypescript("const tiepetjes: import(`./types/${lalala()}`).T;")
    ).to.deep.equal([]);
  });

  it("leaves 'import equals' of variables alone", () => {
    expect(
      // typescript/lib/protocol.d.ts has this thing
      extractTypescript("import protocol = ts.server.protocol")
    ).to.deep.equal([]);
  });
});
