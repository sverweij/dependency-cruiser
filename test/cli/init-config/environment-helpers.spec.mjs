import { expect } from "chai";
import helpers from "../../../src/cli/init-config/environment-helpers.js";

describe("[U] cli/init-config/environment-helpers - isLikelyMonoRepo", () => {
  it("declares the current folder to be not a mono repo", () => {
    expect(helpers.isLikelyMonoRepo()).to.equal(false);
  });
  it("no folders => no mono repo", () => {
    expect(helpers.isLikelyMonoRepo([])).to.equal(false);
  });
  it("no packages in the array of folders => no mono repo", () => {
    expect(
      helpers.isLikelyMonoRepo(["bin", "src", "node_modules", "test"])
    ).to.equal(false);
  });
  it("packages in the array of folders => mono repo", () => {
    expect(helpers.isLikelyMonoRepo(["packages"])).to.equal(true);
  });
});

describe("[U] cli/init-config/environment-helpers - hasTestsWithinSource", () => {
  it("When there's no sign of a separate test directory - tests are in the source", () => {
    expect(helpers.hasTestsWithinSource([])).to.equal(true);
  });

  it("When there's a separate test directory - tests are separate", () => {
    expect(helpers.hasTestsWithinSource(["spec"], ["src"])).to.equal(false);
  });

  it("When one test directory is also a source directy - tests are in the source", () => {
    expect(
      helpers.hasTestsWithinSource(["src"], ["bin", "src", "types"])
    ).to.equal(true);
  });

  it("When all test directories are also in the source directory array - tests are in the source", () => {
    expect(
      helpers.hasTestsWithinSource(
        ["src", "lib"],
        ["bin", "src", "types", "lib"]
      )
    ).to.equal(true);
  });

  it("When only a part of  test directories are also in the source directory array - tests not in the source (for now)", () => {
    expect(
      helpers.hasTestsWithinSource(
        ["src", "lib", "spec"],
        ["bin", "src", "types", "lib"]
      )
    ).to.equal(false);
  });
});

describe("[U] cli/init-config/environment-helpers - getFolderCandidates", () => {
  it("returns only existing folders", () => {
    const lCandidates = ["src", "bin"];
    const lRealFolders = ["src", "lib", "node_modules"];

    expect(
      helpers.getFolderCandidates(lCandidates)(lRealFolders)
    ).to.deep.equal(["src"]);
  });
});
