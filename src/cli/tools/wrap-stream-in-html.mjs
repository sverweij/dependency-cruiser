import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { getHeader, getFooter } from "#report/dot-webpage/wrap-in-html.mjs";

const STYLESHEET_FILE = fileURLToPath(
  new URL(
    "../../report/dot-webpage/svg-in-html-snippets/style.css",
    import.meta.url,
  ),
);
const SCRIPT_FILE = fileURLToPath(
  new URL(
    "../../report/dot-webpage/svg-in-html-snippets/script.cjs",
    import.meta.url,
  ),
);

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
