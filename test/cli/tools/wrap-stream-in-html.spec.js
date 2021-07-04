const fs = require("fs");
const { Writable } = require("stream");
const chai = require("chai");
const wrapStreamInHTML = require("../../../src/cli/tools/wrap-stream-in-html");

const expect = chai.expect;

class WriteableExpectStream extends Writable {
  _write(pThing) {
    this.buffer += pThing.toString();
  }

  write(pThing) {
    this._write(pThing);
  }

  end() {
    expect(this.buffer).to.contain("<html");
    expect(this.buffer).to.contain("<style>");
    expect(this.buffer).to.contain('"name": "dependency-cruiser"');
    expect(this.buffer).to.contain("</html");
  }
}

describe("wrap-stream-in-html", () => {
  const lInStream = fs.createReadStream("package.json");
  const lOutStream = new WriteableExpectStream();

  it("Wraps the contens of a stream in html with some preloaded css", () => {
    wrapStreamInHTML(lInStream, lOutStream);
  });
});
