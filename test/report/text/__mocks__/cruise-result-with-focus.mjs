export default {
  modules: [
    {
      source: "src/main/rule-set/normalize.js",
      dependencies: [
        {
          dynamic: false,
          module: "../utl/normalize-re-properties",
          moduleSystem: "cjs",
          exoticallyRequired: false,
          resolved: "src/main/utl/normalize-re-properties.js",
          coreModule: false,
          followable: true,
          couldNotResolve: false,
          dependencyTypes: ["local"],
          matchesDoNotFollow: false,
          circular: false,
          valid: true,
        },
        {
          dynamic: false,
          module: "lodash/cloneDeep",
          moduleSystem: "cjs",
          exoticallyRequired: false,
          resolved: "node_modules/lodash/cloneDeep.js",
          coreModule: false,
          followable: false,
          couldNotResolve: false,
          license: "MIT",
          dependencyTypes: ["npm"],
          matchesDoNotFollow: true,
          circular: false,
          valid: true,
        },
        {
          dynamic: false,
          module: "lodash/has",
          moduleSystem: "cjs",
          exoticallyRequired: false,
          resolved: "node_modules/lodash/has.js",
          coreModule: false,
          followable: false,
          couldNotResolve: false,
          license: "MIT",
          dependencyTypes: ["npm"],
          matchesDoNotFollow: true,
          circular: false,
          valid: true,
        },
      ],
      dependents: [
        "src/main/index.js",
        "test/enrich/derive/reachable/index.spec.mjs",
        "test/main/rule-set/normalize.spec.mjs",
        "test/validate/parse-ruleset.utl.mjs",
      ],
      orphan: false,
      reachable: [
        {
          value: true,
          asDefinedInRule: "not-unreachable-from-cli",
          matchedFrom: "bin/depcruise-baseline.js",
        },
        {
          value: true,
          asDefinedInRule: "not-unreachable-from-test",
          matchedFrom: "test/api.spec.mjs",
        },
        {
          value: true,
          asDefinedInRule: "not-reachable-from-folder-index",
          matchedFrom: "src/main/index.js",
        },
      ],
      matchesFocus: true,
      valid: true,
    },
    {
      source: "src/main/index.js",
      dependencies: [
        {
          dynamic: false,
          module: "./rule-set/normalize",
          moduleSystem: "cjs",
          exoticallyRequired: false,
          resolved: "src/main/rule-set/normalize.js",
          coreModule: false,
          followable: true,
          couldNotResolve: false,
          dependencyTypes: ["local"],
          matchesDoNotFollow: false,
          circular: false,
          valid: true,
        },
      ],
      dependents: [
        "src/cli/index.js",
        "src/cli/format-meta-info.js",
        "src/cli/format.js",
        "test/api.spec.cjs",
        "test/api.spec.mjs",
        "test/main/main.cruise-reporterless.spec.mjs",
        "test/main/main.cruise.dynamic-imports.spec.mjs",
        "test/main/main.cruise.reachable-integration.spec.mjs",
        "test/main/main.cruise.spec.mjs",
        "test/main/main.cruise.ts-pre-compilation-deps.spec.mjs",
        "test/main/main.cruise.type-only-imports.spec.mjs",
        "test/main/main.cruise.type-only-module-references.spec.mjs",
        "test/main/main.format.spec.mjs",
      ],
      orphan: false,
      reachable: [
        {
          value: true,
          asDefinedInRule: "not-unreachable-from-cli",
          matchedFrom: "bin/depcruise-baseline.js",
        },
        {
          value: true,
          asDefinedInRule: "not-unreachable-from-test",
          matchedFrom: "test/api.spec.mjs",
        },
      ],
      matchesFocus: false,
      valid: true,
    },
    {
      source: "test/enrich/derive/reachable/index.spec.mjs",
      dependencies: [
        {
          dynamic: false,
          module: "../../../../src/main/rule-set/normalize.js",
          moduleSystem: "es6",
          exoticallyRequired: false,
          resolved: "src/main/rule-set/normalize.js",
          coreModule: false,
          followable: true,
          couldNotResolve: false,
          dependencyTypes: ["local"],
          matchesDoNotFollow: false,
          circular: false,
          valid: true,
        },
      ],
      dependents: [],
      orphan: false,
      matchesFocus: false,
      valid: true,
    },
    {
      source: "test/main/rule-set/normalize.spec.mjs",
      dependencies: [
        {
          dynamic: false,
          module: "../../../src/main/rule-set/normalize.js",
          moduleSystem: "es6",
          exoticallyRequired: false,
          resolved: "src/main/rule-set/normalize.js",
          coreModule: false,
          followable: true,
          couldNotResolve: false,
          dependencyTypes: ["local"],
          matchesDoNotFollow: false,
          circular: false,
          valid: true,
        },
      ],
      dependents: [],
      orphan: false,
      matchesFocus: false,
      valid: true,
    },
    {
      source: "test/validate/parse-ruleset.utl.mjs",
      dependencies: [
        {
          dynamic: false,
          module: "../../src/main/rule-set/normalize.js",
          moduleSystem: "es6",
          exoticallyRequired: false,
          resolved: "src/main/rule-set/normalize.js",
          coreModule: false,
          followable: true,
          couldNotResolve: false,
          dependencyTypes: ["local"],
          matchesDoNotFollow: false,
          circular: false,
          valid: true,
        },
      ],
      dependents: [
        "test/validate/index.core.spec.mjs",
        "test/validate/index.could-not-resolve.spec.mjs",
        "test/validate/index.cycle-via-not.spec.mjs",
        "test/validate/index.cycle-via-some-not.spec.mjs",
        "test/validate/index.cycle-via.spec.mjs",
        "test/validate/index.exotic-require.spec.mjs",
        "test/validate/index.groupmatching.spec.mjs",
        "test/validate/index.license.spec.mjs",
        "test/validate/index.more-than-one-dependency-type.spec.mjs",
        "test/validate/index.more-unstable.spec.mjs",
        "test/validate/index.orphans.spec.mjs",
        "test/validate/index.pre-compilation-only.spec.mjs",
        "test/validate/index.reachable.spec.mjs",
        "test/validate/index.required-rules.spec.mjs",
        "test/validate/index.spec.mjs",
        "test/validate/index.type-only.spec.mjs",
      ],
      orphan: false,
      matchesFocus: false,
      valid: true,
    },
    {
      source: "node_modules/lodash/has.js",
      followable: false,
      coreModule: false,
      couldNotResolve: false,
      matchesDoNotFollow: true,
      dependencyTypes: ["npm"],
      dependencies: [],
      dependents: [
        "src/config-utl/extract-babel-config.js",
        "src/validate/index.js",
        "src/validate/matchers.js",
        "src/validate/rule-classifiers.js",
        "src/validate/match-module-rule.js",
        "src/enrich/derive/reachable/index.js",
        "src/enrich/summarize/summarize-folders.js",
        "src/graph-utl/rule-set.js",
        "src/enrich/summarize/summarize-modules.js",
        "src/enrich/summarize/summarize-options.js",
        "src/extract/index.js",
        "src/extract/resolve/external-module-helpers.js",
        "src/extract/resolve/determine-dependency-types.js",
        "src/main/options/normalize.js",
        "src/main/utl/normalize-re-properties.js",
        "src/main/options/validate.js",
        "src/report/anon/index.js",
        "src/report/dot/module-utl.js",
        "src/report/dot/theming.js",
        "src/report/error-html/utl.js",
        "src/report/plugins/index.js",
        "src/main/report-wrap.js",
        "src/main/resolve-options/normalize.js",
        "src/main/rule-set/normalize.js",
        "src/main/rule-set/validate.js",
        "src/cli/init-config/environment-helpers.js",
        "src/cli/init-config/normalize-init-options.js",
        "src/cli/normalize-cli-options.js",
        "src/config-utl/extract-depcruise-config/index.js",
        "test/extract/resolve/external-module-helpers.spec.mjs",
      ],
      orphan: false,
      matchesFocus: false,
      valid: true,
    },
    {
      source: "src/main/utl/normalize-re-properties.js",
      dependencies: [],
      dependents: [
        "src/main/options/normalize.js",
        "src/main/rule-set/normalize.js",
        "test/main/utl/normalize-re-properties.spec.mjs",
      ],
      orphan: false,
      reachable: [
        {
          value: true,
          asDefinedInRule: "not-unreachable-from-cli",
          matchedFrom: "bin/depcruise-baseline.js",
        },
        {
          value: true,
          asDefinedInRule: "not-unreachable-from-test",
          matchedFrom: "test/api.spec.mjs",
        },
        {
          value: true,
          asDefinedInRule: "not-reachable-from-folder-index",
          matchedFrom: "src/main/index.js",
        },
      ],
      matchesFocus: false,
      valid: true,
    },
    {
      source: "node_modules/lodash/cloneDeep.js",
      followable: false,
      coreModule: false,
      couldNotResolve: false,
      matchesDoNotFollow: true,
      dependencyTypes: ["npm"],
      dependencies: [],
      dependents: [
        "src/main/utl/normalize-re-properties.js",
        "src/report/dot/theming.js",
        "src/main/rule-set/normalize.js",
        "test/report/dot/theming.spec.mjs",
      ],
      orphan: false,
      matchesFocus: false,
      valid: true,
    },
  ],
  summary: {
    violations: [],
    error: 0,
    warn: 0,
    info: 0,
    ignore: 0,
    totalCruised: 8,
    totalDependenciesCruised: 7,
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
      focus: {
        path: "^src/main/rule-set/normalize.js",
      },
      knownViolations: [
        {
          type: "module",
          from: "test/extract/ast-extractors/typescript2.8-union-types-ast.json",
          to: "test/extract/ast-extractors/typescript2.8-union-types-ast.json",
          rule: {
            severity: "error",
            name: "no-orphans",
          },
        },
        {
          type: "module",
          from: "src/schema/baseline-violations.schema.js",
          to: "src/schema/baseline-violations.schema.js",
          rule: {
            severity: "error",
            name: "not-unreachable-from-cli",
          },
        },
        {
          type: "module",
          from: "src/cli/format.js",
          to: "src/cli/format.js",
          rule: {
            severity: "info",
            name: "not-reachable-from-folder-index",
          },
        },
        {
          type: "module",
          from: "src/cli/tools/wrap-stream-in-html.js",
          to: "src/cli/tools/wrap-stream-in-html.js",
          rule: {
            severity: "info",
            name: "not-reachable-from-folder-index",
          },
        },
        {
          type: "module",
          from: "src/cli/validate-node-environment.js",
          to: "src/cli/validate-node-environment.js",
          rule: {
            severity: "info",
            name: "not-reachable-from-folder-index",
          },
        },
        {
          type: "module",
          from: "src/utl/array-util.js",
          to: "src/utl/array-util.js",
          rule: {
            severity: "info",
            name: "utl-module-not-shared-enough",
          },
        },
        {
          type: "module",
          from: "src/utl/wrap-and-indent.js",
          to: "src/utl/wrap-and-indent.js",
          rule: {
            severity: "info",
            name: "utl-module-not-shared-enough",
          },
        },
      ],
      moduleSystems: ["cjs", "es6"],
      outputTo: "-",
      outputType: "json",
      prefix: "https://github.com/sverweij/dependency-cruiser/blob/develop/",
      preserveSymlinks: false,
      rulesFile: ".dependency-cruiser.json",
      tsPreCompilationDeps: true,
      exoticRequireStrings: ["tryRequire", "requireJSON"],
      reporterOptions: {
        archi: {
          collapsePattern: "^(src|test)/[^/]+|^bin/|node_modules/[^/]+",
        },
        dot: {
          collapsePattern: "^src/report/[^/]+|^src/enrich/derive/[^/]+",
          filters: {
            includeOnly: {
              path: "^(src|bin)",
            },
            exclude: {
              path: "^src/meta\\.js$|^src/utl/bus.+",
            },
          },
          theme: {
            replace: false,
            graph: {
              splines: "ortho",
            },
            modules: [
              {
                criteria: {
                  matchesFocus: true,
                },
                attributes: {
                  fillcolor: "lime",
                  penwidth: 2,
                },
              },
              {
                criteria: {
                  matchesFocus: false,
                },
                attributes: {
                  fillcolor: "lightgrey",
                },
              },
              {
                criteria: {
                  source: "^src/cli",
                },
                attributes: {
                  fillcolor: "#ccccff",
                },
              },
              {
                criteria: {
                  source: "^src/config-utl",
                },
                attributes: {
                  fillcolor: "#99ffff",
                },
              },
              {
                criteria: {
                  source: "^src/report",
                },
                attributes: {
                  fillcolor: "#ffccff",
                },
              },
              {
                criteria: {
                  source: "^src/extract",
                },
                attributes: {
                  fillcolor: "#ccffcc",
                },
              },
              {
                criteria: {
                  source: "^src/enrich",
                },
                attributes: {
                  fillcolor: "#77eeaa",
                },
              },
              {
                criteria: {
                  source: "^src/validate",
                },
                attributes: {
                  fillcolor: "#ccccff",
                },
              },
              {
                criteria: {
                  source: "^src/main",
                },
                attributes: {
                  fillcolor: "#ffcccc",
                },
              },
              {
                criteria: {
                  source: "^src/utl",
                },
                attributes: {
                  fillcolor: "#cccccc",
                },
              },
              {
                criteria: {
                  source: "^src/graph-utl",
                },
                attributes: {
                  fillcolor: "#ffcccc",
                },
              },
              {
                criteria: {
                  source: "^src/meta\\.js$|\\.template\\.js$|\\.schema\\.js$",
                },
                attributes: {
                  style: "filled",
                },
              },
              {
                criteria: {
                  source: "\\.json$",
                },
                attributes: {
                  shape: "cylinder",
                },
              },
            ],
            dependencies: [
              {
                criteria: {
                  "rules[0].severity": "error",
                },
                attributes: {
                  fontcolor: "red",
                  color: "red",
                },
              },
              {
                criteria: {
                  "rules[0].severity": "warn",
                },
                attributes: {
                  fontcolor: "orange",
                  color: "orange",
                },
              },
              {
                criteria: {
                  "rules[0].severity": "info",
                },
                attributes: {
                  fontcolor: "blue",
                  color: "blue",
                },
              },
              {
                criteria: {
                  valid: false,
                },
                attributes: {
                  fontcolor: "red",
                  color: "red",
                },
              },
              {
                criteria: {
                  resolved: "^src/cli",
                },
                attributes: {
                  color: "#0000ff77",
                },
              },
              {
                criteria: {
                  resolved: "^src/config-utl",
                },
                attributes: {
                  color: "#22999977",
                },
              },
              {
                criteria: {
                  resolved: "^src/report",
                },
                attributes: {
                  color: "#ff00ff77",
                },
              },
              {
                criteria: {
                  resolved: "^src/extract",
                },
                attributes: {
                  color: "#00770077",
                },
              },
              {
                criteria: {
                  resolved: "^src/enrich",
                },
                attributes: {
                  color: "#00776677",
                },
              },
              {
                criteria: {
                  resolved: "^src/validate",
                },
                attributes: {
                  color: "#0000ff77",
                },
              },
              {
                criteria: {
                  resolved: "^src/main",
                },
                attributes: {
                  color: "#77000077",
                },
              },
              {
                criteria: {
                  resolved: "^src/utl",
                },
                attributes: {
                  color: "#aaaaaa77",
                },
              },
              {
                criteria: {
                  resolved: "^src/graph-utl",
                },
                attributes: {
                  color: "#77000077",
                },
              },
            ],
          },
        },
        metrics: {
          orderBy: "name",
          hideModules: true,
          hideFolders: false,
        },
        anon: {
          wordlist: [
            "aap",
            "noot",
            "mies",
            "wim",
            "zus",
            "jet",
            "teun",
            "vuur",
            "gijs",
            "lam",
            "kees",
            "bok",
            "weide",
            "does",
            "hok",
            "duif",
            "schapen",
          ],
        },
      },
      enhancedResolveOptions: {
        exportsFields: ["exports"],
        conditionNames: ["require"],
        extensions: [".js", ".d.ts"],
      },
      args: "src bin test configs types tools",
    },
    ruleSetUsed: {
      forbidden: [
        {
          name: "not-to-unresolvable",
          comment:
            "This module tried to depend on something that can't be resolved to disk. Revise yer code",
          severity: "error",
          from: {},
          to: {
            couldNotResolve: true,
            exoticallyRequired: false,
          },
          scope: "module",
        },
        {
          name: "no-orphans",
          comment:
            "This is an orphan module - it's likely not used (anymore?). Either use it or remove it. If it's logical this module is an orphan (i.e. it's a config file), add an exception for it in your dependency-cruiser configuration. By default this rule does not scrutinize dotfiles (e.g. .eslintrc.js), TypeScript declaration files (.d.ts), tsconfig.json and some of the babel and webpack configs.",
          severity: "error",
          from: {
            orphan: true,
            pathNot:
              "(^|/)\\.[^/]+\\.(js|cjs|mjs|ts|json)$|\\.d\\.ts$|(^|/)tsconfig\\.json$|(^|/)(babel|webpack)\\.config\\.(js|cjs|mjs|ts|json)$|-reporter-plugin\\.js$|\\.schema\\.json$",
          },
          to: {},
          scope: "module",
        },
        {
          name: "cli-to-main-only",
          comment:
            "This cli module depends on something not in the public interface - which means it either doesn't belong in cli, or the main public interface needs to be expanded.",
          severity: "error",
          from: {
            path: "(^src/cli/)",
          },
          to: {
            pathNot:
              "^src/(main|utl|config-utl)/|^node_modules|^\\.yarn/cache|^fs$|^path$|$1|^src/meta.js$",
          },
          scope: "module",
        },
        {
          name: "report-stays-in-report",
          comment:
            "This reporting module depends directly on a non-reporting one that is not a utility. That is odd as reporting modules should only read dependency cruiser output json.",
          severity: "error",
          from: {
            path: "(^src/report/)",
          },
          to: {
            pathNot:
              "$1|^node_modules|^\\.yarn/cache|^os$|^path$|^src/meta\\.js$|^src/graph-utl|^src/utl",
          },
          scope: "module",
        },
        {
          name: "extract-to-utl-only",
          comment:
            "This extraction module depends on something outside extraction that is not a utility. Which is odd, given the goal of the extraction step.",
          severity: "error",
          from: {
            path: "(^src/extract/)",
          },
          to: {
            pathNot:
              "$1|^node_modules|^\\.yarn/cache|^(path|fs|module|os)$|^src/meta\\.js$|^src/graph-utl|^src/utl",
            exoticallyRequired: false,
          },
          scope: "module",
        },
        {
          name: "not-to-json",
          comment:
            "We don't want to depende on .json modules as long as they're still impractical to work with in ecmascript modules",
          from: {
            path: "^src/",
          },
          to: {
            path: "\\.json$",
          },
          severity: "warn",
          scope: "module",
        },
        {
          name: "bin-to-cli-only",
          comment:
            "This module in the bin/ folder depends on something not in the cli interface. This means it either contains code that doesn't belong in bin/, or the thing it depends upon should be put in the cli interface. ",
          severity: "error",
          from: {
            path: "(^bin/)",
          },
          to: {
            pathNot: "^src/cli|^node_modules|^\\.yarn/cache|^src/meta\\.js$",
          },
          scope: "module",
        },
        {
          name: "restrict-fs-access",
          comment:
            "This module depends on a the node 'fs' module, and it resides in a spot where that is not allowed.",
          severity: "error",
          from: {
            pathNot:
              "^src/(main/resolve-options/normalize\\.js|extract/parse|extract/resolve|extract/gather-initial-sources\\.js|config-utl|cli)|^test|^tools",
          },
          to: {
            path: "^fs$",
          },
          scope: "module",
        },
        {
          name: "no-inter-module-test",
          comment:
            "This test depends on something in the test tree that is neither a utility, nor a mock nor a fixture.",
          severity: "error",
          from: {
            path: "(^test/[^\\/]+/)[^\\.]+\\.spec\\.js",
          },
          to: {
            path: "^test/[^\\/]+/.+",
            pathNot: "utl|$1.+\\.json$",
          },
          scope: "module",
        },
        {
          name: "prefer-lodash-individuals",
          comment:
            "This module directly depends on 'lodash' as a whole. Preferably don't include lodash as a whole, but use individual lodash packages instead e.g. 'lodash/get' - this keeps the download of the package small(er)",
          severity: "info",
          from: {},
          to: {
            path: "lodash\\.js$",
          },
          scope: "module",
        },
        {
          name: "no-dep-on-test",
          comment:
            "This module depends on a spec files. A spec file should have a single responsibility (testing whether a module function correctly). If there's something in a spec that's of use, factor it out into (e.g.) a separate utility/ helper or mock",
          severity: "error",
          from: {
            path: "^(src|bin)",
          },
          to: {
            path: "^test|\\.spec\\.js$",
          },
          scope: "module",
        },
        {
          name: "no-external-to-here",
          comment:
            "Apparently something outside of the src/ test/ and bin/ points to something inside them. That's incredibly odd and might denote a security problem.",
          severity: "error",
          from: {
            pathNot: "^(src|test|bin)",
          },
          to: {
            path: "^(src|test)",
          },
          scope: "module",
        },
        {
          name: "not-to-dev-dep",
          severity: "error",
          comment:
            "In production code do not depend on external ('npm') modules not declared in your package.json's dependencies - otherwise a production only install (i.e. 'npm ci') will break. If this rule triggers on something that's only used during development, adapt the 'from' of the rule in the dependency-cruiser configuration.",
          from: {
            path: "^(bin|src)",
          },
          to: {
            dependencyTypes: ["npm-dev"],
            exoticallyRequired: false,
          },
          scope: "module",
        },
        {
          name: "only-known-exotic",
          severity: "error",
          comment:
            "The only 'exotic' requires allowed are tryRequire and requireJSON",
          from: {},
          to: {
            exoticRequireNot: "^(tryRequire|requireJSON)$",
            exoticallyRequired: true,
          },
          scope: "module",
        },
        {
          name: "optional-deps-used",
          severity: "error",
          comment:
            "This module uses an external dependency that in package.json shows up as an optional dependency. In dependency-cruiser optional dependencies donot make sense - and are hence forbidden. Either make it a regular dependency (if it's production code) or a dev one (if it's for development only)",
          from: {},
          to: {
            dependencyTypes: ["npm-optional"],
          },
          scope: "module",
        },
        {
          name: "peer-deps-used",
          comment:
            "This module uses an external dependency that in package.json shows up as a peer dependency. In dependency-cruiser peer dependencies donot make sense - and are hence forbidden. Either make it a regular dependency (if it's production code) or a dev one (if it's for development only)",
          severity: "error",
          from: {},
          to: {
            dependencyTypes: ["npm-peer"],
          },
          scope: "module",
        },
        {
          name: "no-unvetted-license",
          comment:
            "This module uses an external dependency that has license that's not vetted. The license itself might be OK, but bigcorp legal departments might get jittery over anything other than MIT (or ISC).",
          severity: "error",
          from: {},
          to: {
            licenseNot: "MIT|ISC|Apache-2\\.0",
          },
          scope: "module",
        },
        {
          name: "not-unreachable-from-cli",
          severity: "error",
          comment:
            "This module in the src/ tree is not reachable from the cli - and is likely dead wood. Either use it or remove it. If a module is flagged for which it's logical it is not reachable from cli (i.e. a configuration file), add it to the pathNot in the 'to' of this rule.",
          from: {
            path: "^bin/",
          },
          to: {
            path: "^src",
            pathNot: "\\.schema\\.json$|\\.d\\.ts$",
            reachable: false,
          },
          scope: "module",
        },
        {
          name: "not-unreachable-from-test",
          comment:
            "This module in src is not reachable by any test. Please provide a test that covers this (poor man's test coverage - this task is better suited for a proper test coverage tool :-) )",
          severity: "warn",
          from: {
            path: "\\.spec\\.m?js$",
          },
          to: {
            path: "^src",
            pathNot: "\\.schema\\.json$|\\.d\\.ts$",
            reachable: false,
          },
          scope: "module",
        },
        {
          name: "not-reachable-from-folder-index",
          comment:
            "(sample rule to demo reachable rules with capturing groups)",
          severity: "info",
          from: {
            path: "^src/([^/]+)/index\\.js$",
          },
          to: {
            path: "^src/$1/",
            pathNot: "\\.d\\.ts$",
            reachable: false,
          },
          scope: "module",
        },
        {
          name: "utl-module-not-shared-enough",
          comment: "(sample rule to demo demo rules based on dependents)",
          severity: "info",
          from: {
            path: "^src",
          },
          module: {
            path: "^src/utl",
            numberOfDependentsLessThan: 3,
          },
          scope: "module",
        },
        {
          name: "no-circular",
          comment:
            "This dependency is part of a circular relationship. You might want to revise your solution (i.e. use dependency inversion, make sure the modules have a single responsibility) ",
          severity: "error",
          from: {},
          to: {
            circular: true,
          },
          scope: "module",
        },
        {
          name: "no-deprecated-core",
          comment:
            "This module depends on a node core module that has been deprecated. Find an alternative - these are bound to exist - node doesn't deprecate lightly.",
          severity: "error",
          from: {},
          to: {
            dependencyTypes: ["core"],
            path: "^(punycode|domain|constants|sys|_linklist|_stream_wrap)$",
          },
          scope: "module",
        },
        {
          name: "no-duplicate-dep-types",
          comment:
            'Likley this module depends on an external (\'npm\') package that occurs more than once in your package.json i.e. bot as a devDependencies and in dependencies. This will cause maintenance problems later on. If it\'s intentional, you can disable this rule by adding this override as a rule in the \'forbidden\' section of your dependency-cruiser configuration: {"name": "no-duplicate-dep-types", "severity": "ignore"}',
          severity: "error",
          from: {},
          to: {
            moreThanOneDependencyType: true,
            dependencyTypesNot: ["type-only"],
          },
          scope: "module",
        },
        {
          name: "no-non-package-json",
          severity: "error",
          comment:
            "This module depends on an npm package that isn't in the 'dependencies' section of your package.json. That's problematic as the package either (1) won't be available on live (2 - worse) will be available on live with an non-guaranteed version. Fix it by adding the package to the dependencies in your package.json.",
          from: {},
          to: {
            dependencyTypes: ["npm-no-pkg", "npm-unknown"],
          },
          scope: "module",
        },
        {
          name: "not-to-deprecated",
          comment:
            "This module uses a (version of an) npm module that has been deprecated. Either upgrade to a later version of that module, or find an alternative. Deprecated modules are a security risk.",
          severity: "error",
          from: {},
          to: {
            dependencyTypes: ["deprecated"],
          },
          scope: "module",
        },
      ],
    },
  },
};
