import { expect } from "chai";
import extractTypescript from "./extract-typescript.utl.mjs";

describe("[U] ast-extractors/extract-typescript - re-exports", () => {
  it("extracts 're-export everything'", () => {
    expect(extractTypescript("export * from './ts-thing';")).to.deep.equal([
      {
        module: "./ts-thing",
        moduleSystem: "es6",
        dynamic: false,
        exoticallyRequired: false,
      },
    ]);
  });

  it("extracts 're-export and rename a thing from a re-export'", () => {
    expect(
      extractTypescript(
        "export { ReExport as RenamedReExport } from './ts-thing'"
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

  it("leaves exports that are not re-exports alone", () => {
    expect(
      extractTypescript("export { ReExport as RenamedReExport };")
    ).to.deep.equal([]);
  });

  it("extracts re-export under a different name (typescript 3.8+, ecmascript 2020)", () => {
    expect(
      extractTypescript("export * as woehahaha from './damodule'")
    ).to.deep.equal([
      {
        module: "./damodule",
        moduleSystem: "es6",
        dynamic: false,
        exoticallyRequired: false,
      },
    ]);
  });
});
