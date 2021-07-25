const fs = require("fs");
const path = require("path");
const chai = require("chai");
const deleteDammit = require("../delete-dammit.utl.cjs");
const writeConfig = require("../../../src/cli/init-config/write-config");

const RULES_FILE_JS = ".dependency-cruiser.js";
const expect = chai.expect;

describe("cli/init-config/write-config", () => {
  const WORKINGDIR = process.cwd();

  afterEach("tear down", () => {
    process.chdir(WORKINGDIR);
  });

  it("writes if there's no file there yet", () => {
    const lEmptyDirectory =
      "test/cli/fixtures/init-config/no-config-files-exist";
    const lCustomConfigFileName = "depcruise.config.js";
    const lConfigResultFileName = `./${path.join(
      "../fixtures/init-config/no-config-files-exist",
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
      // eslint-disable-next-line node/global-require,import/no-dynamic-require,security/detect-non-literal-require
      const lResult = require(lConfigResultFileName);

      expect(lResult).to.haveOwnProperty("aap");
      expect(lResult).to.haveOwnProperty("wim");
    } finally {
      Reflect.deleteProperty(
        require.cache,
        require.resolve(lConfigResultFileName)
      );
      deleteDammit(lCustomConfigFileName);
    }
  });

  it("does not overwrite an existing config", () => {
    process.chdir("test/cli/fixtures/init-config/config-file-exists");
    let lStillHere = true;

    fs.writeFileSync(RULES_FILE_JS, "module.exports = {}", {
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

    expect(fs.readFileSync(RULES_FILE_JS, "utf8")).to.equal(
      "module.exports = {}"
    );
  });
});
