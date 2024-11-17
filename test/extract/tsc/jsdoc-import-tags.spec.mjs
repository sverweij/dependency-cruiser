import { deepEqual } from "node:assert/strict";
import extractTypescript from "./extract-typescript.utl.mjs";

describe("[U] ast-extractors/extract-typescript - jsdoc @imports", () => {
  it("extracts jsdoc @import ('as' variant)", () => {
    deepEqual(extractTypescript("/** @import * as fs from 'node:fs' */"), [
      {
        module: "node:fs",
        moduleSystem: "es6",
        dynamic: false,
        exoticallyRequired: false,
        dependencyTypes: ["type-only", "import", "jsdoc", "jsdoc-import-tag"],
      },
    ]);
  });

  it("extracts jsdoc @import ('qualified' variant)", () => {
    deepEqual(
      extractTypescript("/** @import {thing, thang} from './hello.mjs' */"),
      [
        {
          module: "./hello.mjs",
          moduleSystem: "es6",
          dynamic: false,
          exoticallyRequired: false,
          dependencyTypes: ["type-only", "import", "jsdoc", "jsdoc-import-tag"],
        },
      ],
    );
  });

  it("extracts jsdoc @import ('default import' variant)", () => {
    deepEqual(extractTypescript("/** @import thing from './hello.mjs' */"), [
      {
        module: "./hello.mjs",
        moduleSystem: "es6",
        dynamic: false,
        exoticallyRequired: false,
        dependencyTypes: ["type-only", "import", "jsdoc", "jsdoc-import-tag"],
      },
    ]);
  });

  it("does not extract imports where the module name isn't a string (identifier variant) ", () => {
    deepEqual(
      extractTypescript("/** @import {thing} from anIdentifier */"),
      [],
    );
  });

  it("does not extract imports where the module name isn't a string (number variant) ", () => {
    deepEqual(extractTypescript("/** @import {thing} from 481 */"), []);
  });

  it("does not extract imports where the module name isn't a string (boolean variant) ", () => {
    deepEqual(extractTypescript("/** @import {thing} from true */"), []);
  });

  it("does not extract imports where the module name isn't a string (nothing variant) ", () => {
    deepEqual(extractTypescript("/** @import {thing} from  */"), []);
  });

  it("does not extract imports with dynamic looking imports (@import {import('./ting.mjs')})", () => {
    deepEqual(
      extractTypescript("/** @import {import('./thing.mjs').thing} */"),
      [],
    );
  });

  it("does not extract imports with dynamic looking imports (@type {import('./ting.mjs')})", () => {
    deepEqual(
      extractTypescript("/** @type {import('./thing.mjs').thing} */"),
      [],
    );
  });
});
