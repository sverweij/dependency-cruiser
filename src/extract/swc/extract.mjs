import { join } from "node:path/posix";
import { isTypeScriptCompatible } from "../helpers.mjs";
import extractSwcDeps from "./extract-swc-deps.mjs";
import parse from "./parse.mjs";

export function shouldUse({ parser }, pFileName) {
  return (
    parser === "swc" && parse.isAvailable() && isTypeScriptCompatible(pFileName)
  );
}

export function extract(
  { baseDir, exoticRequireStrings, moduleSystems },
  pFileName,
) {
  return extractSwcDeps(
    parse.getASTCached(join(baseDir, pFileName)),
    exoticRequireStrings,
  ).filter(({ moduleSystem }) => moduleSystems.includes(moduleSystem));
}
