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
 * @param {string} pSuffix
 * @returns {string}
 */
export function getURLForModule(pModule, pPrefix, pSuffix) {
  // TODO: derive the URLs from configuration
  if (pModule.dependencyTypes?.some((pType) => pType === "core")) {
    const lPackageName = deriveCorePackageName(pModule.source);
    // Check if it's a Bun core module (starts with bun:)
    if (lPackageName.startsWith("bun:")) {
      return "https://bun.sh/docs/api/{{packageName}}".replace(
        "{{packageName}}",
        lPackageName.replace(/^bun:/, ""),
      );
    }
    // Default to Node.js API documentation
    return "https://nodejs.org/api/{{packageName}}.html".replace(
      "{{packageName}}",
      lPackageName,
    );
  } else if (
    pModule.dependencyTypes?.some((pType) => pType.startsWith("npm"))
  ) {
    return "https://www.npmjs.com/package/{{packageName}}".replace(
      "{{packageName}}",
      deriveExternalPackageName(pModule.source),
    );
  } else if (pPrefix || pSuffix) {
    let lURL = pModule.source;
    if (pPrefix) {
      lURL = smartURIConcat(pPrefix, lURL);
    }
    if (pSuffix) {
      lURL = `${lURL}${pSuffix}`;
    }
    return lURL;
  }
  return pModule.source;
}
