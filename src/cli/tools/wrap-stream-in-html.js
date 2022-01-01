const fs = require("fs");
const path = require("path");

const htmlPath = path.join(__dirname, "svg-in-html-snippets", "index.html");
const cssPath = path.join(__dirname, "svg-in-html-snippets", "cruiser.css");
const scriptPath = path.join(
  __dirname,
  "svg-in-html-snippets",
  "script.snippet.js"
);

const streamToString = (pStream) => {
  const lChunks = [];
  return new Promise((pResolve, pReject) => {
    pStream.on("data", (pChunk) => lChunks.push(Buffer.from(pChunk)));
    pStream.on("end", () => pResolve(Buffer.concat(lChunks).toString("utf8")));
    pStream.on("error", (pError) => pReject(pError));
  });
};

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
 * @param {ReadStream} pStream stream whose characters are to be slapped between header and footer
 * @param {WriteStream} pOutStream stream to write to
 */
const wrap = async (pInStream, pOutStream) => {
  const html = fs.readFileSync(htmlPath, "utf8");
  const css = fs.readFileSync(cssPath, "utf8");
  const script = fs.readFileSync(scriptPath, "utf8");

  const svg = await streamToString(pInStream);

  const result = html
    .replace("{{ cruiser-style }}", css)
    .replace(
      "{{ cruiser-svg }}",
      svg.replace(/ xlink:href=/g, ` target="_blank" xlink:href=`)
    )
    .replace("{{ canvas-handler }}", script);

  pOutStream.write(result);
};

module.exports = (pInStream, pOutStream) => wrap(pInStream, pOutStream);
