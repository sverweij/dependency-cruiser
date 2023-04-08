import toTypescriptAST from "./parse/to-typescript-ast.mjs";
import toJavascriptAST from "./parse/to-javascript-ast.mjs";
import toSwcAST from "./parse/to-swc-ast.mjs";
import { clearCache as externalModuleHelpers_clearCache } from "./resolve/external-module-helpers.mjs";
import { clearCache as getManifest_clearCache } from "./resolve/get-manifest.mjs";
import { clearCache as resolveAMD_clearCache } from "./resolve/resolve-amd.mjs";
import { clearCache as resolve_clearCache } from "./resolve/resolve.mjs";

export default function clearCaches() {
  toTypescriptAST.clearCache();
  toJavascriptAST.clearCache();
  toSwcAST.clearCache();
  externalModuleHelpers_clearCache();
  getManifest_clearCache();
  resolveAMD_clearCache();
  resolve_clearCache();
}
