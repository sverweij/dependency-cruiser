import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const STYLESHEET_FILE = fileURLToPath(
  new URL("svg-in-html-snippets/style.css", import.meta.url),
);
const SCRIPT_FILE = fileURLToPath(
  new URL("svg-in-html-snippets/script.cjs", import.meta.url),
);

/**
 * @param {string} pStylesheet
 * @returns {string}
 */
export function getHeader(pStylesheet) {
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
export function getFooter(pScript) {
  return `    <script>
      ${pScript}
    </script>
  </body>
</html>
`;
}

/**
 *
 * @param {string} pSVG
 * @returns {string}
 */
export function wrapInHTML(pSVG) {
  const lStylesheet = readFileSync(STYLESHEET_FILE, "utf8");
  const lScript = readFileSync(SCRIPT_FILE, "utf8");

  return getHeader(lStylesheet) + pSVG + getFooter(lScript);
}
