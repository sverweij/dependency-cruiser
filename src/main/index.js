/* eslint-disable no-magic-numbers */

const Ajv = require("ajv").default;
const extract = require("../extract");
const enrich = require("../enrich");
const cruiseResultSchema = require("../schema/cruise-result.schema.js");
const meta = require("../extract/transpile/meta");
const bus = require("../utl/bus");
const { canServeFromCache, readCache, writeCache } = require("../cache/cache");
const { getRevisionData } = require("../cache/revision-data");
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
/** @type {import("../../types/dependency-cruiser").format} */
function format(pResult, pFormatOptions = {}) {
  const lFormatOptions = normalizeFormatOptions(pFormatOptions);
  validateFormatOptions(lFormatOptions);

  validateResultAgainstSchema(pResult);

  return reportWrap(pResult, lFormatOptions);
}

const TOTAL_STEPS = 8;

function c(pComplete, pTotal = TOTAL_STEPS) {
  return { complete: pComplete / pTotal };
}

/** @type {import("../../types/dependency-cruiser").futureCruise} */
// eslint-disable-next-line max-lines-per-function, complexity, max-statements
function futureCruise(
  pFileAndDirectoryArray,
  pCruiseOptions,
  pResolveOptions,
  pTranspileOptions
) {
  /** @type {import("../../types/cruise-result").IRevisionData|null} */
  let lRevisionData = null;

  bus.emit("progress", "parsing options", c(1));
  /** @type {import("../../types/strict-options").IStrictCruiseOptions} */
  let lCruiseOptions = normalizeCruiseOptions(
    validateCruiseOptions(pCruiseOptions),
    pFileAndDirectoryArray
  );

  if (lCruiseOptions.cache) {
    bus.emit("progress", "cache: checking freshness", c(2));
    lRevisionData = getRevisionData(
      new Set(
        meta.scannableExtensions.concat(lCruiseOptions.extraExtensionsToScan)
      )
    );
    if (lRevisionData && canServeFromCache(lCruiseOptions, lRevisionData)) {
      bus.emit("progress", "cache: retrieving from cache", c(3));
      const lCachedResults = readCache(lCruiseOptions.cache);

      bus.emit("progress", "cache: reporting from cache", c(4));
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

  if (lCruiseOptions.cache && lRevisionData) {
    lCruiseResult.revisionData = lRevisionData;
    writeCache(lCruiseOptions.cache, lCruiseResult);
  }

  bus.emit("progress", "reporting", c(7));
  return reportWrap(lCruiseResult, lCruiseOptions);
}

// see [api.md](../../doc/api.md) and/ or the
// [type definition](../../types/dependency-cruiser.d.ts) for details
/** @type {import("../../types/dependency-cruiser").cruise} */
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
