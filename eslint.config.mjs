import path from "node:path";
import { fileURLToPath } from "node:url";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import globals from "globals";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      "**/.pnp.cjs",
      "**/.yarn",
      "**/node_modules",
      "**/coverage",
      "**/tmp",
      "src/**/*.schema.mjs",
      "src/report/dot-webpage/svg-in-html-snippets/script.cjs",
      "test/integration/**/*",
      "test/*/__fixtures__/**/*",
      "test/*/*/__fixtures__/**/*",
      "test/*/*/*/__fixtures__/**/*",
      "test/*/__mocks__/**/*",
      "test/*/*/__mocks__/**/*",
      "types/**/*",
    ],
  },
  ...compat.extends("moving-meadow", "plugin:@typescript-eslint/recommended"),
  {
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2021,
      sourceType: "script",
    },

    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",
      "budapestian/global-constant-pattern": "off",
      "security/detect-non-literal-fs-filename": "off",
      "import/exports-last": "off",
      "import/no-unresolved": "off",
      "@typescript-eslint/no-require-imports": "off",
      "no-param-reassign": "error",
      "n/no-missing-import": "off",
      "n/no-missing-require": "off",
      "n/no-unsupported-features/node-builtins": "off",
      "unicorn/no-empty-file": "off",
      "unicorn/no-useless-fallback-in-spread": "off",
      complexity: ["warn", { max: 10, variant: "classic" }],
    },
  },
  {
    files: ["**/*.d.ts"],

    rules: {
      "init-declarations": "off",
    },
  },
  {
    files: ["test/**/*.{js,mjs,cjs}"],

    languageOptions: {
      globals: {
        ...globals.mocha,
      },
    },

    rules: {
      complexity: "off",
      "max-lines": "off",
      "max-lines-per-function": "off",
      "no-prototype-builtins": "off",

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
      "n/no-unsupported-features/es-syntax": "off",
    },
  },
];
