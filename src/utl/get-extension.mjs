// @ts-check
import { extname } from "node:path";

const EXTENSION_RE = /(?<extension>(?:(?:\.d\.(?:c|m)?ts)|\.coffee\.md)$)/;

/**
 * Returns the extension of the given file name path.
 *
 * Just using path.extname would be fine for most cases,
 * except for coffeescript, where a markdown extension can
 * mean literate coffeescript, and for typescript where
 * .d.ts, .d.cts, .d.mts are slightly different beasts from
 * .ts, .cts and .mts
 *
 * @param {string} pFileName path to the file to be parsed
 * @return {string}          extension
 */
export default function getExtension(pFileName) {
  const lMatchResult = pFileName.match(EXTENSION_RE);

  return lMatchResult?.groups?.extension ?? extname(pFileName);
}
