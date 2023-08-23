import { deepEqual } from "node:assert/strict";
import nullReporter from "../../../src/report/null.mjs";

const gSmallOKResult = {
  modules: [
    {
      source: "lonely.js",
      dependencies: [],
      dependents: [],
      orphan: true,
      valid: true,
    },
  ],
  summary: {
    violations: [],
    error: 0,
    warn: 0,
    info: 0,
    ignore: 0,
    totalCruised: 1,
    totalDependenciesCruised: 0,
    optionsUsed: {
      baseDir: "/Users/sander/prg/js/dependency-cruiser",
      combinedDependencies: false,
      exoticRequireStrings: [],
      externalModuleResolutionStrategy: "node_modules",
      metrics: false,
      moduleSystems: ["es6", "cjs", "tsd", "amd"],
      outputTo: "-",
      outputType: "null",
      preserveSymlinks: false,
      tsPreCompilationDeps: false,
      args: "lonely.js",
    },
  },
};

const gSmallNOKResult = {
  modules: [
    {
      source: "lonely.js",
      dependencies: [],
      dependents: [],
      orphan: true,
      valid: true,
    },
  ],
  summary: {
    violations: [],
    error: 3,
    warn: 0,
    info: 0,
    ignore: 0,
    totalCruised: 1,
    totalDependenciesCruised: 0,
    optionsUsed: {
      baseDir: "/Users/sander/prg/js/dependency-cruiser",
      combinedDependencies: false,
      exoticRequireStrings: [],
      externalModuleResolutionStrategy: "node_modules",
      metrics: false,
      moduleSystems: ["es6", "cjs", "tsd", "amd"],
      outputTo: "-",
      outputType: "null",
      preserveSymlinks: false,
      tsPreCompilationDeps: false,
      args: "lonely.js",
    },
  },
};

describe("[I] report/null", () => {
  it("happy day no errors", () => {
    const lResult = nullReporter(gSmallOKResult);
    deepEqual(lResult, {
      output: "",
      exitCode: 0,
    });
  });
  it("happy day some errors", () => {
    const lResult = nullReporter(gSmallNOKResult);
    deepEqual(lResult, {
      output: "",
      exitCode: 3,
    });
  });
});
