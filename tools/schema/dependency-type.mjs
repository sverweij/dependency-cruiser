export default {
  definitions: {
    DependencyTypeType: {
      type: "string",
      enum: [
        "aliased-subpath-import",
        "aliased-tsconfig-base-url",
        "aliased-tsconfig-paths",
        "aliased-tsconfig",
        "aliased-webpack",
        "aliased-workspace",
        "aliased",
        "amd-define",
        "amd-require",
        "amd-exotic-require",
        "core",
        "deprecated",
        "dynamic-import",
        "exotic-require",
        "export",
        "import-equals",
        "import",
        "jsdoc",
        "jsdoc-bracket-import",
        "jsdoc-import-tag",
        "local",
        "localmodule",
        "npm-bundled",
        "npm-dev",
        "npm-no-pkg",
        "npm-optional",
        "npm-peer",
        "npm-unknown",
        "npm",
        "pre-compilation-only",
        "require",
        "triple-slash-amd-dependency",
        "triple-slash-directive",
        "triple-slash-file-reference",
        "triple-slash-type-reference",
        "type-import",
        "type-only",
        "undetermined",
        "unknown",
      ],
    },
  },
};
