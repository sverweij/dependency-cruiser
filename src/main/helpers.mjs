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
    // lProperty can be nested properties, so we use lodash.has and lodash.get
    // instead of elvis operators
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
