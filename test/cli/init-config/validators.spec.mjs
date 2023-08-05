import { strictEqual } from "node:assert";
import { validateLocation } from "../../../src/cli/init-config/validators.mjs";

describe("[U] cli/init-config/inquirer-validators - validateLocation", () => {
  const WORKING_DIR = process.cwd();
  const lFixturesDirectory =
    "test/cli/__fixtures__/init-config/validate-location";

  afterEach("tear down", () => {
    process.chdir(WORKING_DIR);
  });

  it("returns an error message when provided with an empty string", () => {
    strictEqual(
      validateLocation(""),
      "'' doesn't seem to exist - please try again",
    );
  });

  it("returns an error message when provided with a non-existing folder name", () => {
    process.chdir(lFixturesDirectory);
    strictEqual(
      validateLocation("non-existing-folder"),
      "'non-existing-folder' doesn't seem to exist - please try again",
    );
  });

  it("returns an error message when provided with a name of a file that is not a folder", () => {
    process.chdir(lFixturesDirectory);
    strictEqual(
      validateLocation("existing-file"),
      "'existing-file' doesn't seem to be a folder - please try again",
    );
  });

  it("returns true when provided with an existing folder", () => {
    process.chdir(lFixturesDirectory);
    strictEqual(validateLocation("existing-folder"), true);
  });

  it("returns true when provided with a c.s.l. of existing folders", () => {
    process.chdir(lFixturesDirectory);
    strictEqual(
      validateLocation("existing-folder, another-existing-folder"),
      true,
    );
  });

  it("returns an error message when provided with a c.s.l. of existing + non-existing folders", () => {
    process.chdir(lFixturesDirectory);
    strictEqual(
      validateLocation(
        "existing-folder, non-existing-folder, another-existing-folder",
      ),
      "'non-existing-folder' doesn't seem to exist - please try again",
    );
  });

  it("returns true when provided with an array of existing folders", () => {
    process.chdir(lFixturesDirectory);
    strictEqual(
      validateLocation(["existing-folder", "another-existing-folder"]),
      true,
    );
  });
});
