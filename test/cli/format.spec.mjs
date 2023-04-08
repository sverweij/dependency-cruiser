/* eslint-disable no-magic-numbers */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { expect } from "chai";
import format from "../../src/cli/format.mjs";
import deleteDammit from "./delete-dammit.utl.cjs";

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

    expect(readFileSync(lOutFile, "utf8")).to.contain("dependencies cruised");
    expect(lExitCode).to.equal(0);
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
      }
    );
    const lResult = JSON.parse(readFileSync(lOutFile, "utf8"));
    expect(lResult.summary.error).to.equal(0);
    expect(lResult.summary.totalCruised).to.be.lessThan(175);
    expect(lResult.summary.totalDependenciesCruised).to.be.lessThan(298);
    expect(lResult.summary.violations.length).to.equal(1);
    expect(lResult.modules.map((pModule) => pModule.source)).to.not.include(
      "bin/depcruise-fmt.mjs"
    );
    expect(lResult.modules.map((pModule) => pModule.source)).to.include(
      "src/main/index.js"
    );
    expect(lResult.modules.map((pModule) => pModule.source)).to.include(
      "src/cli/index.js"
    );
    expect(lResult.modules.map((pModule) => pModule.source)).to.not.include(
      "src/cli/init-config/index.js"
    );
    expect(lExitCode).to.equal(0);
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
      }
    );
    const lResult = JSON.parse(readFileSync(lOutFile, "utf8"));

    expect(lResult.summary.optionsUsed.prefix).to.equal(lAlternatePrefix);

    deleteDammit(lOutFile);
  });

  it("returns a non-zero exit code when there's error level dependency violations in the output (regardless the value of exitCode)", async () => {
    const lOutFile = "otherthing";

    deleteDammit(lOutFile);

    const lExitCode = await format(
      relative("__fixtures__/result-has-a-dependency-violation.json"),
      {
        outputTo: lOutFile,
      }
    );

    expect(lExitCode).to.equal(2);
    deleteDammit(lOutFile);
  });
});
