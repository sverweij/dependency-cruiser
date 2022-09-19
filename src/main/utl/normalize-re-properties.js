const get = require("lodash/get");
const has = require("lodash/has");
const set = require("lodash/set");
const cloneDeep = require("lodash/cloneDeep");

const RE_PROPERTIES = [
  "path",
  "pathNot",
  "license",
  "licenseNot",
  "exoticRequire",
  "exoticRequireNot",
  "via",
  "viaNot",
  "viaOnly",
  "viaSomeNot",
];

/**
 *
 * @param {string|string[]} pStringish
 * @returns {string}
 */
function normalizeToREAsString(pStringish) {
  if (Array.isArray(pStringish)) {
    return pStringish.join("|");
  }
  return pStringish;
}

function normalizeREProperties(
  pPropertyContainer,
  pREProperties = RE_PROPERTIES
) {
  let lPropertyContainer = cloneDeep(pPropertyContainer);

  for (const lProperty of pREProperties) {
    if (has(lPropertyContainer, lProperty)) {
      set(
        lPropertyContainer,
        lProperty,
        normalizeToREAsString(get(lPropertyContainer, lProperty))
      );
    }
  }
  return lPropertyContainer;
}

module.exports = {
  normalizeToREAsString,
  normalizeREProperties,
};
