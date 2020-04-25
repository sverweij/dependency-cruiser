const localNpmHelpers = require("./local-npm-helpers");

module.exports = {
  addLicenseAttribute(pModuleName, pBaseDirectory, pResolveOptions) {
    let lReturnValue = {};
    const lLicense = localNpmHelpers.getLicense(
      pModuleName,
      pBaseDirectory,
      pResolveOptions
    );

    if (Boolean(lLicense)) {
      lReturnValue.license = lLicense;
    }
    return lReturnValue;
  },
};
