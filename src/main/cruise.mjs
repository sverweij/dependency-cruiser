/* eslint-disable no-return-await */
/* eslint-disable no-magic-numbers */
import { bus } from "../utl/bus.mjs";
import { validateCruiseOptions } from "./options/validate.mjs";
import { normalizeCruiseOptions } from "./options/normalize.mjs";
import reportWrap from "./report-wrap.mjs";

const TOTAL_STEPS = 10;

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
  bus.summary("parsing options", c(1));
  /** @type {import("../../types/strict-options.js").IStrictCruiseOptions} */
  let lCruiseOptions = normalizeCruiseOptions(
    validateCruiseOptions(pCruiseOptions),
    pFileAndDirectoryArray
  );
  let lCache = null;

  if (lCruiseOptions.cache) {
    bus.summary(
      `cache: checking freshness with ${lCruiseOptions.cache.strategy}`,
      c(2)
    );

    const { default: Cache } = await import("../cache/cache.mjs");
    lCache = new Cache(lCruiseOptions.cache.strategy);
    const lCachedResults = await lCache.read(lCruiseOptions.cache.folder);

    if (await lCache.canServeFromCache(lCruiseOptions, lCachedResults)) {
      bus.summary("cache: reporting from cache", c(8));
      return await reportWrap(lCachedResults, lCruiseOptions);
    }
  }

  bus.summary("importing analytical modules", c(3));
  const [
    { default: normalizeRuleSet },
    { default: validateRuleSet },
    { default: normalizeFilesAndDirectories },
    { default: normalizeResolveOptions },
    { default: extract },
    { default: enrich },
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
    bus.summary("parsing rule set", c(4));
    lCruiseOptions.ruleSet = normalizeRuleSet(
      validateRuleSet(lCruiseOptions.ruleSet)
    );
  }

  const lNormalizedFileAndDirectoryArray = normalizeFilesAndDirectories(
    pFileAndDirectoryArray
  );

  bus.summary("determining how to resolve", c(5));
  const lNormalizedResolveOptions = await normalizeResolveOptions(
    pResolveOptions,
    lCruiseOptions,
    pTranspileOptions?.tsConfig
  );

  bus.summary("reading files", c(6));
  const lExtractionResult = extract(
    lNormalizedFileAndDirectoryArray,
    lCruiseOptions,
    lNormalizedResolveOptions,
    pTranspileOptions
  );

  bus.summary("analyzing", c(7));
  const lCruiseResult = enrich(
    lExtractionResult,
    lCruiseOptions,
    lNormalizedFileAndDirectoryArray
  );

  if (lCruiseOptions.cache) {
    bus.summary("cache: saving", c(8));
    await lCache.write(lCruiseOptions.cache.folder, lCruiseResult);
  }

  bus.summary("reporting", c(9));
  return await reportWrap(lCruiseResult, lCruiseOptions);
}
