/* eslint-disable no-magic-numbers */

const Ajv = require("ajv").default;
const extract = require("../extract");
const enrich = require("../enrich");
const cruiseResultSchema = require("../schema/cruise-result.schema.js");
const meta = require("../extract/transpile/meta");
const bus = require("../utl/bus");
const Cache = require("../cache/cache");
const normalizeFilesAndDirectories = require("./files-and-dirs/normalize");
const validateRuleSet = require("./rule-set/validate");
const normalizeRuleSet = require("./rule-set/normalize");
const {
  validateCruiseOptions,
  validateFormatOptions,
} = require("./options/validate");
const {
  normalizeCruiseOptions,
  normalizeFormatOptions,
} = require("./options/normalize");
const normalizeResolveOptions = require("./resolve-options/normalize");
const reportWrap = require("./report-wrap");

function validateResultAgainstSchema(pResult) {
  const ajv = new Ajv();

  if (!ajv.validate(cruiseResultSchema, pResult)) {
    throw new Error(
      `The supplied dependency-cruiser result is not valid: ${ajv.errorsText()}.\n`
    );
  }
}
/** @type {import("../..").format} */
function format(pResult, pFormatOptions = {}) {
  const lFormatOptions = normalizeFormatOptions(pFormatOptions);
  validateFormatOptions(lFormatOptions);

  validateResultAgainstSchema(pResult);

  return reportWrap(pResult, lFormatOptions);
}

const TOTAL_STEPS = 9;

function c(pComplete, pTotal = TOTAL_STEPS) {
  return { complete: pComplete / pTotal };
}

/** @type {import("../..").futureCruise} */
// eslint-disable-next-line max-lines-per-function, max-statements
function futureCruise(
  pFileAndDirectoryArray,
  pCruiseOptions,
  pResolveOptions,
  pTranspileOptions
) {
  bus.emit("progress", "parsing options", c(1));
  /** @type {import("../../types/strict-options").IStrictCruiseOptions} */
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

    lCache = new Cache(lCruiseOptions.cache.strategy);
    const lCachedResults = lCache.read(lCruiseOptions.cache.folder);

    if (lCache.canServeFromCache(lCruiseOptions, lCachedResults)) {
      bus.emit("progress", "cache: reporting from cache", c(8));
      return reportWrap(lCachedResults, lCruiseOptions);
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
  const lNormalizedResolveOptions = normalizeResolveOptions(
    pResolveOptions,
    lCruiseOptions,
    pTranspileOptions.tsConfig
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
  return reportWrap(lCruiseResult, lCruiseOptions);
}

// see [api.md](../../doc/api.md) and/ or the
// [type definition](../../types/dependency-cruiser.d.ts) for details
/** @type {import("../..").cruise} */
function cruise(pFileAndDirectoryArray, pOptions, pResolveOptions, pTSConfig) {
  return futureCruise(pFileAndDirectoryArray, pOptions, pResolveOptions, {
    tsConfig: pTSConfig,
  });
}

module.exports = {
  cruise,
  futureCruise,
  format,
  allExtensions: meta.allExtensions,
  getAvailableTranspilers: meta.getAvailableTranspilers,
};
