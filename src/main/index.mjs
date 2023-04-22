/* eslint-disable no-return-await */
/* eslint-disable no-magic-numbers */

import Ajv from "ajv";

import extract from "../extract/index.mjs";
import enrich from "../enrich/index.mjs";
import cruiseResultSchema from "../schema/cruise-result.schema.mjs";
import bus from "../utl/bus.mjs";
import {
  allExtensions,
  getAvailableTranspilers,
} from "../extract/transpile/meta.mjs";
import normalizeFilesAndDirectories from "./files-and-dirs/normalize.mjs";
import validateRuleSet from "./rule-set/validate.mjs";
import normalizeRuleSet from "./rule-set/normalize.mjs";
import {
  validateCruiseOptions,
  validateFormatOptions,
} from "./options/validate.mjs";
import {
  normalizeCruiseOptions,
  normalizeFormatOptions,
} from "./options/normalize.mjs";
import normalizeResolveOptions from "./resolve-options/normalize.mjs";
import reportWrap from "./report-wrap.mjs";

const TOTAL_STEPS = 9;

function c(pComplete, pTotal = TOTAL_STEPS) {
  return { complete: pComplete / pTotal };
}

function validateResultAgainstSchema(pResult) {
  const ajv = new Ajv();

  if (!ajv.validate(cruiseResultSchema, pResult)) {
    throw new Error(
      `The supplied dependency-cruiser result is not valid: ${ajv.errorsText()}.\n`
    );
  }
}
/** @type {import("../../types/dependency-cruiser.js").format} */
export async function format(pResult, pFormatOptions = {}) {
  const lFormatOptions = normalizeFormatOptions(pFormatOptions);
  validateFormatOptions(lFormatOptions);

  validateResultAgainstSchema(pResult);

  return await reportWrap(pResult, lFormatOptions);
}

/** @type {import("../../types/dependency-cruiser.js").cruise} */
// eslint-disable-next-line max-lines-per-function, max-statements
export async function cruise(
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

    const CacheModule = await import("../cache/cache.mjs");
    const Cache = CacheModule.default;
    lCache = new Cache(lCruiseOptions.cache.strategy);
    const lCachedResults = lCache.read(lCruiseOptions.cache.folder);

    if (lCache.canServeFromCache(lCruiseOptions, lCachedResults)) {
      bus.emit("progress", "cache: reporting from cache", c(8));
      return await reportWrap(lCachedResults, lCruiseOptions);
    }
  }

  if (Boolean(lCruiseOptions.ruleSet)) {
    bus.emit("progress", "parsing rule set", c(3));
    lCruiseOptions.ruleSet = normalizeRuleSet(
      validateRuleSet(lCruiseOptions.ruleSet)
    );
  }

  const lNormalizedFileAndDirectoryArray = normalizeFilesAndDirectories(
    pFileAndDirectoryArray
  );

  bus.emit("progress", "determining how to resolve", c(4));
  const lNormalizedResolveOptions = await normalizeResolveOptions(
    pResolveOptions,
    lCruiseOptions,
    pTranspileOptions?.tsConfig
  );

  bus.emit("progress", "reading files", c(5));
  const lExtractionResult = extract(
    lNormalizedFileAndDirectoryArray,
    lCruiseOptions,
    lNormalizedResolveOptions,
    pTranspileOptions
  );

  bus.emit("progress", "analyzing", c(6));
  const lCruiseResult = enrich(
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

export {
  allExtensions,
  getAvailableTranspilers,
} from "../extract/transpile/meta.mjs";

export default {
  cruise,
  format,
  allExtensions,
  getAvailableTranspilers,
};
