import { fileURLToPath } from "node:url";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import prettier from "prettier";
import main from "../src/main/index.mjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const WORKING_DIR = process.cwd();
const MAIN_FIXTURE_DIR = join(__dirname, "..", "test", "main", "__fixtures__");
const MAIN_MOCKS_DIR = join(__dirname, "..", "test", "main", "__mocks__");

async function barfTheJSON(
  pTargetFileName,
  pResult,
  pTargetDirectory = MAIN_MOCKS_DIR,
) {
  const lFormatted = await prettier.format(JSON.stringify(pResult.output), {
    parser: "json",
  });
  writeFileSync(join(pTargetDirectory, pTargetFileName), lFormatted, {
    encoding: "utf8",
  });
}

// main.cruise
await barfTheJSON(
  "ts.json",
  await main.cruise(["test/main/__mocks__/ts"]),
  MAIN_FIXTURE_DIR,
);
await barfTheJSON(
  "tsx.json",
  await main.cruise(["test/main/__mocks__/tsx"], {}, { bustTheCache: true }),
  MAIN_FIXTURE_DIR,
);
await barfTheJSON(
  "jsx.json",
  await main.cruise(["test/main/__mocks__/jsx"], {}, { bustTheCache: true }),
  MAIN_FIXTURE_DIR,
);
await barfTheJSON(
  "jsx-as-object.json",
  await main.cruise(
    ["test/main/__mocks__/jsx"],
    {
      ruleSet: {},
    },
    { bustTheCache: true },
  ),
  MAIN_FIXTURE_DIR,
);
await barfTheJSON(
  "collapse-after-cruise/expected-result.json",
  await main.cruise(
    ["test/main/__mocks__/collapse-after-cruise"],
    {
      ruleSet: {},
      collapse: "^test/main/__mocks__/collapse-after-cruise/src/[^/]+",
    },
    { bustTheCache: true },
  ),
);

// // main.cruise - tsPreCompilationDeps
await barfTheJSON(
  "ts-precomp-cjs.json",
  await main.cruise(
    ["test/main/__mocks__/ts-precompilation-deps-on-cjs"],
    {
      tsConfig: {
        fileName: "test/main/__mocks__/tsconfig.targetcjs.json",
      },
      tsPreCompilationDeps: true,
    },
    { bustTheCache: true },
    {
      tsConfig: {
        options: {
          baseUrl: ".",
          module: "commonjs",
        },
      },
    },
  ),
  MAIN_FIXTURE_DIR,
);

await barfTheJSON(
  "ts-no-precomp-cjs.json",
  await main.cruise(
    ["test/main/__mocks__/ts-precompilation-deps-off-cjs"],
    {
      tsConfig: {
        fileName: "test/main/__mocks__/tsconfig.targetcjs.json",
      },
      tsPreCompilationDeps: false,
    },
    { bustTheCache: true },
    {
      tsConfig: {
        options: {
          baseUrl: ".",
          module: "commonjs",
        },
      },
    },
  ),
  MAIN_FIXTURE_DIR,
);

await barfTheJSON(
  "ts-precomp-es.json",
  await main.cruise(
    ["test/main/__mocks__/ts-precompilation-deps-on-es"],
    {
      tsConfig: {
        fileName: "test/main/__mocks__/tsconfig.targetes.json",
      },
      tsPreCompilationDeps: true,
    },
    { bustTheCache: true },
    {
      tsConfig: {
        options: {
          baseUrl: ".",
          module: "es6",
        },
      },
    },
  ),
  MAIN_FIXTURE_DIR,
);

await barfTheJSON(
  "ts-no-precomp-es.json",
  await main.cruise(
    ["test/main/__mocks__/ts-precompilation-deps-off-es"],
    {
      tsConfig: {
        fileName: "test/main/__mocks__/tsconfig.targetes.json",
      },
      tsPreCompilationDeps: false,
    },
    { bustTheCache: true },
    {
      tsConfig: {
        options: {
          baseUrl: ".",
          module: "es6",
        },
      },
    },
  ),
  MAIN_FIXTURE_DIR,
);

// main.cruise - dynamic imports
const DYNAMIC_IMPORTS_RULE_SET = {
  ruleSet: {
    forbidden: [
      {
        name: "no-circular",
        severity: "info",
        from: {},
        to: {
          dynamic: false,
          circular: true,
        },
      },
      {
        name: "no-dynamic",
        severity: "warn",
        from: {},
        to: {
          dynamic: true,
        },
      },
    ],
  },
  validate: true,
};

process.chdir("test/main/__mocks__/dynamic-imports/es");
await barfTheJSON(
  "dynamic-imports/es/output.json",
  await main.cruise(["src"], DYNAMIC_IMPORTS_RULE_SET, { bustTheCache: true }),
);
process.chdir(WORKING_DIR);

process.chdir("test/main/__mocks__/dynamic-imports/typescript");
await barfTheJSON(
  "dynamic-imports/typescript/output.json",
  await main.cruise(["src"], DYNAMIC_IMPORTS_RULE_SET, { bustTheCache: true }),
);
process.chdir(WORKING_DIR);

process.chdir("test/main/__mocks__/dynamic-imports/typescript");
await barfTheJSON(
  "dynamic-imports/typescript/output-pre-compilation-deps.json",
  await main.cruise(
    ["src"],
    { ...DYNAMIC_IMPORTS_RULE_SET, tsPreCompilationDeps: true },
    { bustTheCache: true },
  ),
);
process.chdir(WORKING_DIR);

// main.cruise - type only module references
process.chdir("test/main/__mocks__/type-only-module-references");
await barfTheJSON(
  "type-only-module-references/output.json",
  await main.cruise(
    ["src"],
    { tsPreCompilationDeps: true },
    { bustTheCache: true, resolveLicenses: true },
  ),
);
process.chdir(WORKING_DIR);

process.chdir("test/main/__mocks__/type-only-module-references");
await barfTheJSON(
  "type-only-module-references/output-no-ts.json",
  await main.cruise(
    ["src"],
    { tsPreCompilationDeps: false },
    { bustTheCache: true },
  ),
);
process.chdir(WORKING_DIR);

// main. cruise - explicitly type only imports
process.chdir("test/main/__mocks__/type-only-imports");
await barfTheJSON(
  "type-only-imports/output.json",
  await main.cruise(
    ["src"],
    {
      tsPreCompilationDeps: true,
    },
    { bustTheCache: true, resolveLicenses: false },
  ),
);
process.chdir(WORKING_DIR);

process.chdir("test/main/__mocks__/type-only-imports");
await barfTheJSON(
  "type-only-imports/output-with-rules.json",
  await main.cruise(
    ["src"],
    {
      ruleSet: {
        forbidden: [
          {
            name: "no-type-only",
            from: {},
            to: {
              dependencyTypes: ["type-only"],
            },
          },
        ],
      },
      validate: true,
      tsPreCompilationDeps: true,
    },
    { bustTheCache: true, resolveLicenses: false },
  ),
);
process.chdir(WORKING_DIR);
