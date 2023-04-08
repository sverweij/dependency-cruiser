import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const HEADER_FILE = fileURLToPath(
  new URL("svg-in-html-snippets/header.snippet.html", import.meta.url)
);
const SCRIPT_FILE = fileURLToPath(
  new URL("svg-in-html-snippets/script.snippet.js", import.meta.url)
);
const FOOTER_FILE = fileURLToPath(
  new URL("svg-in-html-snippets/footer.snippet.html", import.meta.url)
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
export default function wrap(pInStream, pOutStream) {
  const lHeader = readFileSync(HEADER_FILE, "utf8");
  const lScript = readFileSync(SCRIPT_FILE, "utf8");
  const lEnd = readFileSync(FOOTER_FILE, "utf8");
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
}
