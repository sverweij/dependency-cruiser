import { deepStrictEqual, strictEqual } from "node:assert";
import { afterEach, beforeEach, describe, it } from "node:test";
import normalizeInitOptions from "../../../src/cli/init-config/normalize-init-options.mjs";

describe("[U] cli/init-config/normalize-init-options", () => {
  let lSavedWorkingDirectory = process.cwd();

  beforeEach(() => {
    lSavedWorkingDirectory = process.cwd();
  });

  afterEach(() => {
    process.chdir(lSavedWorkingDirectory);
  });

  it("If it's a mono repo, doesn't return a testLocation array", () => {
    deepStrictEqual(
      normalizeInitOptions({ isMonoRepo: true }).testLocation,
      []
    );
  });

  it("If it's a mono repo, hasTestOutsideSource is false", () => {
    strictEqual(
      normalizeInitOptions({ isMonoRepo: true }).hasTestsOutsideSource,
      false
    );
  });

  it("If it's a mono repo, foo bar", () => {
    process.chdir("test/cli/init-config/__mocks__/mono-repo-with-other-files");
    deepStrictEqual(
      normalizeInitOptions({
        isMonoRepo: true,
        specifyResolutionExtensions: true,
      }).resolutionExtensions,
      [".coffee", ".js"]
    );
  });

  it("If there's NO TypeScript-ish files in the source folder (nor a tsConfig or tsPreCompilationDeps specified) usesTypeScript is false", () => {
    process.chdir("test/cli/init-config/__mocks__/no-typescript-here");
    strictEqual(normalizeInitOptions({}).usesTypeScript, false);
  });

  it("If there's NO TypeScript-ish files in the source folder, but a tsConfig is specified usesTypeScript is true", () => {
    process.chdir("test/cli/init-config/__mocks__/no-typescript-here");
    strictEqual(
      normalizeInitOptions({ tsConfig: "./tsconfig.json" }).usesTypeScript,
      true
    );
  });

  it("If there's NO TypeScript-ish files in the source folder, but a tsPreCompilationDeps is specified usesTypeScript is true", () => {
    process.chdir("test/cli/init-config/__mocks__/no-typescript-here");
    strictEqual(
      normalizeInitOptions({ tsPreCompilationDeps: true }).usesTypeScript,
      true
    );
  });
  it("If there's TypeScript-ish files in the source folder usesTypeScript is true", () => {
    process.chdir("test/cli/init-config/__mocks__/typescript-here");
    strictEqual(
      normalizeInitOptions({ sourceLocation: "src" }).usesTypeScript,
      true
    );
  });
  it("If there's no TypeScript-ish files in the source folder, but there are in the test folder, usesTypeScript is true", () => {
    process.chdir("test/cli/init-config/__mocks__/typescript-in-test-only");
    strictEqual(
      normalizeInitOptions({
        sourceLocation: "src",
        hasTestsOutsideSource: true,
        testLocation: "test",
      }).usesTypeScript,
      true
    );
  });
});
