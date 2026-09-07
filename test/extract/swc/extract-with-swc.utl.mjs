import extractSwcDependencies from "#extract/swc/extract-swc-deps.mjs";
import tryImport from "#utl/try-import.mjs";
import meta from "#meta.cjs";

const swc = await tryImport("@swc/core", meta.supportedTranspilers.swc);

/** @type {ParseOptions} */
const SWC_PARSE_OPTIONS = {
  dynamicImport: true,
  // typescript is a superset of ecmascript, so we use typescript always
  syntax: "typescript",
  // target doesn't have effect on parsing it seems
  target: "es2022",
  // allow for decorators
  decorators: true,
  // no tsx by default - overridden when the extension calls for it
  // tsx: false
};

export function getASTFromSource(pSource) {
  return swc.parseSync(pSource, SWC_PARSE_OPTIONS);
}

export default (pTypesScriptSource, pExoticRequireStrings = []) =>
  extractSwcDependencies(
    getASTFromSource(pTypesScriptSource),
    pExoticRequireStrings,
  );
