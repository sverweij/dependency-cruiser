/* eslint-disable security/detect-object-injection */

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
  let lPropertyContainer = pPropertyContainer;

  for (const lProperty of pREProperties) {
    if (Array.isArray(lPropertyContainer[lProperty])) {
      lPropertyContainer[lProperty] = lPropertyContainer[lProperty].join("|");
    }
  }
  return lPropertyContainer;
};
