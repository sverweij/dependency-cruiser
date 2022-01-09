/* eslint-disable no-unused-expressions */
import { expect } from "chai";
import validators from "../../../src/cli/init-config/inquirer-validators.js";

describe("[U] cli/init-config/inquirer-validators - validateFileExistence", () => {
  const WORKING_DIR = process.cwd();
  const lFixturesDirectory =
    "test/cli/init-config/__fixtures__/validate-file-existence";

  beforeEach("set up", () => {
    process.chdir(lFixturesDirectory);
  });

  afterEach("tear down", () => {
    process.chdir(WORKING_DIR);
  });

  it("returns an error message when presented with an empty string", () => {
    expect(validators.validateFileExistence("")).to.equal(
      `hmm, '' doesn't seem to exist - could you try again?`
    );
  });

  it("returns an error message when presented with a name of a non existing file", () => {
    expect(validators.validateFileExistence("nope-does-not-exist")).to.equal(
      `hmm, 'nope-does-not-exist' doesn't seem to exist - could you try again?`
    );
  });

  it("returns true when presented with the name of a file that does exist", () => {
    expect(validators.validateFileExistence("i-have-bytes-therefore-i-exist"))
      .to.be.true;
  });
});

describe("[U] cli/init-config/inquirer-validators - validateLocation", () => {
  const WORKING_DIR = process.cwd();
  const lFixturesDirectory =
    "test/cli/__fixtures__/init-config/validate-location";

  afterEach("tear down", () => {
    process.chdir(WORKING_DIR);
  });

  it("returns an error message when provided with an empty string", () => {
    expect(validators.validateLocation("")).to.equal(
      "'' doesn't seem to exist - please try again"
    );
  });

  it("returns an error message when provided with a non-existing folder name", () => {
    process.chdir(lFixturesDirectory);
    expect(validators.validateLocation("non-existing-folder")).to.equal(
      "'non-existing-folder' doesn't seem to exist - please try again"
    );
  });

  it("returns an error message when provided with a name of a file that is not a folder", () => {
    process.chdir(lFixturesDirectory);
    expect(validators.validateLocation("existing-file")).to.equal(
      "'existing-file' doesn't seem to be a folder - please try again"
    );
  });

  it("returns true when provided with an existing folder", () => {
    process.chdir(lFixturesDirectory);
    expect(validators.validateLocation("existing-folder")).to.equal(true);
  });

  it("returns true when provided with a c.s.l. of existing folders", () => {
    process.chdir(lFixturesDirectory);
    expect(
      validators.validateLocation("existing-folder, another-existing-folder")
    ).to.equal(true);
  });

  it("returns an error message when provided with a c.s.l. of existing + non-existing folders", () => {
    process.chdir(lFixturesDirectory);
    expect(
      validators.validateLocation(
        "existing-folder, non-existing-folder, another-existing-folder"
      )
    ).to.equal(
      "'non-existing-folder' doesn't seem to exist - please try again"
    );
  });

  it("returns true when provided with an array of existing folders", () => {
    process.chdir(lFixturesDirectory);
    expect(
      validators.validateLocation([
        "existing-folder",
        "another-existing-folder",
      ])
    ).to.equal(true);
  });
});
