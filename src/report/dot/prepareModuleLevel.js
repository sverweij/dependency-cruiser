const path = require("path").posix;
const _get = require("lodash/get");
const moduleUtl = require("./module-utl");

/**
 * Sort of smartly concatenate the given prefix and source:
 *
 * if it's an uri pattern (e.g. https://yadda, file://snorkel/bla)
 * simply concat.
 *
 * in all other cases path.posix.join the two
 *
 * @param {string} pPrefix - prefix
 * @param {string} pSource - filename
 * @return {string} prefix and filename concatenated
 */
function smartURIConcat(pPrefix, pSource) {
  if (pPrefix.match(/^[a-z]+:\/\//)) {
    return `${pPrefix}${pSource}`;
  } else {
    return path.join(pPrefix, pSource);
  }
}

function addURL(pInput) {
  const lPrefix = _get(pInput, "summary.optionsUsed.prefix", "");

  return pModule =>
    Object.assign(
      {},
      pModule,
      pModule.coreModule || pModule.couldNotResolve
        ? {}
        : { URL: smartURIConcat(lPrefix, pModule.source) }
    );
}

module.exports = (pResults, pTheme) => {
  return pResults.modules
    .sort(moduleUtl.compareOnSource)
    .map(moduleUtl.extractFirstTransgression)
    .map(moduleUtl.folderify)
    .map(moduleUtl.applyTheme(pTheme))
    .map(addURL(pResults));
};
