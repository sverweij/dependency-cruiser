import { join } from "node:path";
import extractES6Deps from "./extract-es6-deps.mjs";
import extractCommonJSDeps from "./extract-cjs-deps.mjs";
import extractAMDDeps from "./extract-amd-deps.mjs";
import parse from "./parse.mjs";
import extractStats from "./extract-stats.mjs";

export function extract(
  { baseDir, moduleSystems, exoticRequireStrings },
  pFileName,
  pTranspileOptions,
) {
  let lDependencies = [];
  const lAST = parse.getASTCached(join(baseDir, pFileName), pTranspileOptions);

  if (moduleSystems.includes("cjs")) {
    extractCommonJSDeps(lAST, lDependencies, "cjs", exoticRequireStrings);
  }
  if (moduleSystems.includes("es6")) {
    extractES6Deps(lAST, lDependencies);
  }
  if (moduleSystems.includes("amd")) {
    extractAMDDeps(lAST, lDependencies, exoticRequireStrings);
  }

  return lDependencies;
}

export function getStats({ baseDir }, pFileName, pTranspileOptions) {
  const lAST = parse.getASTCached(join(baseDir, pFileName), pTranspileOptions);
  return extractStats(lAST);
}
