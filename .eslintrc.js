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
    "security/detect-non-literal-fs-filename": "off",
    "import/exports-last": "off", // Useless remnant of the time when single pass compilers were in vogue
    "import/no-unresolved": "off", // Does not recognize package.json #imports, which we use (in nodejs since v12.9.0), nor does it understand self-references to exports (e.g. dependency-cruiser/mermaid-reporter-plugin)
    "no-param-reassign": "error",
    "node/no-missing-import": "off", // Does not recognize package.json #imports, which we use (in nodejs since v12.9.0), nor does it understand self-references to exports (e.g. dependency-cruiser/mermaid-reporter-plugin)
    "node/no-missing-require": "off", // Does not recognize package.json #imports, which we use (in nodejs since v12.9.0), nor does it understand self-references to exports (e.g. dependency-cruiser/mermaid-reporter-plugin)
    "unicorn/no-empty-file": "off", // See https://github.com/sindresorhus/eslint-plugin-unicorn/issues/2175
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
        "no-prototype-builtins": "off", // perfectly fine to use hasOwnProperty c.s. in tests
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
    "src/cli/tools/svg-in-html-snippets/script.js",
    "test/integration/**",
    "test/*/__fixtures__/**",
    "test/*/*/__fixtures__/**",
    "test/*/*/*/__fixtures__/**",
    "test/*/__mocks__/**",
    "test/*/*/__mocks__/**",
    "types/**",
  ],
};
