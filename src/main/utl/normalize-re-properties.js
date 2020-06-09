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
  pDependencyEnd,
  pREProperties = RE_PROPERTIES
) {
  let lDependencyEnd = pDependencyEnd;

  for (const lProperty of pREProperties) {
    if (Array.isArray(lDependencyEnd[lProperty])) {
      lDependencyEnd[lProperty] = lDependencyEnd[lProperty].join("|");
    }
  }
  return lDependencyEnd;
};
