const fs = require("fs");
const path = require("path");
const getStream = require("get-stream");

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
 * @param {string} pHeaderFileName header
 * @param {string} pScriptFileName script
 * @param {string} pFooterFileName footer
 * @param {stream} pStream stream whose characters are to be slapped between header and footer
 * @returns {string} yadda
 */
async function wrap(
  pHeaderFileName,
  pScriptFileName,
  pFooterFileName,
  pStream
) {
  const lHeader = fs.readFileSync(pHeaderFileName, "utf8");
  const lScript = fs.readFileSync(pScriptFileName, "utf8");
  const lFooter = fs.readFileSync(pFooterFileName, "utf8");

  return `${lHeader}${await getStream(
    pStream
  )}<script>${lScript}</script>${lFooter}`;
}

module.exports = (pStream) =>
  wrap(HEADER_FILE, SCRIPT_FILE, FOOTER_FILE, pStream);
