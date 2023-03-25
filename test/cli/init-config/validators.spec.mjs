import { expect } from "chai";
import { validateLocation } from "../../../src/cli/init-config/validators.mjs";

describe("[U] cli/init-config/inquirer-validators - validateLocation", () => {
  const WORKING_DIR = process.cwd();
  const lFixturesDirectory =
    "test/cli/__fixtures__/init-config/validate-location";

  afterEach("tear down", () => {
    process.chdir(WORKING_DIR);
  });

  it("returns an error message when provided with an empty string", () => {
    expect(validateLocation("")).to.equal(
      "'' doesn't seem to exist - please try again"
    );
  });

  it("returns an error message when provided with a non-existing folder name", () => {
    process.chdir(lFixturesDirectory);
    expect(validateLocation("non-existing-folder")).to.equal(
      "'non-existing-folder' doesn't seem to exist - please try again"
    );
  });

  it("returns an error message when provided with a name of a file that is not a folder", () => {
    process.chdir(lFixturesDirectory);
    expect(validateLocation("existing-file")).to.equal(
      "'existing-file' doesn't seem to be a folder - please try again"
    );
  });

  it("returns true when provided with an existing folder", () => {
    process.chdir(lFixturesDirectory);
    expect(validateLocation("existing-folder")).to.equal(true);
  });

  it("returns true when provided with a c.s.l. of existing folders", () => {
    process.chdir(lFixturesDirectory);
    expect(
      validateLocation("existing-folder, another-existing-folder")
    ).to.equal(true);
  });

  it("returns an error message when provided with a c.s.l. of existing + non-existing folders", () => {
    process.chdir(lFixturesDirectory);
    expect(
      validateLocation(
        "existing-folder, non-existing-folder, another-existing-folder"
      )
    ).to.equal(
      "'non-existing-folder' doesn't seem to exist - please try again"
    );
  });

  it("returns true when provided with an array of existing folders", () => {
    process.chdir(lFixturesDirectory);
    expect(
      validateLocation(["existing-folder", "another-existing-folder"])
    ).to.equal(true);
  });
});
