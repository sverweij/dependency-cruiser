/* eslint-disable no-unused-expressions */
const { expect } = require("chai");
const {
  validateFileExistence,
  validateLocation,
} = require("~/src/cli/init-config/inquirer-validators");

describe("cli/init-config/inquirer-validators - validateFileExistence", () => {
  const WORKING_DIR = process.cwd();
  const FIXTURES_DIR = "test/cli/init-config/fixtures/validate-file-existence";

  beforeEach("set up", () => {
    process.chdir(FIXTURES_DIR);
  });

  afterEach("tear down", () => {
    process.chdir(WORKING_DIR);
  });

  it("returns an error message when presented with an empty string", () => {
    expect(validateFileExistence("")).to.equal(
      `hmm, '' doesn't seem to exist - could you try again?`
    );
  });

  it("returns an error message when presented with a name of a non existing file", () => {
    expect(validateFileExistence("nope-does-not-exist")).to.equal(
      `hmm, 'nope-does-not-exist' doesn't seem to exist - could you try again?`
    );
  });

  it("returns true when presented with the name of a file that does exist", () => {
    expect(validateFileExistence("i-have-bytes-therefore-i-exist")).to.be.true;
  });
});

describe("cli/init-config/inquirer-validators - validateLocation", () => {
  const WORKING_DIR = process.cwd();
  const FIXTURES_DIR = "test/cli/fixtures/init-config/validate-location";

  afterEach("tear down", () => {
    process.chdir(WORKING_DIR);
  });

  it("returns an error message when provided with an empty string", () => {
    expect(validateLocation("")).to.equal(
      "'' doesn't seem to exist - please try again"
    );
  });

  it("returns an error message when provided with a non-existing folder name", () => {
    process.chdir(FIXTURES_DIR);
    expect(validateLocation("non-existing-folder")).to.equal(
      "'non-existing-folder' doesn't seem to exist - please try again"
    );
  });

  it("returns an error message when provided with a name of a file that is not a folder", () => {
    process.chdir(FIXTURES_DIR);
    expect(validateLocation("existing-file")).to.equal(
      "'existing-file' doesn't seem to be a folder - please try again"
    );
  });

  it("returns true when provided with an existing folder", () => {
    process.chdir(FIXTURES_DIR);
    expect(validateLocation("existing-folder")).to.equal(true);
  });

  it("returns true when provided with a c.s.l. of existing folders", () => {
    process.chdir(FIXTURES_DIR);
    expect(
      validateLocation("existing-folder, another-existing-folder")
    ).to.equal(true);
  });

  it("returns an error message when provided with a c.s.l. of existing + non-existing folders", () => {
    process.chdir(FIXTURES_DIR);
    expect(
      validateLocation(
        "existing-folder, non-existing-folder, another-existing-folder"
      )
    ).to.equal(
      "'non-existing-folder' doesn't seem to exist - please try again"
    );
  });

  it("returns true when provided with an array of existing folders", () => {
    process.chdir(FIXTURES_DIR);
    expect(
      validateLocation(["existing-folder", "another-existing-folder"])
    ).to.equal(true);
  });
});
