const expect = require("chai").expect;
const extractTypescript = require("./extract-typescript.utl");

describe("ast-extractors/extract-typescript - triple slash directives", () => {
  it("path", () => {
    expect(
      extractTypescript('/// <reference path="./ts-thing" />')
    ).to.deep.equal([
      {
        module: "./ts-thing",
        moduleSystem: "tsd",
        dynamic: false,
        exoticallyRequired: false,
      },
    ]);
  });

  it("types", () => {
    expect(
      extractTypescript('/// <reference types="./ts-thing-types" />')
    ).to.deep.equal([
      {
        module: "./ts-thing-types",
        moduleSystem: "tsd",
        dynamic: false,
        exoticallyRequired: false,
      },
    ]);
  });

  it("amd-dependencies", () => {
    expect(
      extractTypescript('/// <amd-dependency path="./ts-thing-types" />')
    ).to.deep.equal([
      {
        module: "./ts-thing-types",
        moduleSystem: "tsd",
        dynamic: false,
        exoticallyRequired: false,
      },
    ]);
  });
});
