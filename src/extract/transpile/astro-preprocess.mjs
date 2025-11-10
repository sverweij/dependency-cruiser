const FRONTMATTER_PATTERN = /^---\s*\r?\n([\s\S]*?)\r?\n---/;
const SCRIPT_TAG_PATTERN = /<script\b[^>]*>([\s\S]*?)<\/script>/gm;
const STATIC_IMPORT_PATTERN = /^\s*(import[^"']+["'][^"']+["'][;]?)\s*$/gm;

/**
 * Ensures that an import statement ends with a semicolon.
 * @param {string} pImportStatement
 * @returns {string}
 */
function ensureImportTerminator(pImportStatement) {
  const lTrimmed = pImportStatement.trim();

  return lTrimmed.endsWith(";") ? lTrimmed : `${lTrimmed};`;
}

/**
 * Injects import statements into the frontmatter of an Astro file.
 *
 * @param {string} pSource
 * @param {string[]} pImports
 * @returns {string}
 */
function injectImportsIntoFrontmatter(pSource, pImports) {
  if (pImports.length === 0) {
    return pSource;
  }

  const lFrontmatterMatch = pSource.match(FRONTMATTER_PATTERN);
  const lEol = pSource.includes("\r\n") ? "\r\n" : "\n";
  const lInsertion = pImports.join(lEol);

  if (!lFrontmatterMatch) {
    const lFrontmatter = `---${lEol}${lInsertion}${lEol}---${lEol}`;

    return `${lFrontmatter}${pSource}`;
  }

  const lFullMatch = lFrontmatterMatch[0];
  const lBody = lFrontmatterMatch[1] ?? "";
  const lNewBody =
    lBody.length > 0 ? `${lInsertion}${lEol}${lBody}` : lInsertion;
  const lNewFrontmatter = `---${lEol}${lNewBody}${lEol}---`;

  return pSource.replace(lFullMatch, lNewFrontmatter);
}

/**
 * We cannot analyze static imports inside `<script>` blocks in Astro files without special handling.
 * This is because `convertToTSX()` transforms script tag like below.
 *
 * ```tsx
 * // from this Astro file:
 * <script>
 *   import foo from "./foo.js";
 * </script>
 *
 * // to this TSX:
 * <script>
 *  {() => {
 *    import foo from "./foo.js";
 *  }}
 * </script>
 * ```
 *
 * To work around this, we hoist static imports from <script> blocks into the frontmatter.
 *
 * This differs from how Astro / Vite actually handles modules during the build process or on the runtime, but it's sufficient for tracking import dependencies at the file level.
 *
 * @param {string} pSource
 * @returns {string}
 */
function hoistScriptImportsIntoFrontmatter(pSource) {
  /**
   * @type {string[]}
   */
  const lImportsToBeHoisted = [];

  const lSourceWithoutScriptImports = pSource.replace(
    SCRIPT_TAG_PATTERN,
    (pFullMatch, pScriptContent) => {
      let lShouldHoistThisScript = false;

      const lScriptAfterHoisting = pScriptContent.replace(
        STATIC_IMPORT_PATTERN,
        (_pMatch, pImport) => {
          if (pImport) {
            lImportsToBeHoisted.push(ensureImportTerminator(pImport));
            lShouldHoistThisScript = true;
          }
          return "";
        },
      );

      return lShouldHoistThisScript
        ? pFullMatch.replace(pScriptContent, lScriptAfterHoisting)
        : pFullMatch;
    },
  );

  return injectImportsIntoFrontmatter(
    lSourceWithoutScriptImports,
    lImportsToBeHoisted,
  );
}

/**
 * Preprocesses Astro source code by hoisting static imports from <script> blocks
 * into the frontmatter section.
 *
 * @param {string} pSource - The Astro source code to preprocess
 * @returns {string} - The preprocessed source code with hoisted imports
 */
export function preProcess(pSource) {
  return hoistScriptImportsIntoFrontmatter(pSource);
}
