/* eslint-disable no-unused-expressions */
const expect = require("chai").expect;
const {
  getFirstExistingFileName,
  getFolderCandidates,
  folderNameArrayToRE,
  pnpIsEnabled,
  isLikelyMonoRepo,
  hasTestsWithinSource,
} = require("../../../src/cli/init-config/environment-helpers");

describe("cli/init-config/environment-helpers - pnpIsEnabled", () => {
  const WORKINGDIR = process.cwd();

  afterEach("tear down", () => {
    process.chdir(WORKINGDIR);
  });

  it("returns false when there is no package.json", () => {
    process.chdir(
      "test/cli/fixtures/init-config/pnpIsEnabled/no-package-json-here"
    );
    expect(pnpIsEnabled()).to.equal(false);
  });

  it("returns false when the package.json is invalid json", () => {
    process.chdir(
      "test/cli/fixtures/init-config/pnpIsEnabled/package-json-invalid"
    );
    expect(pnpIsEnabled()).to.equal(false);
  });

  it("returns false when the package.json does not contain the installConfig key", () => {
    process.chdir(
      "test/cli/fixtures/init-config/pnpIsEnabled/no-installConfig-key"
    );
    expect(pnpIsEnabled()).to.equal(false);
  });

  it("returns false when the package.json contains the installConfig key, but not the pnp subkey", () => {
    process.chdir(
      "test/cli/fixtures/init-config/pnpIsEnabled/pnp-attribute-missing"
    );
    expect(pnpIsEnabled()).to.equal(false);
  });

  it("returns false when the package.json contains the installConfig key, but the pnp subkey === false", () => {
    process.chdir(
      "test/cli/fixtures/init-config/pnpIsEnabled/pnp-attribute-false"
    );
    expect(pnpIsEnabled()).to.equal(false);
  });

  it("returns true when the package.json contains the installConfig.pnp key, with value true", () => {
    process.chdir(
      "test/cli/fixtures/init-config/pnpIsEnabled/pnp-attribute-true"
    );
    expect(pnpIsEnabled()).to.equal(true);
  });
});

describe("cli/init-config/environment-helpers - isLikelyMonoRepo", () => {
  it("declares the current folder to be not a mono repo", () => {
    expect(isLikelyMonoRepo()).to.equal(false);
  });
  it("no folders => no mono repo", () => {
    expect(isLikelyMonoRepo([])).to.equal(false);
  });
  it("no packages in the array of folders => no mono repo", () => {
    expect(isLikelyMonoRepo(["bin", "src", "node_modules", "test"])).to.equal(
      false
    );
  });
  it("packages in the array of folders => mono repo", () => {
    expect(isLikelyMonoRepo(["packages"])).to.equal(true);
  });
});

describe("cli/init-config/environment-helpers - hasTestsWithinSource", () => {
  it("When there's no sign of a separate test directory - tests are in the source", () => {
    expect(hasTestsWithinSource([])).to.equal(true);
  });

  it("When there's a separate test directory - tests are separate", () => {
    expect(hasTestsWithinSource(["spec"], ["src"])).to.equal(false);
  });

  it("When one test directory is also a source directy - tests are in the source", () => {
    expect(hasTestsWithinSource(["src"], ["bin", "src", "types"])).to.equal(
      true
    );
  });

  it("When all test directories are also in the source directory array - tests are in the source", () => {
    expect(
      hasTestsWithinSource(["src", "lib"], ["bin", "src", "types", "lib"])
    ).to.equal(true);
  });

  it("When only a part of  test directories are also in the source directory array - tests not in the source (for now)", () => {
    expect(
      hasTestsWithinSource(
        ["src", "lib", "spec"],
        ["bin", "src", "types", "lib"]
      )
    ).to.equal(false);
  });
});

describe("cli/init-config/environment-helpers - getFolderCandidates", () => {
  it("returns only existing folders", () => {
    const lCandidates = ["src", "bin"];
    const lRealFolders = ["src", "lib", "node_modules"];

    expect(getFolderCandidates(lCandidates)(lRealFolders)).to.deep.equal([
      "src",
    ]);
  });
});
describe("cli/init-config/environment-helpers - folderNameArrayToRE", () => {
  it("transforms an array of folder names into a regex string - empty", () => {
    expect(folderNameArrayToRE([])).to.equal("^()");
  });
  it("transforms an array of folder names into a regex string - one entry", () => {
    expect(folderNameArrayToRE(["src"])).to.equal("^(src)");
  });
  it("transforms an array of folder names into a regex string - more than one entry", () => {
    expect(folderNameArrayToRE(["bin", "src", "lib"])).to.equal(
      "^(bin|src|lib)"
    );
  });
});

describe("cli/init-config/environment-helpers - getFirstExistingFileName", () => {
  const WORKING_DIR = process.cwd();
  const FIXTURES_DIR =
    "test/cli/init-config/fixtures/get-first-existing-file-name";

  beforeEach("set up", () => {
    process.chdir(FIXTURES_DIR);
  });

  afterEach("tear down", () => {
    process.chdir(WORKING_DIR);
  });

  it("returns undefined when presented with an empty array", () => {
    expect(getFirstExistingFileName([])).to.be.undefined;
  });

  it("returns undefined when presented with an array of non-existing files", () => {
    expect(getFirstExistingFileName(["nope", "neither"])).to.be.undefined;
  });

  it("returns the first existing file in an array ", () => {
    expect(
      getFirstExistingFileName([
        "nope",
        "neither",
        "this-file-exists",
        "this-file-exists-as-well",
      ])
    ).to.equal("this-file-exists");
  });
});
