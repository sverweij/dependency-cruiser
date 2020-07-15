import REAsStringsType from "./re-as-strings-type.mjs";
import compoundDoNotFollowType from "./compound-donot-follow-type.mjs";
import compoundExcludeType from "./compound-exclude-type.mjs";
import compoundFocusType from "./compound-focus-type.mjs";
import compoundIncludeOnlyType from "./compound-include-only-type.mjs";
import dependencyType from "./dependency-type.mjs";
import moduleSystemsType from "./module-systems-type.mjs";
import reporterOptions from "./reporter-options.mjs";

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
        maxDepth: {
          type: "integer",
          minimum: 0,
          maximum: 99,
          description:
            "The maximum cruise depth specified. 0 means no maximum specified",
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
        externalModuleResolutionStrategy: {
          type: "string",
          description:
            "What external module resolution strategy to use. Defaults to 'node_modules'",
          enum: ["node_modules", "yarn-pnp"],
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
            "use cannot go in a webpack config.",
          properties: {
            cachedInputFileSystem: {
              type: "object",
              additionalProperties: false,
              properties: {
                cacheDuration: {
                  type: "integer",
                  minimum: 0,
                  // half an hour cache duration should suffice methinks
                  maximum: 1800000,
                  description:
                    "The number of milliseconds [enhanced-resolve](webpack/enhanced-resolve)'s " +
                    "cached file system should use for cache duration. Typicially you won't " +
                    "have to touch this - the default works well for repos up to 5000 modules/ " +
                    "20000 dependencies, and likely for numbers above as well. " +
                    "If you experience memory problems on a (humongous) repository you can " +
                    "use the cacheDuration attribute to tame enhanced-resolve's memory " +
                    "usage by lowering the cache duration trading off against some (for " +
                    "values over 1000ms) or significant (for values below 500ms) performance. " +
                    "Dependency-cruiser currently uses 1000ms, and in the past has " +
                    "used 4000ms - both with good results.",
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
        exoticRequireStrings: {
          type: "array",
          description:
            "List of strings you have in use in addition to cjs/ es6 requires & " +
            "imports to declare module dependencies. Use this e.g. if you've redeclared " +
            "require (`const want = require`), use a require-wrapper (like semver-try-require) " +
            "or use window.require as a hack to workaround something",
          items: {
            type: "string",
          },
        },
        reporterOptions: { $ref: "#/definitions/ReporterOptionsType" },
      },
    },
    ...moduleSystemsType.definitions,
    ...dependencyType.definitions,
    ...compoundExcludeType.definitions,
    ...compoundDoNotFollowType.definitions,
    ...compoundIncludeOnlyType.definitions,
    ...compoundFocusType.definitions,
    ...reporterOptions.definitions,
    ...REAsStringsType.definitions,
  },
};
