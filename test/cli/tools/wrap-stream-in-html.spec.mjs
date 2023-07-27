import { createReadStream } from "node:fs";
import { Writable } from "node:stream";
import { strictEqual } from "node:assert";
import wrapStreamInHTML from "../../../src/cli/tools/wrap-stream-in-html.mjs";

class WriteableExpectStream extends Writable {
  _write(pThing) {
    this.buffer += pThing.toString();
  }

  write(pThing) {
    this._write(pThing);
  }

  end() {
    strictEqual(this.buffer.includes("<html"), true);
    strictEqual(this.buffer.includes("</style>"), true);
    strictEqual(this.buffer.includes('"name": "dependency-cruiser"'), true);
    strictEqual(this.buffer.includes("</html"), true);
  }
}

describe("[I] wrap-stream-in-html", () => {
  const lInStream = createReadStream("package.json");
  const lOutStream = new WriteableExpectStream();

  it("Wraps the contens of a stream in html with some preloaded css", () => {
    wrapStreamInHTML(lInStream, lOutStream);
  });
});
