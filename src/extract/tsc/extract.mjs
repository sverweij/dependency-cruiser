import { join } from "node:path";
import { isTypeScriptCompatible } from "../helpers.mjs";
import extractTypeScriptDeps from "./extract-typescript-deps.mjs";
import parse from "./parse.mjs";
import extractStats from "./extract-stats.mjs";

export function shouldUse({ tsPreCompilationDeps, parser }, pFileName) {
  return (
    (tsPreCompilationDeps || parser === "tsc") &&
    parse.isAvailable() &&
    isTypeScriptCompatible(pFileName)
  );
}

export function extract(
  { baseDir, exoticRequireStrings, moduleSystems },
  pFileName,
  pTranspileOptions,
) {
  return extractTypeScriptDeps(
    parse.getASTCached(join(baseDir, pFileName), pTranspileOptions),
    exoticRequireStrings,
  ).filter(({ moduleSystem }) => moduleSystems.includes(moduleSystem));
}

export function getStats({ baseDir }, pFileName, pTranspileOptions) {
  const lAST = parse.getASTCached(join(baseDir, pFileName), pTranspileOptions);
  return extractStats(lAST);
}
