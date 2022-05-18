const fs = require("fs");
const path = require("path");

const HEADER_FILE = path.join(
  __dirname,
  "svg-in-html-snippets",
  "header.snippet.html"
);
const SCRIPT_FILE = path.join(
  __dirname,
  "svg-in-html-snippets",
  "script.snippet.js"
);
const FOOTER_FILE = path.join(
  __dirname,
  "svg-in-html-snippets",
  "footer.snippet.html"
);

/**
 * Slaps the stuff in the passed stream in between the contents
 * of the header and the footer file and returns it as a string.
 *
 * Almost exactly the same as:
 * ```sh
 * cat pHeaderFileName - pFooterFileName
 * ```
 *
 * ... but portable over node platforms
 *
 * @param {readStream} pStream stream whose characters are to be slapped between header and footer
 * @param {writeStream} pOutStream stream to write to
 */
module.exports = function wrap(pInStream, pOutStream) {
  const lHeader = fs.readFileSync(HEADER_FILE, "utf8");
  const lScript = fs.readFileSync(SCRIPT_FILE, "utf8");
  const lEnd = fs.readFileSync(FOOTER_FILE, "utf8");
  const lFooter = `<script>${lScript}</script>${lEnd}`;

  pOutStream.write(lHeader);
  pInStream
    .on("end", () => {
      pOutStream.write(lFooter);
      pOutStream.end();
    })
    .on(
      "error",
      /* c8 ignore start */
      (pError) => {
        process.stderr.write(`${pError}\n`);
      }
      /* c8 ignore stop */
    )
    .on("data", (pChunk) => {
      pOutStream.write(pChunk);
    });
};
