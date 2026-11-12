import { deepEqual, equal, match, ok } from "node:assert/strict";
import { fileURLToPath } from "node:url";
import typescript from "#utl/typescript-facade.mjs";

const TSCONFIG_DIRECTORY = fileURLToPath(
  new URL("../config-utl/__mocks__/typescriptconfig/", import.meta.url),
);

function getKindsOfAllNodes(pNode, pKinds = []) {
  pKinds.push(typescript.SyntaxKind[pNode.kind]);
  typescript.forEachChild(pNode, (pChildNode) => {
    getKindsOfAllNodes(pChildNode, pKinds);
  });
  return pKinds;
}

describe("[U] utl/typescript-facade", () => {
  const WORKING_DIR = process.cwd();

  afterEach(() => {
    process.chdir(WORKING_DIR);
  });

  it("uses the native compiler for typescript >=7 and the classic one for older versions", () => {
    equal(typescript.isNative, Number.parseInt(typescript.version, 10) >= 7);
  });

  it("creates source files that can be walked", () => {
    const lKinds = getKindsOfAllNodes(
      typescript.createSourceFile(
        "thing.ts",
        "import a from './a'; const b = require('./b');",
      ),
    );

    ok(lKinds.includes("ImportDeclaration"));
    ok(lKinds.includes("CallExpression"));
    equal(lKinds.filter((pKind) => pKind === "StringLiteral").length, 2);
  });

  it("only marks nodes as reparsed when the native compiler synthesized them from jsdoc", () => {
    const lSourceFile = typescript.createSourceFile(
      "thing.js",
      "/** @import { Thing } from './thing.mjs' */\nexport const a = 1;",
    );

    equal(
      lSourceFile.statements.some((pStatement) =>
        typescript.isReparsed(pStatement),
      ),
      typescript.isNative,
    );
  });

  it("transpiles with compiler options that are enum values", () => {
    match(
      typescript.transpileModule("import a from './a'; a();", {
        compilerOptions: {
          module: typescript.ModuleKind.CommonJS,
          target: typescript.ScriptTarget.ES2015,
        },
      }).outputText,
      /require\("\.\/a"\)/,
    );
  });

  it("transpiles with compiler options that are enum names", () => {
    match(
      typescript.transpileModule("import a from './a'; a();", {
        compilerOptions: { module: "commonjs", target: "es2015" },
      }).outputText,
      /require\("\.\/a"\)/,
    );
  });

  it("transpiles with compiler options the compiler doesn't know (anymore)", () => {
    match(
      typescript.transpileModule("import a from './a'; a();", {
        compilerOptions: {
          module: "commonjs",
          importsNotUsedAsValues: "preserve",
          optionThatNeverExisted: "whatever",
        },
      }).outputText,
      /require\("\.\/a"\)/,
    );
  });

  it("reads and parses tsconfigs relative to the current working directory", () => {
    process.chdir(TSCONFIG_DIRECTORY);

    const lConfig = typescript.readConfigFile(
      "tsconfig.compileroptionsbase.json",
    );
    const lParsedConfig = typescript.parseJsonConfigFileContent(
      lConfig.config,
      "tsconfig.compileroptionsbase.json",
    );

    equal(lConfig.error, undefined);
    deepEqual(lParsedConfig.errors, []);
    equal(lParsedConfig.options.allowUnreachableCode, true);
  });

  it("formats diagnostics so they mention what went wrong", () => {
    match(
      typescript.formatDiagnostics([
        typescript.readConfigFile("this-tsconfig-does-not-exist.json").error,
      ]),
      /this-tsconfig-does-not-exist[.]json/,
    );
  });
});
