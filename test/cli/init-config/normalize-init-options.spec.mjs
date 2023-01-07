import { expect } from "chai";
import normalizeInitOptions from "../../../src/cli/init-config/normalize-init-options.js";

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
  // TODO: add scenarios now covered by more integration/ e2e style tests
  // as well
});
