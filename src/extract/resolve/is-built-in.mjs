import { builtinModules } from "node:module";

function getBuiltIns(pResolveOptions) {
  // builtinModules does not expose all builtin modules for #reasons -
  // see https://github.com/nodejs/node/issues/42785. In stead we could use
  // isBuiltin, but that is not available in node 16.14, the lowest version
  // of node dependency-cruiser currently supports. So we add the missing
  // modules here.
  let lReturnValue = builtinModules.concat(["test", "node:test"]);

  if (pResolveOptions?.builtInModules?.override) {
    lReturnValue = pResolveOptions?.builtInModules?.override;
  }
  if (pResolveOptions?.builtInModules?.add) {
    lReturnValue = lReturnValue.concat(pResolveOptions.builtInModules.add);
  }
  return lReturnValue;
}

/**
 *
 * @param {string} pModuleName - the unresolved module name
 * @param {*} pResolveOptions
 * @returns {boolean} - true if the module is a built-in module
 */
export function isBuiltin(pModuleName, pResolveOptions) {
  return getBuiltIns(pResolveOptions).includes(pModuleName);
}
