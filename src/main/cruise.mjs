/* eslint-disable no-return-await */
/* eslint-disable no-magic-numbers */

import bus from "../utl/bus.mjs";
import { validateCruiseOptions } from "./options/validate.mjs";
import { normalizeCruiseOptions } from "./options/normalize.mjs";
import reportWrap from "./report-wrap.mjs";

const TOTAL_STEPS = 9;

export function c(pComplete, pTotal = TOTAL_STEPS) {
  return { complete: pComplete / pTotal };
}

/** @type {import("../../types/dependency-cruiser.js").cruise} */
// eslint-disable-next-line max-lines-per-function, max-statements
export default async function cruise(
  pFileAndDirectoryArray,
  pCruiseOptions,
  pResolveOptions,
  pTranspileOptions
) {
  bus.emit("progress", "parsing options", c(1));
  /** @type {import("../../types/strict-options.js").IStrictCruiseOptions} */
  let lCruiseOptions = normalizeCruiseOptions(
    validateCruiseOptions(pCruiseOptions),
    pFileAndDirectoryArray
  );
  let lCache = null;

  if (lCruiseOptions.cache) {
    bus.emit(
      "progress",
      `cache: check freshness with ${lCruiseOptions.cache.strategy}`,
      c(2)
    );

    const Cache = await import("../cache/cache.mjs");
    // eslint-disable-next-line new-cap
    lCache = new Cache.default(lCruiseOptions.cache.strategy);
    const lCachedResults = lCache.read(lCruiseOptions.cache.folder);

    if (lCache.canServeFromCache(lCruiseOptions, lCachedResults)) {
      bus.emit("progress", "cache: reporting from cache", c(8));
      return await reportWrap(lCachedResults, lCruiseOptions);
    }
  }

  const [
    normalizeRuleSet,
    validateRuleSet,
    normalizeFilesAndDirectories,
    normalizeResolveOptions,
    extract,
    enrich,
  ] = await Promise.all([
    // despite rule set parsing being behind an if, it's the 'normal' use case
    // for dependency-cruiser, so import it unconditionally nonetheless
    import("./rule-set/normalize.mjs"),
    import("./rule-set/validate.mjs"),
    import("./files-and-dirs/normalize.mjs"),
    import("./resolve-options/normalize.mjs"),
    import("../extract/index.mjs"),
    import("../enrich/index.mjs"),
  ]);

  if (Boolean(lCruiseOptions.ruleSet)) {
    bus.emit("progress", "parsing rule set", c(3));
    lCruiseOptions.ruleSet = normalizeRuleSet.default(
      validateRuleSet.default(lCruiseOptions.ruleSet)
    );
  }

  const lNormalizedFileAndDirectoryArray = normalizeFilesAndDirectories.default(
    pFileAndDirectoryArray
  );

  bus.emit("progress", "determining how to resolve", c(4));
  const lNormalizedResolveOptions = await normalizeResolveOptions.default(
    pResolveOptions,
    lCruiseOptions,
    pTranspileOptions?.tsConfig
  );

  bus.emit("progress", "reading files", c(5));
  const lExtractionResult = extract.default(
    lNormalizedFileAndDirectoryArray,
    lCruiseOptions,
    lNormalizedResolveOptions,
    pTranspileOptions
  );

  bus.emit("progress", "analyzing", c(6));
  const lCruiseResult = enrich.default(
    lExtractionResult,
    lCruiseOptions,
    lNormalizedFileAndDirectoryArray
  );

  if (lCruiseOptions.cache) {
    bus.emit("progress", "cache: save", c(7));
    lCache.write(lCruiseOptions.cache.folder, lCruiseResult);
  }

  bus.emit("progress", "reporting", c(8));
  return await reportWrap(lCruiseResult, lCruiseOptions);
}
