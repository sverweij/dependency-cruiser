import { join } from "node:path/posix";

const PROTOCOL_PREFIX_RE = /^[a-z]+:\/\//;

// eslint-disable-next-line no-undefined
export const formatPercentage = new Intl.NumberFormat(undefined, {
  style: "percent",
}).format;

// eslint-disable-next-line no-undefined
export const formatNumber = new Intl.NumberFormat(undefined).format;

export function formatViolation(
  pViolation,
  pViolationType2Formatter,
  pDefaultFormatter,
) {
  return (pViolationType2Formatter[pViolation.type] || pDefaultFormatter)(
    pViolation,
  );
}

/**
 * Sort of smartly concatenate the given prefix and source:
 *
 * if it's an uri pattern (e.g. https://yadda, file://snorkel/bla)
 * simply concat.
 *
 * in all other cases path.posix.join the two
 *
 * @param {string} pPrefix - prefix
 * @param {string} pSource - filename
 * @return {string} prefix and filename concatenated
 */
function smartURIConcat(pPrefix, pSource) {
  if (PROTOCOL_PREFIX_RE.test(pPrefix)) {
    return `${pPrefix}${pSource}`;
  } else {
    return join(pPrefix, pSource);
  }
}

/**
 *
 * @param {string} pSource
 * @returns {string}
 */
function deriveExternalPackageName(pSource) {
  const lRE =
    /node_modules\/(?<packageName>[^@][^/]+)|(?<atPackageName>@[^/]+\/[^/]+)/;
  const lMatch = pSource.match(lRE);
  if (lMatch) {
    return lMatch.groups.packageName || lMatch.groups.atPackageName;
  }
  return "";
}

/**
 * @param {string} pSource
 * @returns {string}
 */
function deriveCorePackageName(pSource) {
  return pSource.split("/").shift();
}

/**
 *
 * @param {import("../../../types/cruise-result").IModule} pModule
 * @param {string} pPrefix
 * @returns {string}
 */
export function getURLForModule(pModule, pPrefix) {
  // TODO: derive the URLs from configuration
  if (pModule.dependencyTypes?.some((pType) => pType === "core")) {
    return "https://nodejs.org/api/{{packageName}}.html".replace(
      "{{packageName}}",
      deriveCorePackageName(pModule.source),
    );
  } else if (
    pModule.dependencyTypes?.some((pType) => pType.startsWith("npm"))
  ) {
    return "https://www.npmjs.com/package/{{packageName}}".replace(
      "{{packageName}}",
      deriveExternalPackageName(pModule.source),
    );
  } else if (pPrefix) {
    return smartURIConcat(pPrefix, pModule.source);
  }
  return pModule.source;
}
