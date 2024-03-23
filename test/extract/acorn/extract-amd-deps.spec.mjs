import { deepEqual } from "node:assert/strict";
import extractAMDDeps from "#extract/acorn/extract-amd-deps.mjs";
import { getASTFromSource } from "#extract/parse/to-javascript-ast.mjs";

const extractAMD = (
  pJavaScriptSource,
  pDependencies,
  pExoticRequireStrings = [],
) =>
  extractAMDDeps(
    getASTFromSource({ source: pJavaScriptSource, extension: ".js" }),
    pDependencies,
    pExoticRequireStrings,
  );

describe("[U] acorn/extract-AMD-deps", () => {
  it("amd define", () => {
    let lDeps = [];

    extractAMD(
      `define(["./root_one", "./root_two"], function(root_one){ /* do stuff */ });`,
      lDeps,
    );
    deepEqual(lDeps, [
      {
        module: "./root_one",
        moduleSystem: "amd",
        dynamic: false,
        exoticallyRequired: false,
        dependencyTypes: ["amd-define"],
      },
      {
        module: "./root_two",
        moduleSystem: "amd",
        dynamic: false,
        exoticallyRequired: false,
        dependencyTypes: ["amd-define"],
      },
    ]);
  });

  it("amd require wrapper", () => {
    let lDeps = [];
    const lInput = `define(function(require, exports, module){
      var one = require('./one-with-require'),
          two = require('./two-with-require');
  });`;

    extractAMD(lInput, lDeps);
    deepEqual(lDeps, [
      {
        module: "./one-with-require",
        moduleSystem: "amd",
        dynamic: false,
        exoticallyRequired: false,
        dependencyTypes: ["amd-require"],
      },
      {
        module: "./two-with-require",
        moduleSystem: "amd",
        dynamic: false,
        exoticallyRequired: false,
        dependencyTypes: ["amd-require"],
      },
    ]);
  });

  it("amd require wrapper with the require parameter named something else", () => {
    let lDeps = [];
    const lInput = `define(function(want, exports, module){
      var one = want('./one-with-want'),
          two = want('./two-with-want');
  });`;

    extractAMD(lInput, lDeps, ["want"]);
    deepEqual(lDeps, [
      {
        module: "./one-with-want",
        moduleSystem: "amd",
        dynamic: false,
        exoticRequire: "want",
        exoticallyRequired: true,
        dependencyTypes: ["amd-exotic-require"],
      },
      {
        module: "./two-with-want",
        moduleSystem: "amd",
        dynamic: false,
        exoticRequire: "want",
        exoticallyRequired: true,
        dependencyTypes: ["amd-exotic-require"],
      },
    ]);
  });
});
