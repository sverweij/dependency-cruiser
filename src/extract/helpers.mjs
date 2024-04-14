import { extname } from "node:path";

export function dependenciesEqual(pLeftDependency) {
  // As we're using this to compare (typescript) pre-compilation dependencies
  // with post-compilation dependencies we do not consider the moduleSystem.
  //
  // In typescript the module system will typically be es6. Compiled down to
  // javascript it can be es6, but also cjs (depends on the `module` setting
  // in your tsconfig). In the latter case, we're still looking at the same
  // dependency even though the module systems differ.
  return (pRightDependency) =>
    pLeftDependency.module === pRightDependency.module &&
    pLeftDependency.dynamic === pRightDependency.dynamic &&
    pLeftDependency.exoticRequire === pRightDependency.exoticRequire;
}

export function detectPreCompilationNess(pTSDependencies, pJSDependencies) {
  return pTSDependencies.map((pTSDependency) =>
    pJSDependencies.some(dependenciesEqual(pTSDependency))
      ? { ...pTSDependency, preCompilationOnly: false }
      : {
          ...pTSDependency,
          preCompilationOnly: true,
          dependencyTypes: (pTSDependency.dependencyTypes || []).concat(
            "pre-compilation-only",
          ),
        },
  );
}

/**
 * Given a module string returns in an object
 * - the module name
 * - the protocol (when encoded in the string)
 * - the mimeType (when encoded in the string)
 *
 * See https://nodejs.org/api/esm.html#esm_urls
 *
 * would've loved to use url.URL here, but that doesn't extract the mime type
 * (if there's a default node API that does this I'm all ears)
 *
 * @param {string} pString
 * @returns {{module:string; protocol?:string; mimeType?:string}}
 */
export function extractModuleAttributes(pString) {
  let lReturnValue = { module: pString };
  const lModuleAttributes = pString.match(
    // eslint-disable-next-line security/detect-unsafe-regex
    /^(?:(?<protocol>node:|file:|data:)(?:(?<mimeType>[^,]+),)?)(?<module>.+)$/,
  );

  if (lModuleAttributes?.groups) {
    lReturnValue.module = lModuleAttributes?.groups.module;
    if (lModuleAttributes?.groups?.protocol) {
      lReturnValue.protocol = lModuleAttributes.groups.protocol;
    }
    if (lModuleAttributes?.groups?.mimeType) {
      lReturnValue.mimeType = lModuleAttributes.groups.mimeType;
    }
  }

  return lReturnValue;
}

/**
 * returns pFilenameString stripped of any 'query parameters' e.g.
 *
 * "hello/there?thing=smurf" => "hello/there"
 * "boink/boink/t.gif?resource" => "boink/boink/t.gif"
 * "no/thing/after.js" => "no/thing/after.js"
 *
 * @param {string} pFilenameString string to strip the query parameters from
 * @returns {string} the stripped string
 */
export function stripQueryParameters(pFilenameString) {
  // url.parse(pFilenameString).pathname did this quite admirably, but it's
  // deprecated, hence this funky RE replace. And accompanying unit test :-/
  return pFilenameString.replace(/\?.+$/, "");
}
/**
 * Returns true if the file name has a TypeScript compatible extension
 * @param {string} pFileName
 * @returns {boolean}
 */
export function isTypeScriptCompatible(pFileName) {
  return [
    ".ts",
    ".tsx",
    ".mts",
    ".cts",
    ".js",
    ".mjs",
    ".cjs",
    ".vue",
  ].includes(extname(pFileName));
}
