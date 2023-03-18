/* eslint-disable max-lines */
import REAsStringsType from "./re-as-strings-type.mjs";
import compoundDoNotFollowType from "./compound-donot-follow-type.mjs";
import compoundExcludeType from "./compound-exclude-type.mjs";
import compoundFocusType from "./compound-focus-type.mjs";
import compoundIncludeOnlyType from "./compound-include-only-type.mjs";
import compoundReachesType from "./compound-reaches-type.mjs";
import compoundHighlightType from "./compound-highlight-type.mjs";
import dependencyType from "./dependency-type.mjs";
import moduleSystemsType from "./module-systems-type.mjs";
import reporterOptions from "./reporter-options.mjs";
import violations from "./violations.mjs";
import cacheOptions from "./cache-options.mjs";

export default {
  definitions: {
    OptionsType: {
      type: "object",
      description: "Runtime configuration options",
      additionalProperties: false,
      properties: {
        doNotFollow: {
          description:
            "a regular expression for modules to include, but not follow further",
          oneOf: [
            { $ref: "#/definitions/REAsStringsType" },
            { $ref: "#/definitions/CompoundDoNotFollowType" },
          ],
        },
        exclude: {
          description:
            "a regular expression for modules to exclude from being cruised",
          oneOf: [
            { $ref: "#/definitions/REAsStringsType" },
            { $ref: "#/definitions/CompoundExcludeType" },
          ],
        },
        includeOnly: {
          description:
            "a regular expression for modules to cruise; anything outside it will " +
            "be skipped",
          oneOf: [
            { $ref: "#/definitions/REAsStringsType" },
            { $ref: "#/definitions/CompoundIncludeOnlyType" },
          ],
        },
        focus: {
          description:
            "dependency-cruiser will include modules matching this regular expression " +
            "in its output, as well as their neighbours (direct dependencies and " +
            "dependents)",
          oneOf: [
            { $ref: "#/definitions/REAsStringsType" },
            { $ref: "#/definitions/CompoundFocusType" },
          ],
        },
        reaches: {
          description:
            "dependency-cruiser will include modules matching this regular expression " +
            "in its output, as well as _any_ module that reaches them - either directly " +
            "or via via",
          oneOf: [
            { $ref: "#/definitions/REAsStringsType" },
            { $ref: "#/definitions/CompoundReachesType" },
          ],
        },
        highlight: {
          description:
            "dependency-cruiser will mark modules matching this regular expression " +
            "as 'highlighted' in its output",
          oneOf: [
            { $ref: "#/definitions/REAsStringsType" },
            { $ref: "#/definitions/CompoundHighlightType" },
          ],
        },
        knownViolations: {
          description:
            "baseline of known validations. Typically you'd specify these in a file called " +
            ".dependency-cruiser-known-violations.json (which you'd generate with the --outputType " +
            "'baseline') - and which is easy to keep up to date. In a pinch you can specify " +
            "them here as well. The known violations in .dependency-cruiser-known-violations.json " +
            "always take precedence.",
          $ref: "#/definitions/ViolationsType",
        },
        collapse: {
          description:
            "Collapse a to a folder depth by passing a single digit (e.g. 2). " +
            "When passed a regex collapses to that pattern " +
            "E.g. ^packages/[^/]+/ would collapse to modules/ folders directly " +
            "under your packages folder.",
          oneOf: [
            { type: "string" },
            { type: "integer", minimum: 1, maximum: 9 },
          ],
        },
        maxDepth: {
          type: "integer",
          minimum: 0,
          maximum: 99,
          description:
            "The maximum cruise depth specified. 0 means no maximum specified. While " +
            "it might look attractive to regulate the size of the output, this is " +
            "not the best option to do so. Filters (exclude, includeOnly, " +
            "focus), the dot and archi reporter's collapsePattern and the collapse " +
            "options offer better, more reliable and more understandable results.",
        },
        moduleSystems: { $ref: "#/definitions/ModuleSystemsType" },
        prefix: {
          type: "string",
        },
        preserveSymlinks: {
          type: "boolean",
          description:
            "if true leave symlinks untouched, otherwise use the realpath. Defaults " +
            "to `false` (which is also nodejs's default behavior since version 6)",
        },
        combinedDependencies: {
          type: "boolean",
          description:
            "if true combines the package.jsons found from the module up to the base " +
            "folder the cruise is initiated from. Useful for how (some) mono-repos " +
            "manage dependencies & dependency definitions. Defaults to `false`.",
        },
        tsConfig: {
          type: "object",
          additionalProperties: false,
          description:
            "TypeScript project file ('tsconfig.json') to use for (1) compilation " +
            "and (2) resolution (e.g. with the paths property)",
          properties: {
            fileName: {
              description:
                "The TypeScript project file to use. The fileName is relative to " +
                "dependency-cruiser's current working directory. When not provided " +
                "defaults to './tsconfig.json'.",
              type: "string",
            },
          },
        },
        tsPreCompilationDeps: {
          description:
            "if true detect dependencies that only exist before typescript-to-javascript " +
            "compilation.",
          oneOf: [
            {
              type: "boolean",
            },
            {
              type: "string",
              enum: ["specify"],
            },
          ],
        },
        extraExtensionsToScan: {
          type: "array",
          description:
            "List of extensions to scan _in addition_ to the extensions already " +
            "covered by any available parser. Dependency-cruiser will consider " +
            "files ending in these extensions but it will _not_ examine its content " +
            "or derive any of their dependencies " +
            'Sample value: [".jpg", ".png", ".json"]',
          items: {
            type: "string",
          },
        },
        externalModuleResolutionStrategy: {
          type: "string",
          description:
            "What external module resolution strategy to use. Defaults to 'node_modules' " +
            "(not used anymore - module resolution strategy determination is automatic now)",
          enum: ["node_modules", "yarn-pnp"],
        },
        forceDeriveDependents: {
          type: "boolean",
          description:
            "When true includes de-normalized dependents in the cruise-result, even " +
            "though there's no rule in the rule set that requires them. Defaults to false.",
        },
        webpackConfig: {
          type: "object",
          additionalProperties: false,
          description:
            "Webpack configuration to use to get resolve options from",
          properties: {
            fileName: {
              type: "string",
              description:
                "The webpack conf file to use (typically something like 'webpack.conf.js'). " +
                "The fileName is relative to dependency-cruiser's current working " +
                "directory. When not provided defaults to './webpack.conf.js'.",
            },
            env: {
              description:
                "Environment to pass if your config file returns a function",
              oneOf: [
                {
                  type: "object",
                },
                {
                  type: "string",
                },
              ],
            },
            arguments: {
              type: "object",
              description:
                "Arguments to pass if your config file returns a function. E.g. " +
                "{mode: 'production'} if you want to use webpack 4's 'mode' feature",
            },
          },
        },
        enhancedResolveOptions: {
          type: "object",
          additionalProperties: false,
          description:
            "Options used in module resolution that for dependency-cruiser's " +
            "use cannot go in a webpack config. For details please refer to the " +
            "documentation of enhanced-resolve itself.",
          properties: {
            exportsFields: {
              type: "array",
              description:
                "List of strings to consider as 'exports' fields in package.json. " +
                "Use ['exports'] when you use packages that use such a field and your " +
                "environment supports it (e.g. node ^12.19 || >=14.7 or recent versions " +
                "of webpack).",
              items: {
                type: "string",
              },
            },
            conditionNames: {
              type: "array",
              description:
                "List of conditions to check for in the exports field. " +
                "e.g. use `['imports']` if you're only interested in exposed es6 " +
                "modules, ['require'] for commonjs, or all conditions at once " +
                "(['import', 'require', 'node', 'default']) if anything goes for you. " +
                "Only works when the 'exportsFields' array is non-empty",
              items: {
                type: "string",
              },
            },
            extensions: {
              type: "array",
              description:
                "List of extensions to scan for when resolving. Typically you want " +
                "to leave this alone as dependency-cruiser figures out what extensions " +
                "to scan based on " +
                "1. what is available in your environment " +
                "2. in the order your environment (nodejs, typescript) applies the " +
                "resolution itself. " +
                "However, if you want it to scan less you can specify so with the " +
                "extensions attribute. E.g. when you're 100% sure you _only_ have " +
                "typescript & json and nothing else you can pass ['.ts', '.json'] " +
                "- which can lead to performance gains on systems with slow i/o " +
                "(like ms-windows), especially when your tsconfig contains paths/ aliases.",
              items: {
                type: "string",
              },
            },
            mainFields: {
              type: "array",
              description:
                "A list of main fields in manifests (package.json s). Typically you'd " +
                "want to keep leave this this on its default (['main']) , but if " +
                "you e.g. use external packages that only expose types, and you " +
                "still want references to these types to be resolved you could expand " +
                "this to ['main', 'types']",
            },
            mainFiles: {
              type: "array",
              description:
                "A list of files to consider 'main' files, defaults to " +
                "['index']. Only set this when you have really special needs " +
                "that warrant it.",
            },
            cachedInputFileSystem: {
              type: "object",
              description:
                "Options to pass to the resolver (webpack's 'enhanced resolve') regarding " +
                "caching.",
              additionalProperties: false,
              properties: {
                cacheDuration: {
                  type: "integer",
                  minimum: 0,
                  // half an hour cache duration should suffice methinks
                  maximum: 1800000,
                  description:
                    "The number of milliseconds [enhanced-resolve](webpack/enhanced-resolve)'s " +
                    "cached file system should use for cache duration. Typically you won't " +
                    "have to touch this - the default works well for repos up to 5000 modules/ " +
                    "20000 dependencies, and likely for numbers above as well. " +
                    "If you experience memory problems on a (humongous) repository you can " +
                    "use the cacheDuration attribute to tame enhanced-resolve's memory " +
                    "usage by lowering the cache duration trading off against some (for " +
                    "values over 1000ms) or significant (for values below 500ms) performance. " +
                    "Dependency-cruiser currently uses 4000ms, and in the past has " +
                    "used 1000ms - both with good results.",
                },
              },
            },
          },
        },
        babelConfig: {
          type: "object",
          additionalProperties: false,
          description: "Babel configuration (e.g. '.babelrc.json') to use.",
          properties: {
            fileName: {
              description:
                "The Babel configuration file to use. The fileName is relative to " +
                "dependency-cruiser's current working directory. When not provided " +
                "defaults to './.babelrc.json'. Dependency-cruiser currently supports " +
                "only the json variant. Support for (js|cjs|mjs) variants and " +
                "configuration in package.json might follow in future releases.",
              type: "string",
            },
          },
        },
        parser: {
          type: "string",
          description:
            "overrides the parser dependency-cruiser will use - EXPERIMENTAL",
          enum: ["acorn", "swc", "tsc"],
        },
        exoticRequireStrings: {
          type: "array",
          description:
            "List of strings you have in use in addition to cjs/ es6 requires & " +
            "imports to declare module dependencies. Use this e.g. if you've re-declared " +
            "require (`const want = require`), use a require-wrapper (like semver-try-require) " +
            "or use window.require as a hack to workaround something",
          items: {
            type: "string",
          },
        },
        reporterOptions: { $ref: "#/definitions/ReporterOptionsType" },
        progress: {
          type: "object",
          additionalProperties: false,
          description:
            "When executing dependency-cruiser emits 'start', 'progress' and 'end' events on " +
            "a bus. You can use these e.g. to show progress in any UI (e.g. the cli) attach " +
            "loggers etc. We're still figuring out how to do expose this (if at all), so the " +
            "listener feature is highly experimental and use in any environment outside " +
            "playgrounds is discouraged. For now it's only possible to use one of the " +
            "baked-in listeners.",
          properties: {
            type: {
              type: "string",
              enum: ["cli-feedback", "performance-log", "ndjson", "none"],
            },
            maximumLevel: {
              description:
                "The maximum log level to emit messages at. Ranges from OFF (-1, don't " +
                "show any messages), via SUMMARY (40), INFO (50), DEBUG (60) all the " +
                "way to show ALL messages (99).",
              type: "number",
              // eslint-disable-next-line no-magic-numbers
              enum: [-1, 40, 50, 60, 70, 80, 99],
            },
          },
        },
        metrics: {
          type: "boolean",
          description:
            "When this flag is set to true, dependency-cruiser will calculate (stability) metrics " +
            "for all modules and folders. Defaults to false.",
        },
        baseDir: {
          type: "string",
          description:
            "The directory dependency-cruiser should run its cruise from. Defaults to the current " +
            "working directory.",
        },
        cache: {
          oneOf: [
            {
              type: "boolean",
            },
            {
              type: "string",
            },
            { $ref: "#/definitions/CacheOptionsType" },
          ],
          description:
            "- false: don't use caching. \n" +
            "- true or empty object: use caching with the default settings \n" +
            "- a string (deprecated): cache in the folder denoted by the string & use the \n" +
            "  default caching strategy. This is deprecated - instead pass a cache object \n" +
            "  e.g. ```{ folder: 'your/cache/location' }```.\n\n" +
            "Defaults to false (no caching).\n" +
            "When caching is switched on the default cache folder is 'node_modules/.cache/dependency-cruiser/'",
        },
      },
    },
    ...moduleSystemsType.definitions,
    ...dependencyType.definitions,
    ...compoundExcludeType.definitions,
    ...compoundDoNotFollowType.definitions,
    ...compoundIncludeOnlyType.definitions,
    ...compoundFocusType.definitions,
    ...compoundReachesType.definitions,
    ...compoundHighlightType.definitions,
    ...reporterOptions.definitions,
    ...REAsStringsType.definitions,
    ...violations.definitions,
    ...cacheOptions.definitions,
  },
};
