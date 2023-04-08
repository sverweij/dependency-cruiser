import { createReadStream } from "node:fs";
import { Writable } from "node:stream";
import { expect } from "chai";
import wrapStreamInHTML from "../../../src/cli/tools/wrap-stream-in-html.mjs";

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

describe("[I] wrap-stream-in-html", () => {
  const lInStream = createReadStream("package.json");
  const lOutStream = new WriteableExpectStream();

  it("Wraps the contens of a stream in html with some preloaded css", () => {
    wrapStreamInHTML(lInStream, lOutStream);
  });
});
