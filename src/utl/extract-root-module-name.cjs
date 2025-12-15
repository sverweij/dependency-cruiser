const LOCAL_MODULE_RE = /^[.]{1,2}($|\/.*)/;
const ABSOLUTE_MODULE_RE = /^\/.*/;

const PACKAGE_RE = "[^/]+";
const SCOPED_PACKAGE_RE = "@[^/]+(/[^/]+)";
const ROOT_MODULE_RE = new RegExp(`^(${SCOPED_PACKAGE_RE}|${PACKAGE_RE})`, "g");

/**
 * returns the module name that likely contains the package.json
 *
 * @param {string} pModuleName module name string as you'd require it
 * @returns {string|undefined} the module name that likely contains the package.json
 */
module.exports = function extractRootModuleName(pModuleName) {
  if (
    LOCAL_MODULE_RE.test(pModuleName) ||
    ABSOLUTE_MODULE_RE.test(pModuleName)
  ) {
    return pModuleName;
  } else {
    return (pModuleName.match(ROOT_MODULE_RE) || []).shift();
  }
};
