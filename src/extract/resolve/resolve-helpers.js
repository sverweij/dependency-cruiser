const externalModuleHelpers = require("./external-module-helpers");
const { isExternalModule } = require("./module-classifiers");

module.exports = {
  addLicenseAttribute(
    pModuleName,
    pResolvedModuleName,
    { baseDirectory, fileDirectory },
    pResolveOptions
  ) {
    let lReturnValue = {};
    if (
      pResolveOptions.resolveLicenses &&
      isExternalModule(
        pResolvedModuleName,
        pResolveOptions.modules,
        baseDirectory
      )
    ) {
      const lLicense = externalModuleHelpers.getLicense(
        pModuleName,
        fileDirectory,
        pResolveOptions
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
