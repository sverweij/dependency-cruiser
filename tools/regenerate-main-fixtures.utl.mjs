import { fileURLToPath } from "url";
import fs from "node:fs";
import path from "node:path";
import prettier from "prettier";
import main from "../src/main/index.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const WORKING_DIR = process.cwd();
const MAIN_FIXTURE_DIR = path.join(
  __dirname,
  "..",
  "test",
  "main",
  "__fixtures__"
);
const MAIN_MOCKS_DIR = path.join(__dirname, "..", "test", "main", "__mocks__");

function barfTheJSON(
  pTargetFileName,
  pResult,
  pTargetDirectory = MAIN_MOCKS_DIR
) {
  fs.writeFileSync(
    path.join(pTargetDirectory, pTargetFileName),
    prettier.format(JSON.stringify(pResult.output), { parser: "json" }),
    {
      encoding: "utf8",
    }
  );
}

// main.cruise
barfTheJSON(
  "ts.json",
  main.cruise(["test/main/__mocks__/ts"]),
  MAIN_FIXTURE_DIR
);
barfTheJSON(
  "tsx.json",
  main.cruise(["test/main/__mocks__/tsx"], {}, { bustTheCache: true }),
  MAIN_FIXTURE_DIR
);
barfTheJSON(
  "jsx.json",
  main.cruise(["test/main/__mocks__/jsx"], {}, { bustTheCache: true }),
  MAIN_FIXTURE_DIR
);
barfTheJSON(
  "jsx-as-object.json",
  main.cruise(
    ["test/main/__mocks__/jsx"],
    {
      ruleSet: {},
    },
    { bustTheCache: true }
  ),
  MAIN_FIXTURE_DIR
);
barfTheJSON(
  "collapse-after-cruise/expected-result.json",
  main.cruise(
    ["test/main/__mocks__/collapse-after-cruise"],
    {
      ruleSet: {},
      collapse: "^test/main/__mocks__/collapse-after-cruise/src/[^/]+",
    },
    { bustTheCache: true }
  )
);

// // main.cruise - tsPreCompilationDeps
barfTheJSON(
  "ts-precomp-cjs.json",
  main.cruise(
    ["test/main/__mocks__/ts-precompilation-deps-on-cjs"],
    {
      tsConfig: {
        fileName: "test/main/__mocks__/tsconfig.targetcjs.json",
      },
      tsPreCompilationDeps: true,
    },
    { bustTheCache: true },
    {
      options: {
        baseUrl: ".",
        module: "commonjs",
      },
    }
  ),
  MAIN_FIXTURE_DIR
);

barfTheJSON(
  "ts-no-precomp-cjs.json",
  main.cruise(
    ["test/main/__mocks__/ts-precompilation-deps-off-cjs"],
    {
      tsConfig: {
        fileName: "test/main/__mocks__/tsconfig.targetcjs.json",
      },
      tsPreCompilationDeps: false,
    },
    { bustTheCache: true },
    {
      options: {
        baseUrl: ".",
        module: "commonjs",
      },
    }
  ),
  MAIN_FIXTURE_DIR
);

barfTheJSON(
  "ts-precomp-es.json",
  main.cruise(
    ["test/main/__mocks__/ts-precompilation-deps-on-es"],
    {
      tsConfig: {
        fileName: "test/main/__mocks__/tsconfig.targetes.json",
      },
      tsPreCompilationDeps: true,
    },
    { bustTheCache: true },
    {
      options: {
        baseUrl: ".",
        module: "es6",
      },
    }
  ),
  MAIN_FIXTURE_DIR
);

barfTheJSON(
  "ts-no-precomp-es.json",
  main.cruise(
    ["test/main/__mocks__/ts-precompilation-deps-off-es"],
    {
      tsConfig: {
        fileName: "test/main/__mocks__/tsconfig.targetes.json",
      },
      tsPreCompilationDeps: false,
    },
    { bustTheCache: true },
    {
      options: {
        baseUrl: ".",
        module: "es6",
      },
    }
  ),
  MAIN_FIXTURE_DIR
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
barfTheJSON(
  "dynamic-imports/es/output.json",
  main.cruise(["src"], DYNAMIC_IMPORTS_RULE_SET, { bustTheCache: true })
);
process.chdir(WORKING_DIR);

process.chdir("test/main/__mocks__/dynamic-imports/typescript");
barfTheJSON(
  "dynamic-imports/typescript/output.json",
  main.cruise(["src"], DYNAMIC_IMPORTS_RULE_SET, { bustTheCache: true })
);
process.chdir(WORKING_DIR);

process.chdir("test/main/__mocks__/dynamic-imports/typescript");
barfTheJSON(
  "dynamic-imports/typescript/output-pre-compilation-deps.json",
  main.cruise(
    ["src"],
    { ...DYNAMIC_IMPORTS_RULE_SET, tsPreCompilationDeps: true },
    { bustTheCache: true }
  )
);
process.chdir(WORKING_DIR);

// main.cruise - type only module references
process.chdir("test/main/__mocks__/type-only-module-references");
barfTheJSON(
  "type-only-module-references/output.json",
  main.cruise(
    ["src"],
    { tsPreCompilationDeps: true },
    { bustTheCache: true, resolveLicenses: true }
  )
);
process.chdir(WORKING_DIR);

process.chdir("test/main/__mocks__/type-only-module-references");
barfTheJSON(
  "type-only-module-references/output-no-ts.json",
  main.cruise(["src"], { tsPreCompilationDeps: false }, { bustTheCache: true })
);
process.chdir(WORKING_DIR);

// main. cruise - explicitly type only imports
process.chdir("test/main/__mocks__/type-only-imports");
barfTheJSON(
  "type-only-imports/output.json",
  main.cruise(
    ["src"],
    {
      tsPreCompilationDeps: true,
    },
    { bustTheCache: true, resolveLicenses: false }
  )
);
process.chdir(WORKING_DIR);

process.chdir("test/main/__mocks__/type-only-imports");
barfTheJSON(
  "type-only-imports/output-with-rules.json",
  main.cruise(
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
    { bustTheCache: true, resolveLicenses: false }
  )
);
process.chdir(WORKING_DIR);
