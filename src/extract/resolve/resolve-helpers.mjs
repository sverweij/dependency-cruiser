import { getLicense } from "./external-module-helpers.mjs";
import moduleClassifiers from "./module-classifiers.mjs";

export default {
  addLicenseAttribute(
    pModuleName,
    pResolvedModuleName,
    { baseDirectory, fileDirectory },
    pResolveOptions
  ) {
    let lReturnValue = {};
    if (
      pResolveOptions.resolveLicenses &&
      moduleClassifiers.isExternalModule(
        pResolvedModuleName,
        pResolveOptions.modules,
        baseDirectory
      )
    ) {
      const lLicense = getLicense(pModuleName, fileDirectory, pResolveOptions);

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
