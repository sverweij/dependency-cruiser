import { deepEqual } from "node:assert/strict";
import extractTypescript from "./extract-typescript.utl.mjs";

describe("[U] ast-extractors/extract-typescript - triple slash directives", () => {
  it("path", () => {
    deepEqual(extractTypescript('/// <reference path="./ts-thing" />'), [
      {
        module: "./ts-thing",
        moduleSystem: "tsd",
        dynamic: false,
        exoticallyRequired: false,
      },
    ]);
  });

  it("types", () => {
    deepEqual(extractTypescript('/// <reference types="./ts-thing-types" />'), [
      {
        module: "./ts-thing-types",
        moduleSystem: "tsd",
        dynamic: false,
        exoticallyRequired: false,
      },
    ]);
  });

  it("amd-dependencies", () => {
    deepEqual(
      extractTypescript('/// <amd-dependency path="./ts-thing-types" />'),
      [
        {
          module: "./ts-thing-types",
          moduleSystem: "tsd",
          dynamic: false,
          exoticallyRequired: false,
        },
      ],
    );
  });
});
