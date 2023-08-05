import { deepStrictEqual } from "node:assert";
import extractTypescript from "./extract-typescript.utl.mjs";

describe("[U] ast-extractors/extract-typescript - triple slash directives", () => {
  it("path", () => {
    deepStrictEqual(extractTypescript('/// <reference path="./ts-thing" />'), [
      {
        module: "./ts-thing",
        moduleSystem: "tsd",
        dynamic: false,
        exoticallyRequired: false,
      },
    ]);
  });

  it("types", () => {
    deepStrictEqual(
      extractTypescript('/// <reference types="./ts-thing-types" />'),
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

  it("amd-dependencies", () => {
    deepStrictEqual(
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
