const fs = require("fs");
const path = require("path");
const expect = require("chai").expect;
const format = require("../../src/cli/format");
const deleteDammit = require("./delete-dammit.utl");

describe("cli/format", () => {
  it("formats a cruise result and writes it to file", async () => {
    const lOutFile = "thing";

    deleteDammit(lOutFile);

    await format(path.join(__dirname, "fixtures", "empty.json"), {
      outputTo: lOutFile,
    });

    expect(fs.readFileSync(lOutFile, "utf8")).to.contain(
      "dependencies cruised"
    );
    deleteDammit(lOutFile);
  });
});
