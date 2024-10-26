/* eslint-disable max-lines */
import { fileURLToPath } from "node:url";

const defaultStrictRules = fileURLToPath(
  new URL("configs/recommended-strict.cjs", import.meta.url),
);
/** @type {import('./types/configuration.mjs').IConfiguration} */
export default {
  extends: defaultStrictRules,
  forbidden: [
    {
      name: "no-deprecated-core",
      comment:
        "A module depends on a node core module that has been deprecated. Find an alternative - these are bound to exist - node doesn't deprecate lightly.",
      severity: "error",
      from: {},
      to: {
        dependencyTypes: ["core"],
        path: [
          "^v8/tools/codemap$",
          "^v8/tools/consarray$",
          "^v8/tools/csvparser$",
          "^v8/tools/logreader$",
          "^v8/tools/profile_view$",
          "^v8/tools/profile$",
          "^v8/tools/SourceMap$",
          "^v8/tools/splaytree$",
          "^v8/tools/tickprocessor-driver$",
          "^v8/tools/tickprocessor$",
          "^node-inspect/lib/_inspect$",
          "^node-inspect/lib/internal/inspect_client$",
          "^node-inspect/lib/internal/inspect_repl$",
          "^async_hooks$",
          "^punycode$",
          "^domain$",
          "^constants$",
          "^sys$",
          "^_linklist$",
          "^_stream_wrap$",
        ],
      },
    },
    {
      name: "not-to-unresolvable",
      comment:
        "This module tried to depend on something that can't be resolved to disk. Revise yer code",
      from: {
        pathNot: [
          // those import 'local node_modules' which, on e.g. yarn berry are not
          // resolvable. Still ok, though, as for the (test) purpose & under e.g.
          // npm they still work 100% ok
          "^test/utl/(?:try-require[.]spec[.]cjs|try-import[.]spec[.]mjs)$",
        ],
      },
      to: {
        couldNotResolve: true,
        exoticallyRequired: false,
      },
    },
    {
      name: "no-orphans",
      from: {
        orphan: true,
        pathNot: [
          "(^|/)[.][^/]+[.](?:js|cjs|mjs|ts|json)$",
          "[.]d[.]m?ts$",
          "(^|/)tsconfig[.]json$",
          "(^|/)(?:babel|webpack)[.]config[.](?:js|cjs|mjs|ts|json)$",
          "-reporter-plugin[.]mjs$",
          "[.]schema[.]json$",
          "^tools/istanbul-json-summary-to-markdown[.]mjs$",
          "^src/report/json[.]mjs",
          "^src/report/identity[.]mjs",
          "^src/report/null[.]mjs",
        ],
      },
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
        pathNot: [
          "^src/(main|utl|config-utl)/",
          "^src/report/dot-webpage/wrap-in-html[.]mjs$",
          "$1",
          "^src/meta[.]cjs$",
          "^src/extract/transpile/meta[.]mjs$",
        ],
        dependencyTypesNot: ["npm", "core", "type-only"],
      },
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
        pathNot: ["$1", "^src/meta[.]cjs$", "^src/graph-utl", "^src/utl"],
        dependencyTypesNot: ["npm", "core", "type-only"],
      },
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
        pathNot: ["$1", "^src/meta[.]cjs$", "^src/graph-utl", "^src/utl"],
        dependencyTypesNot: ["npm", "core", "type-only"],
        exoticallyRequired: false,
      },
    },
    {
      name: "not-to-json",
      comment:
        "We don't want to depend on .json modules as long as they're still impractical to work with in ecmascript modules",
      from: { path: "^src/" },
      to: {
        path: "[.]json$",
      },
    },
    {
      name: "bin-to-cli-only",
      comment:
        "This module in the bin/ folder depends on something not in the cli interface. This means it either contains code that doesn't belong in bin/, or the thing it depends upon should be put in the cli interface. ",
      severity: "error",
      from: { path: "(^bin/)" },
      to: {
        pathNot: ["^src/cli", "^src/meta[.]cjs$"],
        dependencyTypesNot: ["npm", "core", "type-only"],
      },
    },
    {
      name: "restrict-fs-access",
      comment:
        "This module depends on a the node 'fs' module, and it resides in a spot where that is not allowed.",
      severity: "error",
      from: {
        pathNot: [
          "^src/main/resolve-options/normalize[.]mjs",
          "^src/extract/(acorn|tsc|swc|resolve|gather-initial-sources[.]mjs)",
          "^src/(config-utl|cli|cache|utl/find-all-files[.]mjs)",
          "^src/report/dot-webpage/wrap-in-html[.]mjs",
          "^test",
          "^tools",
        ],
      },
      to: { path: "^fs$" },
    },
    {
      name: "no-inter-module-test",
      comment:
        "This test depends on something in the test tree that is neither a utility, nor a mock nor a fixture.",
      severity: "error",
      from: { path: "(^test/[^\\/]+/)[^\\.]+[.]spec[.]m?js" },
      to: { path: "^test/[^\\/]+/.+", pathNot: ["utl", "$1.+[.]json$"] },
    },
    {
      name: "prefer-lodash-individuals",
      comment:
        "This module directly depends on 'lodash' as a whole. Preferably don't include lodash as a whole, but use individual lodash packages instead e.g. 'lodash/get' - this keeps the download of the package small(er)",
      severity: "info",
      from: {},
      to: { path: "lodash[.]js$" },
    },
    {
      name: "no-dep-on-test",
      comment:
        "This production (/ tools/ configuration) module depends on something in the test folder.",
      severity: "error",
      from: { path: "^(src|bin|tools|configs)" },
      to: { path: "^test/" },
    },
    {
      name: "no-dep-on-spec-files",
      comment:
        "This module depends on a spec file. A spec file should have a single responsibility (testing whether a module function correctly). If there's something in a spec that's of use, factor it out into (e.g.) a separate utility/ helper or mock",
      severity: "error",
      from: {},
      to: { path: "[.]spec[.]m?js$" },
    },
    {
      name: "no-external-to-here",
      comment:
        "Apparently something outside of the src/ test/ and bin/ points to something inside them. That's incredibly odd and might denote a security problem.",
      severity: "error",
      from: { pathNot: "^(src|test|bin)" },
      to: { path: "^(src|test)" },
    },
    {
      name: "not-to-dev-dep",
      severity: "error",
      comment:
        "In production code do not depend on external ('npm') modules not declared in your package.json's dependencies - otherwise a production only install (i.e. 'npm ci') will break. If this rule triggers on something that's only used during development, adapt the 'from' of the rule in the dependency-cruiser configuration.",
      from: {
        pathNot: ["^test/", "^tools/", "^types/eslint[.]config[.]mjs"],
      },
      to: {
        dependencyTypes: ["npm-dev"],
        exoticallyRequired: false,
        dependencyTypesNot: [
          "type-only",
          "type-import",
          "triple-slash-type-reference",
          "npm",
        ],
      },
    },
    {
      name: "only-known-exotic",
      severity: "error",
      comment:
        "The only 'exotic' requires allowed are tryRequire and requireJSON",
      from: {},
      to: {
        exoticRequireNot:
          "^(tryRequire|tryImport|requireJSON|proxyquire[.]load)$",
        exoticallyRequired: true,
      },
    },
    {
      name: "optional-deps-used",
      severity: "error",
      comment:
        "This module uses an external dependency that in package.json shows up as an optional dependency. In dependency-cruiser optional dependencies donot make sense - and are hence forbidden. Either make it a regular dependency (if it's production code) or a dev one (if it's for development only)",
      from: {},
      to: { dependencyTypes: ["npm-optional"] },
    },
    {
      name: "peer-deps-used",
      comment:
        "This module uses an external dependency that in package.json shows up as a peer dependency. In dependency-cruiser peer dependencies donot make sense - and are hence forbidden. Either make it a regular dependency (if it's production code) or a dev one (if it's for development only)",
      severity: "error",
      from: {},
      to: { dependencyTypes: ["npm-peer"] },
    },
    {
      name: "no-non-vetted-license",
      comment:
        "This module uses an external dependency that has license that's not vetted. The license itself might be OK, but bigcorp legal departments might get jittery over anything other than MIT (or ISC).",
      severity: "error",
      from: {},
      to: { licenseNot: "MIT|ISC|Apache-2[.]0|BSD-2-Clause" },
    },
    {
      name: "not-unreachable-from-cli",
      severity: "error",
      comment:
        "This module in the src/ tree is not reachable from the cli - and is likely dead wood. Either use it or remove it. If a module is flagged for which it's logical it is not reachable from cli (i.e. a configuration file), add it to the pathNot in the 'to' of this rule.",
      // the exceptions for "^src/report/": the reporters are dynamically loaded;
      // they're like internal plugins, so there is a dependency but it's determined
      // at runtime.
      from: { path: ["^bin/", "^src/report/"] },
      to: {
        path: "^src",
        pathNot: [
          "[.]schema[.]json$",
          "[.]d[.]ts$",
          "^src/report/",
          "^src/config-utl/extract-depcruise-options.mjs$",
        ],
        reachable: false,
      },
    },
    {
      name: "test-to-src-with-subpaths-only",
      severity: "error",
      from: {
        pathNot: [
          "^src/",
          "^test/api[.]spec[.]mjs",
          "^test/report/mermaid/mermaid[.]spec[.]mjs",
        ],
      },
      to: {
        path: "^src/",
        dependencyTypesNot: ["aliased-subpath-import"],
      },
    },
    {
      name: "src-to-other-sub-paths-with-subpath-imports-only",
      severity: "error",
      from: {
        path: "(^src/[^/]+/)",
      },
      to: {
        path: "^src/",
        pathNot: "$1",
        dependencyTypesNot: ["aliased-subpath-import"],
      },
    },
    {
      name: "not-unreachable-from-test",
      comment:
        "This module in src is not reachable by any test. Please provide a test that covers this (poor man's test coverage - this task is better suited for a proper test coverage tool :-) )",
      severity: "warn",
      from: { path: "[.]spec[.]m?js$" },
      to: {
        path: "^src",
        pathNot: ["[.]schema[.]json$", "[.]d[.]ts$", "^src/report/"],
        reachable: false,
      },
    },
    {
      name: "not-reachable-from-folder-index",
      comment: "(sample rule to demo reachable rules with capturing groups)",
      severity: "info",
      from: {
        path: "^src/([^/]+)/index[.][cm]js$",
      },
      to: {
        path: ["^src/$1/"],
        pathNot: ["[.]d[.]ts$", "^src/report/"],
        reachable: false,
      },
    },
    {
      name: "utl-module-not-shared-enough",
      comment: "(sample rule to demo rules based on dependents)",
      severity: "info",
      from: { path: "^src" },
      module: { path: "^src/utl", numberOfDependentsLessThan: 3 },
    },
    {
      name: "only-type-only-in-types",
      comment:
        "This module in the types/ folder depends on something that is not type-only. That's not allowed.",
      severity: "error",
      from: {
        path: "[.]d[.]m?ts$",
      },
      to: {
        dependencyTypesNot: [
          "type-only",
          "type-import",
          "triple-slash-type-reference",
        ],
      },
    },
    {
      name: "only-type-only-to-dts",
      comment:
        "This module depends on a .d.ts file via an import that is not 'type-only'. See https://www.typescriptlang.org/docs/handbook/modules/reference.html#type-only-imports-and-exports",
      severity: "error",
      from: {},
      to: {
        path: "[.]d[.][cm]?ts$",
        dependencyTypesNot: [
          "type-only",
          "type-import",
          "triple-slash-type-reference",
        ],
      },
    },
    {
      name: "no-tsconfig-basedir-use",
      comment:
        "This module depends om something directly via a 'tsconfig.json' 'baseUrl' property. This is discouraged, unless you're still doing AMD modules - see https://www.typescriptlang.org/tsconfig#baseUrl",
      severity: "error",
      from: {},
      to: {
        dependencyTypes: ["aliased-tsconfig-base-url"],
      },
    },
    {
      name: "not-to-ancestor-folders",
      severity: "info",
      from: {
        path: "^src",
      },
      to: {
        ancestor: true,
        pathNot: "^src/meta[.]cjs$",
      },
    },
    {
      name: "not-outside",
      severity: "ignore",
      from: {
        path: "^src/([^/]+/).+",
        pathNot: "^src/(?:main|cli)/",
      },
      to: {
        pathNot: ["^src/$1", "^src/(?:utl|graph-utl)/", "^src/meta[.]cjs$"],
        dependencyTypesNot: ["npm", "core", "exotic-require", "type-only"],
        couldNotResolve: false,
      },
    },
  ],
  options: {
    /* pattern specifying which files not to follow further when encountered
      (regular expression)
      no need to specify here as well as we use the same as is in the
      recommended preset anyway
    */
    // "doNotFollow": "node_modules",

    /* pattern specifying which files to exclude (regular expression) */
    exclude: [
      "mocks",
      "fixtures",
      "test/integration",
      "src/report/dot-webpage/svg-in-html-snippets/script.cjs",
    ],

    /* list of module systems to cruise */
    moduleSystems: ["cjs", "es6"],

    /* prefix for links in html and svg output (e.g. https://github.com/you/yourrepo/blob/develop/) */
    prefix: "https://github.com/sverweij/dependency-cruiser/blob/main/",

    /* if true detect dependencies that only exist before typescript-to-javascript compilation */
    tsPreCompilationDeps: true,

    extraExtensionsToScan: [".json"],

    /* if true leave symlinks untouched, otherwise use the realpath */
    // "preserveSymlinks": false,

    /* TypeScript project file ('tsconfig.json') to use for
      (1) compilation and
      (2) resolution (e.g. with the paths property)

      The (optional) fileName attribute specifies which file to take (relative to dependency-cruiser's
      current working directory. When not provided defaults to './tsconfig.json'.
    */
    // "tsConfig": {
    //    "fileName": "./tsconfig.json"
    // },

    /* Webpack configuration to use to get resolve options from.

      The (optional) fileName attribute specifies which file to take (relative to dependency-cruiser's
      current working directory. When not provided defaults to './webpack.conf.js'.

      The (optional) `env` and `arguments` attributes contain the parameters to be passed if
      your webpack config is a function and takes them (see webpack documentation
      for details)
    */
    // "webpackConfig": {
    // "fileName": "./webpack.conf.js"
    //    "env": {},
    //    "arguments": {}
    // },
    // "babelConfig": {
    //   "fileName": "./.babelrc"
    // },
    /* Experimental: the parser to use
     */
    // parser: "tsc", // acorn, tsc
    detectJSDocImports: true, // implies parser: "tsc"
    experimentalStats: true,
    skipAnalysisNotInRules: true,
    metrics: true,
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      aliasFields: ["browser"],
      conditionNames: ["import", "require"],
      extensions: [
        ".cjs",
        ".mjs",
        ".js",
        // ".jsx",
        // ".ts",
        // ".cts",
        // ".mts",
        // ".tsx",
        ".d.ts",
        // ".d.cts",
        ".d.mts",
        // ".coffee",
        // ".litcoffee",
        // "cofee.md",
        // ".csx",
        // ".cjsx",
        // ".vue",
        // ".svelte"
      ],
    },
    exoticRequireStrings: [
      "tryRequire",
      "tryImport",
      "requireJSON",
      "proxyquire.load",
    ],
    reporterOptions: {
      archi: {
        collapsePattern: [
          "^(src|test)/[^/]+",
          "^bin/",
          "node_modules/(@[^/]+/[^/]+|[^/]+)",
        ],
      },
      dot: {
        collapsePattern: ["^src/report/[^/]+", "^src/enrich/derive/[^/]+"],
        filters: {
          includeOnly: { path: "^(src|bin)" },
          exclude: { path: ["^src/meta[.]cjs$", "^src/utl/bus.+"] },
        },
        theme: {
          replace: false,
          graph: {
            splines: "ortho",
          },
          modules: [
            {
              criteria: { matchesFocus: true },
              attributes: {
                fillcolor: "lime",
                penwidth: 2,
              },
            },
            {
              criteria: { matchesReaches: true },
              attributes: {
                fillcolor: "lime",
                penwidth: 2,
              },
            },
            {
              criteria: { matchesHighlight: true },
              attributes: {
                fillcolor: "yellow",
                penwidth: 2,
              },
            },
            {
              criteria: { source: "^src/cli" },
              attributes: { fillcolor: "#ccccff" },
            },
            {
              criteria: { source: "^src/config-utl" },
              attributes: { fillcolor: "#99ffff" },
            },
            {
              criteria: { source: "^src/report" },
              attributes: { fillcolor: "#ffccff" },
            },
            {
              criteria: { source: "^src/extract" },
              attributes: { fillcolor: "#ccffcc" },
            },
            {
              criteria: { source: "^src/enrich" },
              attributes: { fillcolor: "#77eeaa" },
            },
            {
              criteria: { source: "^src/validate" },
              attributes: { fillcolor: "#ccccff" },
            },
            {
              criteria: { source: "^src/main" },
              attributes: { fillcolor: "#ffcccc" },
            },
            {
              criteria: { source: "^src/utl" },
              attributes: { fillcolor: "#cccccc" },
            },
            {
              criteria: { source: "^src/graph-utl" },
              attributes: { fillcolor: "#ffcccc" },
            },
            {
              criteria: {
                source: "^src/meta[.]cjs$|[.]schema[.]mjs$",
              },
              attributes: { style: "filled" },
            },
            {
              criteria: { source: "[.]json$" },
              attributes: { shape: "cylinder" },
            },
          ],
          dependencies: [
            {
              criteria: { "rules[0].severity": "error" },
              attributes: { fontcolor: "red", color: "red" },
            },
            {
              criteria: { "rules[0].severity": "warn" },
              attributes: {
                fontcolor: "orange",
                color: "orange",
              },
            },
            {
              criteria: { "rules[0].severity": "info" },
              attributes: { fontcolor: "blue", color: "blue" },
            },
            {
              criteria: { resolved: "^src/cli" },
              attributes: { color: "#0000ff77" },
            },
            {
              criteria: { resolved: "^src/config-utl" },
              attributes: { color: "#22999977" },
            },
            {
              criteria: { resolved: "^src/report" },
              attributes: { color: "#ff00ff77" },
            },
            {
              criteria: { resolved: "^src/extract" },
              attributes: { color: "#00770077" },
            },
            {
              criteria: { resolved: "^src/enrich" },
              attributes: { color: "#00776677" },
            },
            {
              criteria: { resolved: "^src/validate" },
              attributes: { color: "#0000ff77" },
            },
            {
              criteria: { resolved: "^src/main" },
              attributes: { color: "#77000077" },
            },
            {
              criteria: { resolved: "^src/utl" },
              attributes: { color: "#aaaaaa77" },
            },
            {
              criteria: { resolved: "^src/graph-utl" },
              attributes: { color: "#77000077" },
            },
          ],
        },
      },
      metrics: {
        orderBy: "name",
        hideModules: true,
        hideFolders: false,
      },
      text: {
        highlightFocused: true,
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
          "raam",
          "roos",
          "neef",
          "fik",
          "gat",
          "wiel",
          "zes",
          "juk",
          "schop",
          "voet",
          "neus",
          "muur",
          "bijl",
          "ei",
          "ui",
        ],
      },
    },
    progress: { type: "performance-log", maximumLevel: 60 },
    cache: {
      strategy: "metadata",
      compress: true,
    },
  },
};
