const fs = require("fs");
const path = require("path");
const { expect } = require("chai");
const deleteDammit = require("./delete-dammit.utl");
const format = require("~/src/cli/format");

describe("cli/format", () => {
  it("formats a cruise result and writes it to file", async () => {
    const lOutFile = "thing";

    deleteDammit(lOutFile);

    const lExitCode = await format(
      path.join(__dirname, "fixtures", "empty.json"),
      {
        outputTo: lOutFile,
      }
    );

    expect(fs.readFileSync(lOutFile, "utf8")).to.contain(
      "dependencies cruised"
    );
    expect(lExitCode).to.equal(0);
    deleteDammit(lOutFile);
  });

  it("returns a non-zero exit code when there's error level dependency violations in the output and ", async () => {
    const lOutFile = "otherthing";

    deleteDammit(lOutFile);

    const lExitCode = await format(
      path.join(
        __dirname,
        "fixtures",
        "result-has-a-dependency-violation.json"
      ),
      {
        outputTo: lOutFile,
      }
    );

    expect(lExitCode).to.equal(1);
    deleteDammit(lOutFile);
  });
});
