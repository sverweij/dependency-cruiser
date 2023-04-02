import { expect } from "chai";
import normalizeInitOptions from "../../../src/cli/init-config/normalize-init-options.mjs";

describe("[U] cli/init-config/normalize-init-options", () => {
  let lSavedWorkingDirectory = process.cwd();

  beforeEach("save working directory", () => {
    lSavedWorkingDirectory = process.cwd();
  });

  afterEach("restore working directory", () => {
    process.chdir(lSavedWorkingDirectory);
  });

  it("If it's a mono repo, doesn't return a testLocation array", () => {
    expect(
      normalizeInitOptions({ isMonoRepo: true }).testLocation
    ).to.deep.equal([]);
  });

  it("If it's a mono repo, hasTestOutsideSource is false", () => {
    expect(
      normalizeInitOptions({ isMonoRepo: true }).hasTestsOutsideSource
    ).to.equal(false);
  });

  it("If it's a mono repo, foo bar", () => {
    process.chdir("test/cli/init-config/__mocks__/mono-repo-with-other-files");
    expect(
      normalizeInitOptions({
        isMonoRepo: true,
        specifyResolutionExtensions: true,
      }).resolutionExtensions
    ).to.deep.equal([".coffee", ".js"]);
  });

  it("If there's NO TypeScript-ish files in the source folder (nor a tsConfig or tsPreCompilationDeps specified) usesTypeScript is false", () => {
    process.chdir("test/cli/init-config/__mocks__/no-typescript-here");
    expect(normalizeInitOptions({}).usesTypeScript).to.equal(false);
  });

  it("If there's NO TypeScript-ish files in the source folder, but a tsConfig is specified usesTypeScript is true", () => {
    process.chdir("test/cli/init-config/__mocks__/no-typescript-here");
    expect(
      normalizeInitOptions({ tsConfig: "./tsconfig.json" }).usesTypeScript
    ).to.equal(true);
  });

  it("If there's NO TypeScript-ish files in the source folder, but a tsPreCompilationDeps is specified usesTypeScript is true", () => {
    process.chdir("test/cli/init-config/__mocks__/no-typescript-here");
    expect(
      normalizeInitOptions({ tsPreCompilationDeps: true }).usesTypeScript
    ).to.equal(true);
  });
  it("If there's TypeScript-ish files in the source folder usesTypeScript is true", () => {
    process.chdir("test/cli/init-config/__mocks__/typescript-here");
    expect(
      normalizeInitOptions({ sourceLocation: "src" }).usesTypeScript
    ).to.equal(true);
  });
  it("If there's no TypeScript-ish files in the source folder, but there are in the test folder, usesTypeScript is true", () => {
    process.chdir("test/cli/init-config/__mocks__/typescript-in-test-only");
    expect(
      normalizeInitOptions({
        sourceLocation: "src",
        hasTestsOutsideSource: true,
        testLocation: "test",
      }).usesTypeScript
    ).to.equal(true);
  });
});
