import { deepEqual } from "node:assert/strict";
import extractTypescript from "./extract-typescript.utl.mjs";

describe("[U] ast-extractors/extract-typescript - re-exports", () => {
  it("extracts 're-export everything'", () => {
    deepEqual(extractTypescript("export * from './ts-thing';"), [
      {
        module: "./ts-thing",
        moduleSystem: "es6",
        dynamic: false,
        exoticallyRequired: false,
      },
    ]);
  });

  it("extracts 're-export and rename a thing from a re-export'", () => {
    deepEqual(
      extractTypescript(
        "export { ReExport as RenamedReExport } from './ts-thing'",
      ),
      [
        {
          module: "./ts-thing",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
        },
      ],
    );
  });

  it("leaves exports that are not re-exports alone", () => {
    deepEqual(extractTypescript("export { ReExport as RenamedReExport };"), []);
  });

  it("extracts re-export under a different name (typescript 3.8+, ecmascript 2020)", () => {
    deepEqual(extractTypescript("export * as woehahaha from './damodule'"), [
      {
        module: "./damodule",
        moduleSystem: "es6",
        dynamic: false,
        exoticallyRequired: false,
      },
    ]);
  });
});
