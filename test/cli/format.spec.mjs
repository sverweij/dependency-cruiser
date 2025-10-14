/* eslint-disable no-magic-numbers */
import { readFileSync } from "node:fs";
import { equal } from "node:assert/strict";
import { fileURLToPath } from "node:url";
import deleteDammit from "./delete-dammit.utl.cjs";
import format from "#cli/format.mjs";

function relative(pFileName) {
  return fileURLToPath(new URL(pFileName, import.meta.url));
}
describe("[E] cli/format", () => {
  it("formats a cruise result and writes it to file", async () => {
    const lOutFile = "thing";

    deleteDammit(lOutFile);

    const lExitCode = await format(relative("__fixtures__/empty.json"), {
      outputTo: lOutFile,
    });

    equal(
      readFileSync(lOutFile, "utf8").includes("dependencies cruised"),
      true,
    );
    equal(lExitCode, 0);
    deleteDammit(lOutFile);
  });

  it("formats a cruise result, --focus filter works and writes it to a file", async () => {
    const lOutFile = "thing.json";

    deleteDammit(lOutFile);

    const lExitCode = await format(
      relative("__fixtures__/result-has-a-dependency-violation.json"),
      {
        outputTo: lOutFile,
        outputType: "json",
        focus: "^src/main",
      },
    );
    const lResult = JSON.parse(readFileSync(lOutFile, "utf8"));
    equal(lResult.summary.error, 0);
    equal(lResult.summary.totalCruised < 175, true);
    equal(lResult.summary.totalDependenciesCruised < 298, true);
    equal(lResult.summary.violations.length, 1);
    equal(
      lResult.modules
        .map((pModule) => pModule.source)
        .includes("bin/depcruise-fmt.mjs"),
      false,
    );
    equal(
      lResult.modules
        .map((pModule) => pModule.source)
        .includes("src/main/index.js"),
      true,
    );
    equal(
      lResult.modules
        .map((pModule) => pModule.source)
        .includes("src/cli/index.js"),
      true,
    );
    equal(
      lResult.modules
        .map((pModule) => pModule.source)
        .includes("src/cli/init-config/index.js"),
      false,
    );
    equal(lExitCode, 0);
    deleteDammit(lOutFile);
  });

  it("formats a cruise result --prefix is reflected into the summary", async () => {
    const lOutFile = "thing.json";
    const lAlternatePrefix = "http://localhost:2022/";

    deleteDammit(lOutFile);

    await format(
      relative("__fixtures__/result-has-a-dependency-violation.json"),
      {
        outputTo: lOutFile,
        outputType: "json",
        prefix: lAlternatePrefix,
      },
    );
    const lResult = JSON.parse(readFileSync(lOutFile, "utf8"));

    equal(lResult.summary.optionsUsed.prefix, lAlternatePrefix);

    deleteDammit(lOutFile);
  });

  it("formats a cruise result --suffix is reflected into the summary", async () => {
    const lOutFile = "thing.json";
    const lAlternateSuffix = ".gcov.html";

    deleteDammit(lOutFile);

    await format(
      relative("__fixtures__/result-has-a-dependency-violation.json"),
      {
        outputTo: lOutFile,
        outputType: "json",
        suffix: lAlternateSuffix,
      },
    );
    const lResult = JSON.parse(readFileSync(lOutFile, "utf8"));

    equal(lResult.summary.optionsUsed.suffix, lAlternateSuffix);

    deleteDammit(lOutFile);
  });

  it("returns a non-zero exit code when there's error level dependency violations in the output (regardless the value of exitCode)", async () => {
    const lOutFile = "otherthing";

    deleteDammit(lOutFile);

    const lExitCode = await format(
      relative("__fixtures__/result-has-a-dependency-violation.json"),
      {
        outputTo: lOutFile,
      },
    );

    equal(lExitCode, 2);
    deleteDammit(lOutFile);
  });
});
