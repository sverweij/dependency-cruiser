/* eslint-disable security/detect-non-literal-regexp */
import { match, strictEqual } from "node:assert";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { getExternalPluginReporter } from "../../../src/report/plugins.mjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const FIXTURE_DIRECTORY = join(__dirname, "__fixtures__");

describe("[I] report/plugins - getExternalPluginReporter", () => {
  it("throws when the plugin:reporter is not a valid plugin (missing exit code)", async () => {
    const lNoExitCodePlugin = join(
      FIXTURE_DIRECTORY,
      "invalid-no-exit-code-plugin.cjs",
    );
    let lErrorMessage = "none";

    try {
      await getExternalPluginReporter(`plugin:file://${lNoExitCodePlugin}`);
    } catch (pError) {
      lErrorMessage = pError.message;
    }
    match(
      lErrorMessage,
      new RegExp(`${lNoExitCodePlugin} is not a valid plugin`),
    );
  });

  it("throws when the plugin:reporter is not a valid plugin (missing output)", async () => {
    const lNoOutputPlugin = join(
      FIXTURE_DIRECTORY,
      "invalid-no-output-plugin.cjs",
    );
    let lErrorMessage = "none";

    try {
      await getExternalPluginReporter(`plugin:file://${lNoOutputPlugin}`);
    } catch (pError) {
      lErrorMessage = pError.message;
    }
    match(
      lErrorMessage,
      new RegExp(`${lNoOutputPlugin} is not a valid plugin`),
    );
  });

  it("throws when the plugin:reporter does not exist", async () => {
    let lErrorMessage = "none";

    try {
      await getExternalPluginReporter(`plugin:this-plugin-does-not-exist`);
    } catch (pError) {
      lErrorMessage = pError.message;
    }
    match(
      lErrorMessage,
      /Could not find reporter plugin 'this-plugin-does-not-exist'/,
    );
  });

  it("returns false when it's not a plugin", async () => {
    strictEqual(
      await getExternalPluginReporter(`whatever-just-not-a-plugin`),
      false,
    );
    strictEqual(getExternalPluginReporter(), false);
  });

  it("throws when the plugin:reporter is not a valid plugin (package ref)", async () => {
    let lErrorMessage = "none";

    try {
      await getExternalPluginReporter(`plugin:watskeburt`);
    } catch (pError) {
      lErrorMessage = pError.message;
    }
    match(lErrorMessage, /watskeburt is not a valid plugin/);
  });

  it("returns the plugin module when it's valid and exists", async () => {
    const lSampleReporter = await getExternalPluginReporter(
      "plugin:dependency-cruiser/sample-reporter-plugin",
    );
    const lResults = lSampleReporter({
      modules: [],
      summary: { totalCruised: 0 },
    });

    strictEqual(hasOwnProperty.call(lResults, "output"), true);
    strictEqual(hasOwnProperty.call(lResults, "exitCode"), true);
    strictEqual(lResults.exitCode, 0);
  });
});
