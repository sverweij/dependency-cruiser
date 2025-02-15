import { deepEqual, equal } from "node:assert/strict";
import {
  isLikelyMonoRepo,
  hasTestsWithinSource,
  getFolderCandidates,
  likelyUsesBun,
} from "#cli/init-config/environment-helpers.mjs";

describe("[U] cli/init-config/environment-helpers - isLikelyMonoRepo", () => {
  it("declares the current folder to be not a mono repo", () => {
    equal(isLikelyMonoRepo(), false);
  });
  it("no folders => no mono repo", () => {
    equal(isLikelyMonoRepo([]), false);
  });
  it("no packages in the array of folders => no mono repo", () => {
    equal(isLikelyMonoRepo(["bin", "src", "node_modules", "test"]), false);
  });
  it("packages in the array of folders => mono repo", () => {
    equal(isLikelyMonoRepo(["packages"]), true);
  });
});

describe("[U] cli/init-config/environment-helpers - hasTestsWithinSource", () => {
  it("When there's no sign of a separate test directory - tests are in the source", () => {
    equal(hasTestsWithinSource([]), true);
  });

  it("When there's a separate test directory - tests are separate", () => {
    equal(hasTestsWithinSource(["spec"], ["src"]), false);
  });

  it("When one test directory is also a source directy - tests are in the source", () => {
    equal(hasTestsWithinSource(["src"], ["bin", "src", "types"]), true);
  });

  it("When all test directories are also in the source directory array - tests are in the source", () => {
    equal(
      hasTestsWithinSource(["src", "lib"], ["bin", "src", "types", "lib"]),
      true,
    );
  });

  it("When only a part of  test directories are also in the source directory array - tests not in the source (for now)", () => {
    equal(
      hasTestsWithinSource(
        ["src", "lib", "spec"],
        ["bin", "src", "types", "lib"],
      ),
      false,
    );
  });
});

describe("[U] cli/init-config/environment-helpers - getFolderCandidates", () => {
  it("returns only existing folders", () => {
    const lCandidates = ["src", "bin"];
    const lRealFolders = ["src", "lib", "node_modules"];

    deepEqual(getFolderCandidates(lCandidates)(lRealFolders), ["src"]);
  });
});

describe("[U] cli/init-config/environment-helpers - likelyUsesBun ", () => {
  const WORKINGDIR = process.cwd();

  afterEach("tear down", () => {
    process.chdir(WORKINGDIR);
  });
  it("returns false when there's no sign of bun", () => {
    equal(likelyUsesBun({}), false);
  });

  it("returns true when bun is the package manager", () => {
    equal(likelyUsesBun({ packageManager: "bun@4.8.1" }), true);
  });
  it("returns true when there's a bun lockfile (bun.lockb)", () => {
    process.chdir("test/cli/init-config/__fixtures__/bun-lockfile");
    equal(likelyUsesBun({}), true);
  });
  it("returns true when there's a bun config file (bunfig.toml)", () => {
    process.chdir("test/cli/init-config/__fixtures__/bun-config");
    equal(likelyUsesBun({}), true);
  });
});
