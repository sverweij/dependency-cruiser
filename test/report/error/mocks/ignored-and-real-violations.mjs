export default {
  modules: [],
  summary: {
    violations: [
      {
        from: "test/extract/ast-extractors/typescript2.8-union-types-ast.json",
        to: "test/extract/ast-extractors/typescript2.8-union-types-ast.json",
        rule: {
          severity: "warn",
          name: "no-orphans",
        },
      },
      {
        from: "test/report/baseline/baseline-result.json",
        to: "test/report/baseline/baseline-result.json",
        rule: {
          severity: "ignore",
          name: "no-orphans",
        },
      },
      {
        from: "test/report/baseline/dc-result-no-violations.json",
        to: "test/report/baseline/dc-result-no-violations.json",
        rule: {
          severity: "ignore",
          name: "no-orphans",
        },
      },
      {
        from: "test/report/baseline/dc-result-with-violations.json",
        to: "test/report/baseline/dc-result-with-violations.json",
        rule: {
          severity: "ignore",
          name: "no-orphans",
        },
      },
      {
        from: "test/report/dot/module-level/bare-theme.json",
        to: "test/report/dot/module-level/bare-theme.json",
        rule: {
          severity: "ignore",
          name: "no-orphans",
        },
      },
      {
        from: "src/cli/format.js",
        to: "src/cli/format.js",
        rule: {
          severity: "ignore",
          name: "not-reachable-from-folder-index",
        },
      },
      {
        from: "src/cli/tools/wrap-stream-in-html.js",
        to: "src/cli/tools/wrap-stream-in-html.js",
        rule: {
          severity: "ignore",
          name: "not-reachable-from-folder-index",
        },
      },
      {
        from: "src/cli/validate-node-environment.js",
        to: "src/cli/validate-node-environment.js",
        rule: {
          severity: "ignore",
          name: "not-reachable-from-folder-index",
        },
      },
      {
        from: "src/schema/baseline-violations.schema.js",
        to: "src/schema/baseline-violations.schema.js",
        rule: {
          severity: "ignore",
          name: "not-unreachable-from-cli",
        },
      },
      {
        from: "src/utl/array-util.js",
        to: "src/utl/array-util.js",
        rule: {
          severity: "ignore",
          name: "utl-module-not-shared-enough",
        },
      },
      {
        from: "src/utl/wrap-and-indent.js",
        to: "src/utl/wrap-and-indent.js",
        rule: {
          severity: "ignore",
          name: "utl-module-not-shared-enough",
        },
      },
    ],
    error: 0,
    warn: 1,
    info: 0,
    ignore: 10,
    totalCruised: 454,
    totalDependenciesCruised: 1082,
    optionsUsed: {
      combinedDependencies: false,
      doNotFollow: {
        path: "node_modules",
        dependencyTypes: [
          "npm",
          "npm-dev",
          "npm-optional",
          "npm-peer",
          "npm-bundled",
          "npm-no-pkg",
        ],
      },
      exclude: {
        path: "mocks|fixtures|test/integration|src/cli/tools/svg-in-html-snippets/script.snippet.js",
      },
      externalModuleResolutionStrategy: "node_modules",
      moduleSystems: ["cjs", "es6"],
      outputTo: "-",
      outputType: "json",
      preserveSymlinks: false,
      rulesFile: ".dependency-cruiser.json",
      tsPreCompilationDeps: true,
      exoticRequireStrings: ["tryRequire"],
      enhancedResolveOptions: {
        exportsFields: ["exports"],
        conditionNames: ["require"],
        extensions: [".js", ".d.ts"],
      },
      args: "src bin test configs types tools",
    },
    ruleSetUsed: {
      forbidden: [],
    },
  },
};
