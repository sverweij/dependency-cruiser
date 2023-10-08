import { deepEqual, equal } from "node:assert/strict";
import normalizeInitOptions from "#cli/init-config/normalize-init-options.mjs";

describe("[U] cli/init-config/normalize-init-options", () => {
  let lSavedWorkingDirectory = process.cwd();

  beforeEach("save working directory", () => {
    lSavedWorkingDirectory = process.cwd();
  });

  afterEach("restore working directory", () => {
    process.chdir(lSavedWorkingDirectory);
  });

  it("If it's a mono repo, doesn't return a testLocation array", () => {
    deepEqual(normalizeInitOptions({ isMonoRepo: true }).testLocation, []);
  });

  it("If it's a mono repo, hasTestOutsideSource is false", () => {
    equal(
      normalizeInitOptions({ isMonoRepo: true }).hasTestsOutsideSource,
      false,
    );
  });

  it("If it's a mono repo, foo bar", () => {
    process.chdir("test/cli/init-config/__mocks__/mono-repo-with-other-files");
    deepEqual(
      normalizeInitOptions({
        isMonoRepo: true,
        specifyResolutionExtensions: true,
      }).resolutionExtensions,
      [".coffee", ".js"],
    );
  });

  it("If there's NO TypeScript-ish files in the source folder (nor a tsConfig or tsPreCompilationDeps specified) usesTypeScript is false", () => {
    process.chdir("test/cli/init-config/__mocks__/no-typescript-here");
    equal(normalizeInitOptions({}).usesTypeScript, false);
  });

  it("If there's NO TypeScript-ish files in the source folder, but a tsConfig is specified usesTypeScript is true", () => {
    process.chdir("test/cli/init-config/__mocks__/no-typescript-here");
    equal(
      normalizeInitOptions({ tsConfig: "./tsconfig.json" }).usesTypeScript,
      true,
    );
  });

  it("If there's NO TypeScript-ish files in the source folder, but a tsPreCompilationDeps is specified usesTypeScript is true", () => {
    process.chdir("test/cli/init-config/__mocks__/no-typescript-here");
    equal(
      normalizeInitOptions({ tsPreCompilationDeps: true }).usesTypeScript,
      true,
    );
  });
  it("If there's TypeScript-ish files in the source folder usesTypeScript is true", () => {
    process.chdir("test/cli/init-config/__mocks__/typescript-here");
    equal(normalizeInitOptions({ sourceLocation: "src" }).usesTypeScript, true);
  });
  it("If there's no TypeScript-ish files in the source folder, but there are in the test folder, usesTypeScript is true", () => {
    process.chdir("test/cli/init-config/__mocks__/typescript-in-test-only");
    equal(
      normalizeInitOptions({
        sourceLocation: "src",
        hasTestsOutsideSource: true,
        testLocation: "test",
      }).usesTypeScript,
      true,
    );
  });
});
