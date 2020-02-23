const localNpmHelpers = require("./local-npm-helpers");

module.exports = {
  addLicenseAttribute(pModuleName, pBaseDir, pResolveOptions) {
    let lRetval = {};
    const lLicense = localNpmHelpers.getLicense(
      pModuleName,
      pBaseDir,
      pResolveOptions
    );

    if (Boolean(lLicense)) {
      lRetval.license = lLicense;
    }
    return lRetval;
  }
};
