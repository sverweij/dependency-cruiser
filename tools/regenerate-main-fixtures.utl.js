const fs = require("fs");
const path = require("path");
const prettier = require("prettier");
const main = require("../src/main");

const WORKING_DIR = process.cwd();

function barfTheJSON(pTargetFileName, pResult) {
  const MAIN_FIXTURE_DIR = path.join(
    __dirname,
    "..",
    "test",
    "main",
    "fixtures"
  );

  fs.writeFileSync(
    path.join(MAIN_FIXTURE_DIR, pTargetFileName),
    prettier.format(JSON.stringify(pResult.output), { parser: "json" }),
    {
      encoding: "utf8",
    }
  );
}

// main.cruise
barfTheJSON("ts.json", main.cruise(["test/main/fixtures/ts"]));
barfTheJSON(
  "tsx.json",
  main.cruise(["test/main/fixtures/tsx"], {}, { bustTheCache: true })
);
barfTheJSON(
  "jsx.json",
  main.cruise(["test/main/fixtures/jsx"], {}, { bustTheCache: true })
);
barfTheJSON(
  "jsx-as-object.json",
  main.cruise(
    ["test/main/fixtures/jsx"],
    {
      ruleSet: {},
    },
    { bustTheCache: true }
  )
);
barfTheJSON(
  "collapse-after-cruise/expected-result.json",
  main.cruise(
    ["test/main/fixtures/collapse-after-cruise"],
    {
      ruleSet: {},
      collapse: "^test/main/fixtures/collapse-after-cruise/src/[^/]+",
    },
    { bustTheCache: true }
  )
);

// main.cruise - tsPreCompilationDeps
barfTheJSON(
  "ts-precomp-cjs.json",
  main.cruise(
    ["test/main/fixtures/ts-precompilation-deps-on-cjs"],
    {
      tsConfig: {
        fileName: "test/main/fixtures/tsconfig.targetcjs.json",
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
  )
);

barfTheJSON(
  "ts-no-precomp-cjs.json",
  main.cruise(
    ["test/main/fixtures/ts-precompilation-deps-off-cjs"],
    {
      tsConfig: {
        fileName: "test/main/fixtures/tsconfig.targetcjs.json",
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
  )
);

barfTheJSON(
  "ts-precomp-es.json",
  main.cruise(
    ["test/main/fixtures/ts-precompilation-deps-on-es"],
    {
      tsConfig: {
        fileName: "test/main/fixtures/tsconfig.targetes.json",
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
  )
);

barfTheJSON(
  "ts-no-precomp-es.json",
  main.cruise(
    ["test/main/fixtures/ts-precompilation-deps-off-es"],
    {
      tsConfig: {
        fileName: "test/main/fixtures/tsconfig.targetes.json",
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
  )
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

process.chdir("test/main/fixtures/dynamic-imports/es");
barfTheJSON(
  "dynamic-imports/es/output.json",
  main.cruise(["src"], DYNAMIC_IMPORTS_RULE_SET, { bustTheCache: true })
);
process.chdir(WORKING_DIR);

process.chdir("test/main/fixtures/dynamic-imports/typescript");
barfTheJSON(
  "dynamic-imports/typescript/output.json",
  main.cruise(["src"], DYNAMIC_IMPORTS_RULE_SET, { bustTheCache: true })
);
process.chdir(WORKING_DIR);

process.chdir("test/main/fixtures/dynamic-imports/typescript");
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

process.chdir("test/main/fixtures/type-only-module-references");
barfTheJSON(
  "type-only-module-references/output.json",
  main.cruise(
    ["src"],
    { tsPreCompilationDeps: true },
    { bustTheCache: true, resolveLicenses: true }
  )
);
process.chdir(WORKING_DIR);

process.chdir("test/main/fixtures/type-only-module-references");
barfTheJSON(
  "type-only-module-references/output-no-ts.json",
  main.cruise(["src"], { tsPreCompilationDeps: false }, { bustTheCache: true })
);
process.chdir(WORKING_DIR);
