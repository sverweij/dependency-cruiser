import { ok, equal } from "node:assert/strict";
import { writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import deleteDammit from "../delete-dammit.utl.cjs";
import { WritableTestStream } from "../writable-test-stream.utl.mjs";
import writeConfig from "#cli/init-config/write-config.mjs";

const RULES_FILE_JS = ".dependency-cruiser.js";

describe("[U] cli/init-config/write-config", () => {
  const WORKINGDIR = process.cwd();

  afterEach("tear down", () => {
    process.chdir(WORKINGDIR);
  });

  it("writes if there's no file there yet", async () => {
    const lOutStream = new WritableTestStream(
      /Successfully created 'depcruise[.]config[.]js'/,
    );
    const lEmptyDirectory =
      "test/cli/__fixtures__/init-config/no-config-files-exist";
    const lCustomConfigFileName = "depcruise.config.js";
    const lConfigResultFileName = `./${join(
      "../__fixtures__/init-config/no-config-files-exist",
      lCustomConfigFileName,
    )}`;

    process.chdir(lEmptyDirectory);
    try {
      writeConfig(
        `module.exports = {
          aap: "noot mies",
          wim: { zus: "jet heide", does: "hok schapen" },
        }`,
        lCustomConfigFileName,
        lOutStream,
      );

      const lResult = await import(lConfigResultFileName);

      ok(lResult.default.hasOwnProperty("aap"));
      ok(lResult.default.hasOwnProperty("wim"));
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
      ok(pError.message.includes("already exists here - leaving it be"));
    }

    equal(lStillHere, false);

    equal(readFileSync(RULES_FILE_JS, "utf8"), "module.exports = {}");
  });
});
