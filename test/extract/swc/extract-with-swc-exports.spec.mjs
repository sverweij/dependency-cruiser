import { deepEqual } from "node:assert/strict";
import extractWithSwc from "./extract-with-swc.utl.mjs";

describe("[U] extract/swc - re-exports", () => {
  it("extracts 're-export everything'", () => {
    deepEqual(extractWithSwc("export * from './ts-thing';"), [
      {
        module: "./ts-thing",
        moduleSystem: "es6",
        dynamic: false,
        exoticallyRequired: false,
        dependencyTypes: ["export"],
      },
    ]);
  });

  it("extracts 're-export and rename a thing from a re-export'", () => {
    deepEqual(
      extractWithSwc(
        "export { ReExport as RenamedReExport } from './ts-thing'",
      ),
      [
        {
          module: "./ts-thing",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: ["export"],
        },
      ],
    );
  });

  it("leaves exports that are not re-exports alone", () => {
    deepEqual(extractWithSwc("export { ReExport as RenamedReExport };"), []);
  });

  it("extracts re-export under a different name (typescript 3.8+, ecmascript 2020)", () => {
    deepEqual(extractWithSwc("export * as woehahaha from './damodule'"), [
      {
        module: "./damodule",
        moduleSystem: "es6",
        dynamic: false,
        exoticallyRequired: false,
        dependencyTypes: ["export"],
      },
    ]);
  });

  it("extracts type-only re-exports (typescript 3.8+)", () => {
    deepEqual(extractWithSwc("export type { SomeType } from './some-module'"), [
      {
        module: "./some-module",
        moduleSystem: "es6",
        dynamic: false,
        exoticallyRequired: false,
        dependencyTypes: ["export", "type-only"],
      },
    ]);
  });

  it("extracts re-exports whose specifiers are all type-only (typescript 4.5+)", () => {
    deepEqual(
      extractWithSwc(
        "export { type SomeType, type SomeOtherType } from './some-module'",
      ),
      [
        {
          module: "./some-module",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: ["export", "type-only"],
        },
      ],
    );
  });

  it("extracts re-exports with mixed type-only and value specifiers as runtime exports (typescript 4.5+)", () => {
    deepEqual(
      extractWithSwc(
        "export { type SomeType, SomeValue } from './some-module'",
      ),
      [
        {
          module: "./some-module",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: ["export"],
        },
      ],
    );
  });
});
