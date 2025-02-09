import { isBuiltin as moduleIsBuiltin } from "node:module";

/**
 * @param {string} pModuleName - the unresolved module name
 * @param {*} pResolveOptions
 * @returns {boolean} - true if the module is a built-in module
 */
export function isBuiltin(pModuleName, pResolveOptions) {
  if (pResolveOptions?.builtInModules?.override) {
    return pResolveOptions.builtInModules.override.includes(pModuleName);
  }

  // bun, as it turns out, has some additional builtin modules. Even when running
  // dependency-cruiser with bunx, bunx will use node by default. To cover that scenario
  // there's three options
  // - tell everyone to run bunx with the --bun option, so bun uses bun instead of node
  //   and hope everyone actually does that and it doesn't lead to a bunch of questions
  //   in the issues section. I don't expect that to happen anytime soon => other options
  // - add the bun builtins here.
  //   this sounds attractive, but some of the modules ('undici', 'ws') are
  //   also npm packages. In nodejs context that will lead to a.o. false
  //   classifications.
  // - add the bun builtins in dependency-cruiser.js
  //   Current approach. The --init command will try to detect whether it's
  //   in a bun repo and add the bun builtins to the config.
  return (
    moduleIsBuiltin(pModuleName) ||
    (pResolveOptions?.builtInModules?.add ?? []).includes(pModuleName)
  );
}
