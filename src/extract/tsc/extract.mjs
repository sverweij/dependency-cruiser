import { join } from "node:path";
import { isTypeScriptCompatible } from "../helpers.mjs";
import extractTypeScriptDeps from "./extract-typescript-deps.mjs";
import { getASTCached, isAvailable } from "./parse.mjs";
import extractStats from "./extract-stats.mjs";

export function shouldUse({ tsPreCompilationDeps, parser }, pFileName) {
  return (
    (tsPreCompilationDeps || parser === "tsc") &&
    isAvailable() &&
    isTypeScriptCompatible(pFileName)
  );
}

export function extract(
  { baseDir, exoticRequireStrings, moduleSystems, detectJSDocImports },
  pFileName,
  pTranspileOptions,
) {
  return extractTypeScriptDeps(
    getASTCached(join(baseDir, pFileName), pTranspileOptions),
    exoticRequireStrings,
    detectJSDocImports,
  ).filter(({ moduleSystem }) => moduleSystems.includes(moduleSystem));
}

export function getStats({ baseDir }, pFileName, pTranspileOptions) {
  const lAST = getASTCached(join(baseDir, pFileName), pTranspileOptions);
  return extractStats(lAST);
}
