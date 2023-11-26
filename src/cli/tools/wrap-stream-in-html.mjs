import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const STYLESHEET_FILE = fileURLToPath(
  new URL("svg-in-html-snippets/style.css", import.meta.url),
);
const SCRIPT_FILE = fileURLToPath(
  new URL("svg-in-html-snippets/script.js", import.meta.url),
);

/**
 * @param {string} pStylesheet
 * @returns {string}
 */
function getHeader(pStylesheet) {
  return `<!doctype html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8" />
    <title>dependency graph</title>
    <style>
      ${pStylesheet}
    </style>
  </head>
  <body>
    <button id="button_help">?</button>
    <div id="hints" class="hint" style="display: none">
      <button id="close-hints">x</button>
      <span id="hint-text"></span>
      <ul>
        <li><b>Hover</b> - highlight</li>
        <li><b>Right-click</b> - pin highlight</li>
        <li><b>ESC</b> - clear</li>
      </ul>
    </div>
`;
}

/**
 * @param {string} pScript
 * @returns {string}
 */
function getFooter(pScript) {
  return `    <script>
      ${pScript}
    </script>
  </body>
</html>`;
}

/**
 * Slaps the stuff in the passed stream in between the contents
 * of the header and the footer and returns it as a string.
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
export default async function wrap(pInStream, pOutStream) {
  const [lStylesheet, lScript] = await Promise.all([
    readFile(STYLESHEET_FILE, "utf8"),
    readFile(SCRIPT_FILE, "utf8"),
  ]);

  pOutStream.write(getHeader(lStylesheet));
  pInStream
    .on("end", () => {
      pOutStream.write(getFooter(lScript));
      pOutStream.end();
    })
    .on(
      "error",
      /* c8 ignore start */
      (pError) => {
        process.stderr.write(`${pError}\n`);
      },
      /* c8 ignore stop */
    )
    /*
     * We could have put the whole html in a template literal, but we don't know
     * how large the svg that's going to be injected is going to be - it could just
     * as well be as large that if we're going to buffer it, it's going into out
     * of memory territory.
     *
     * We circumvent that by streaming the svg in between the header and the footer.
     */
    .on("data", (pChunk) => {
      pOutStream.write(pChunk);
    });
}
