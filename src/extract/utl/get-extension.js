// @ts-check
const path = require("path");

const EXTENSION_RE = /(?<extension>((\.d\.(c|m)?ts)|\.coffee\.md)$)/;

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
module.exports = function getExtensions(pFileName) {
  const lMatchResult = pFileName.match(EXTENSION_RE);

  if (lMatchResult) {
    // @ts-expect-error if there _is_ a non-falsy result in
    // lMatchResult we're sure there is a groups object in there
    // with an extension attribute. TS doesn't detect that, however.
    // we could also, more elegantly
    //
    //   return lMatchResult?.groups?.extension ?? path.extname(pFileName);
    //
    // which TS _does_ understand, but we still support node 12
    // where this is invalid syntax
    return lMatchResult.groups.extension;
  }

  return path.extname(pFileName);
};
