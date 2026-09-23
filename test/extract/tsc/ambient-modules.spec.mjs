import { deepEqual } from "node:assert/strict";
import extractTypeScriptDependencies from "#extract/tsc/extract-typescript-deps.mjs";
import extractTypescript from "./extract-typescript.utl.mjs";

describe("[U] ast-extractors/extract-typescript - ambient module declarations", () => {
  it("extracts imports from inside a 'declare module' block", () => {
    deepEqual(
      extractTypescript(
        `declare module "some-package" {
           import { Thing } from "another-package";
           export { Thing };
         }`,
        [],
        false,
        false,
        true,
      ),
      [
        {
          module: "another-package",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: ["import"],
        },
      ],
    );
  });

  it("extracts re-exports from inside a 'declare module' block", () => {
    deepEqual(
      extractTypescript(
        `declare module "some-package" {
           export * from "reexported-package";
         }`,
        [],
        false,
        false,
        true,
      ),
      [
        {
          module: "reexported-package",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: ["export"],
        },
      ],
    );
  });

  it("extracts import equals from inside a 'declare module' block", () => {
    deepEqual(
      extractTypescript(
        `declare module "some-package" {
           import legacy = require("legacy-package");
           export { legacy };
         }`,
        [],
        false,
        false,
        true,
      ),
      [
        {
          module: "legacy-package",
          moduleSystem: "cjs",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: ["import-equals"],
        },
      ],
    );
  });

  it("extracts type only imports from inside a 'declare module' block", () => {
    deepEqual(
      extractTypescript(
        `declare module "some-package" {
           import type { Thing } from "another-package";
           export type { Thing };
         }`,
        [],
        false,
        false,
        true,
      ),
      [
        {
          module: "another-package",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: ["type-only", "import"],
        },
      ],
    );
  });

  it("extracts imports from inside a nested module block", () => {
    deepEqual(
      extractTypescript(
        `declare namespace Outer {
           namespace Inner {
             import legacy = require("legacy-package");
           }
         }`,
        [],
        false,
        false,
        true,
      ),
      [
        {
          module: "legacy-package",
          moduleSystem: "cjs",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: ["import-equals"],
        },
      ],
    );
  });

  it("extracts imports from inside a qualified namespace", () => {
    // `declare namespace A.B {}` is a ModuleDeclaration whose body is another
    // ModuleDeclaration, so only the innermost one carries the block.
    deepEqual(
      extractTypescript(
        `declare namespace Outer.Inner {
           import legacy = require("legacy-package");
         }`,
        [],
        false,
        false,
        true,
      ),
      [
        {
          module: "legacy-package",
          moduleSystem: "cjs",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: ["import-equals"],
        },
      ],
    );
  });

  it("leaves a module declaration without a block alone", () => {
    deepEqual(
      extractTypescript(
        `declare module "some-package";`,
        [],
        false,
        false,
        true,
      ),
      [],
    );
  });

  it("handles ASTs without statements when ambient module detection is enabled", () => {
    deepEqual(
      extractTypeScriptDependencies(
        {
          statements: null,
          referencedFiles: [],
          typeReferenceDirectives: [],
          amdDependencies: [],
        },
        [],
        false,
        false,
        true,
      ),
      [],
    );
  });
});
