import get from "lodash/get.js";
import has from "lodash/has.js";
import set from "lodash/set.js";

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
export function normalizeToREAsString(pStringish) {
  if (Array.isArray(pStringish)) {
    return pStringish.join("|");
  }
  return pStringish;
}

export function normalizeREProperties(
  pPropertyContainer,
  pREProperties = RE_PROPERTIES,
) {
  let lPropertyContainer = structuredClone(pPropertyContainer);

  for (const lProperty of pREProperties) {
    if (has(lPropertyContainer, lProperty)) {
      set(
        lPropertyContainer,
        lProperty,
        normalizeToREAsString(get(lPropertyContainer, lProperty)),
      );
    }
  }
  return lPropertyContainer;
}
