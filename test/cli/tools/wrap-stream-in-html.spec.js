const fs = require("fs");
const chai = require("chai");
const wrapStreamInHTML = require("../../../src/cli/tools/wrap-stream-in-html");

const expect = chai.expect;

describe("wrap-stream-in-html", () => {
  const lStream = fs.createReadStream("package.json");

  it("Wraps the contens of a stream in html with some preloaded css", async () => {
    const lResultHTML = await wrapStreamInHTML(lStream);

    expect(lResultHTML).to.contain("<html");
    expect(lResultHTML).to.contain("<style>");
    expect(lResultHTML).to.contain('"name": "dependency-cruiser"');
    expect(lResultHTML).to.contain("</html");
  });
});
