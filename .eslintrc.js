module.exports = {
  root: true,
  extends: ["moving-meadow", "plugin:@typescript-eslint/recommended"],
  plugins: ["@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2021,
  },
  rules: {
    "@typescript-eslint/no-explicit-any": "off", // I'd rather have this explicitly so I can see where they are
    "@typescript-eslint/no-var-requires": "off", // we kind-of live off of those in here
    "@typescript-eslint/no-unused-vars": "off", // duplicate of the same in several other sets
    "budapestian/global-constant-pattern": "off", // currently does not work with the AST as emitted @typescript-eslint parser (FIXME)
    "no-param-reassign": "error",
    "security/detect-non-literal-fs-filename": "off",
    "unicorn/no-useless-fallback-in-spread": "off", // useful, probably. We'll try it later, though
  },
  overrides: [
    {
      files: ["**/*.d.ts"],
      rules: {
        "init-declarations": "off", // in transient contexts it's not even _possible_ to init declarations
      },
    },
    {
      files: ["test/**/*.{js,mjs,cjs}"],
      env: {
        mocha: true,
      },
      rules: {
        "max-lines": "off",
        "max-lines-per-function": "off",
        "mocha/valid-suite-description": [
          "error",
          {
            pattern: "^\\[[EIU]\\]",
            suiteNames: ["describe"],
            message:
              "start suite titles with [E], [I] or [U] to mark them as E2E, Integration or Unit test suite",
          },
        ],
      },
    },
    {
      files: ["**/*.mjs"],
      rules: {
        "node/no-unsupported-features/es-syntax": "off",
      },
    },
  ],
  ignorePatterns: [
    ".pnp.cjs",
    ".yarn",
    "node_modules",
    "coverage",
    "tmp",
    "src/**/*.schema.mjs",
    "src/**/*.template.js",
    "src/cli/tools/svg-in-html-snippets/script.snippet.js",
    "test/integration/**",
    "test/*/__fixtures__/**",
    "test/*/*/__fixtures__/**",
    "test/*/*/*/__fixtures__/**",
    "test/*/__mocks__/**",
    "test/*/*/__mocks__/**",
    "types/**",
  ],
};
