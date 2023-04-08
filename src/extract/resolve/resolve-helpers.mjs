import { getLicense } from "./external-module-helpers.mjs";
import { isExternalModule } from "./module-classifiers.mjs";

export function addLicenseAttribute(
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
    const lLicense = getLicense(pModuleName, fileDirectory, pResolveOptions);

    if (Boolean(lLicense)) {
      lReturnValue.license = lLicense;
    }
  }
  return lReturnValue;
}

export function stripToModuleName(pUnstrippedModuleName) {
  return pUnstrippedModuleName.split("!").pop();
}
