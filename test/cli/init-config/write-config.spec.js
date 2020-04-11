const fs = require("fs");
const path = require("path");
const chai = require("chai");
const writeConfig = require("../../../src/cli/init-config/write-config");
const deleteDammit = require("../delete-dammit.utl");

const RULES_FILE_JS = ".dependency-cruiser.js";
const expect = chai.expect;

describe("cli/init-config/write-config", () => {
  const WORKINGDIR = process.cwd();

  afterEach("tear down", () => {
    process.chdir(WORKINGDIR);
  });

  it("writes if there's no file there yet", () => {
    const EMPTY_DIR = "test/cli/fixtures/init-config/no-config-files-exist";
    const CUSTOM_CONFIG_FILE_NAME = "depcruise.config.js";
    const lConfigResultFileName = `./${path.join(
      "../fixtures/init-config/no-config-files-exist",
      CUSTOM_CONFIG_FILE_NAME
    )}`;

    process.chdir(EMPTY_DIR);
    try {
      writeConfig(
        `module.exports = {
          aap: "noot mies",
          wim: { zus: "jet heide", does: "hok schapen" },
        }`,
        CUSTOM_CONFIG_FILE_NAME
      );
      // eslint-disable-next-line node/global-require,import/no-dynamic-require,security/detect-non-literal-require
      const lResult = require(lConfigResultFileName);

      expect(lResult).to.haveOwnProperty("aap");
      expect(lResult).to.haveOwnProperty("wim");
    } finally {
      Reflect.deleteProperty(
        require.cache,
        require.resolve(lConfigResultFileName)
      );
      deleteDammit(CUSTOM_CONFIG_FILE_NAME);
    }
  });

  it("does not overwrite an existing config", () => {
    process.chdir("test/cli/fixtures/init-config/config-file-exists");
    let lStillHere = true;

    fs.writeFileSync(RULES_FILE_JS, "module.exports = {}", {
      encoding: "utf8",
      flag: "w"
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

    expect(fs.readFileSync(RULES_FILE_JS, "utf8")).to.equal(
      "module.exports = {}"
    );
  });
});
