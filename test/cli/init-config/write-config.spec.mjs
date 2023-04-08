import { writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expect } from "chai";
import deleteDammit from "../delete-dammit.utl.cjs";
import writeConfig from "../../../src/cli/init-config/write-config.mjs";

const RULES_FILE_JS = ".dependency-cruiser.js";

describe("[U] cli/init-config/write-config", () => {
  const WORKINGDIR = process.cwd();

  afterEach("tear down", () => {
    process.chdir(WORKINGDIR);
  });

  it("writes if there's no file there yet", async () => {
    const lEmptyDirectory =
      "test/cli/__fixtures__/init-config/no-config-files-exist";
    const lCustomConfigFileName = "depcruise.config.js";
    const lConfigResultFileName = `./${join(
      "../__fixtures__/init-config/no-config-files-exist",
      lCustomConfigFileName
    )}`;

    process.chdir(lEmptyDirectory);
    try {
      writeConfig(
        `module.exports = {
          aap: "noot mies",
          wim: { zus: "jet heide", does: "hok schapen" },
        }`,
        lCustomConfigFileName
      );

      const lResult = await import(lConfigResultFileName);

      expect(lResult.default).to.haveOwnProperty("aap");
      expect(lResult.default).to.haveOwnProperty("wim");
    } finally {
      deleteDammit(lCustomConfigFileName);
    }
  });

  it("does not overwrite an existing config", () => {
    process.chdir("test/cli/__fixtures__/init-config/config-file-exists");
    let lStillHere = true;

    writeFileSync(RULES_FILE_JS, "module.exports = {}", {
      encoding: "utf8",
      flag: "w",
    });
    try {
      writeConfig(`{
        aap: "noot mies",
        wim: { zus: "jet heide", does: "hok schapen" },
      }`);
    } catch (pError) {
      lStillHere = false;
      expect(pError.message).to.contain("already exists here - leaving it be");
    }

    expect(lStillHere).to.equal(false);

    expect(readFileSync(RULES_FILE_JS, "utf8")).to.equal("module.exports = {}");
  });
});
