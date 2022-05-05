/* eslint-disable security/detect-object-injection */
const get = require("lodash/get");
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

module.exports = function normalizeREProperties(
  pPropertyContainer,
  pREProperties = RE_PROPERTIES
) {
  let lPropertyContainer = cloneDeep(pPropertyContainer);

  for (const lProperty of pREProperties) {
    let lValue = get(lPropertyContainer, lProperty);

    if (Array.isArray(lValue)) {
      set(lPropertyContainer, lProperty, lValue.join("|"));
    }
  }
  return lPropertyContainer;
};
