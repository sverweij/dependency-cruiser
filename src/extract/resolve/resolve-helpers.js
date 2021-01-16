const localNpmHelpers = require("./external-module-helpers");

module.exports = {
  addLicenseAttribute(
    pModuleName,
    pBaseDirectory,
    pResolveOptions,
    pResolvedModuleName
  ) {
    let lReturnValue = {};
    if (pResolveOptions.resolveLicenses) {
      const lLicense = localNpmHelpers.getLicense(
        pModuleName,
        pBaseDirectory,
        pResolveOptions,
        pResolvedModuleName
      );

      if (Boolean(lLicense)) {
        lReturnValue.license = lLicense;
      }
    }
    return lReturnValue;
  },
  stripToModuleName(pUnstrippedModuleName) {
    return pUnstrippedModuleName.split("!").pop();
  },
};
