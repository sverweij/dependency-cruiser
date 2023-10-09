import { createReadStream } from "node:fs";
import { Writable } from "node:stream";
import { equal } from "node:assert/strict";
import wrapStreamInHTML from "#cli/tools/wrap-stream-in-html.mjs";

class WriteableExpectStream extends Writable {
  _write(pThing) {
    this.buffer += pThing.toString();
  }

  write(pThing) {
    this._write(pThing);
  }

  end() {
    equal(this.buffer.includes("<html"), true);
    equal(this.buffer.includes("</style>"), true);
    equal(this.buffer.includes('"name": "dependency-cruiser"'), true);
    equal(this.buffer.includes("</html"), true);
  }
}

describe("[I] wrap-stream-in-html", () => {
  const lInStream = createReadStream("package.json");
  const lOutStream = new WriteableExpectStream();

  it("Wraps the contens of a stream in html with some preloaded css", () => {
    wrapStreamInHTML(lInStream, lOutStream);
  });
});
