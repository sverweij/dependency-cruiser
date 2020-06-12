/* eslint-disable security/detect-object-injection */
const _get = require("lodash/get");
const _set = require("lodash/set");
const _cloneDeep = require("lodash/cloneDeep");

const RE_PROPERTIES = [
  "path",
  "pathNot",
  "license",
  "licenseNot",
  "exoticRequire",
  "exoticRequireNot",
];

module.exports = function normalizeREProperties(
  pPropertyContainer,
  pREProperties = RE_PROPERTIES
) {
  let lPropertyContainer = _cloneDeep(pPropertyContainer);

  for (const lProperty of pREProperties) {
    let lValue = _get(lPropertyContainer, lProperty);

    if (Array.isArray(lValue)) {
      _set(lPropertyContainer, lProperty, lValue.join("|"));
    }
  }
  return lPropertyContainer;
};
