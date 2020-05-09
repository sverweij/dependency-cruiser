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
          oneOf: [
            {
              type: "string",
              description:
                "a regular expression for modules to include, but not follow further",
            },
            { $ref: "#/definitions/CompoundDoNotFollowType" },
          ],
        },
        exclude: {
          oneOf: [
            {
              type: "string",
              description:
                "a regular expression for modules to exclude from being cruised",
            },
            { $ref: "#/definitions/CompoundExcludeType" },
          ],
        },
        includeOnly: {
          oneOf: [
            {
              type: "string",
              description:
                "a regular expression for modules to cruise; anything outside it will " +
                "be skipped",
            },
            { $ref: "#/definitions/CompoundIncludeOnlyType" },
          ],
        },
        focus: {
          oneOf: [
            {
              type: "string",
              description:
                "dependency-cruiser will include modules matching this regular expression " +
                "in its output, as well as their neighbours (direct dependencies and " +
                "dependents)",
            },
            { $ref: "#/definitions/CompoundFocusType" },
          ],
        },
        maxDepth: {
          type: "number",
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
  },
};
