/* eslint-disable no-magic-numbers */
/* eslint-disable import/max-dependencies */
const Ajv = require("ajv").default;
const extract = require("../extract");
const enrich = require("../enrich");
const cruiseResultSchema = require("../schema/cruise-result.schema.json");
const meta = require("../extract/transpile/meta");
const bus = require("../utl/bus");
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
function futureCruise(
  pFileAndDirectoryArray,
  pCruiseOptions,
  pResolveOptions,
  pTranspileOptions
) {
  bus.emit("progress", "parsing options", c(1));
  let lCruiseOptions = normalizeCruiseOptions(
    validateCruiseOptions(pCruiseOptions)
  );

  if (Boolean(lCruiseOptions.ruleSet)) {
    bus.emit("progress", "parsing rule set", c(2));
    lCruiseOptions.ruleSet = normalizeRuleSet(
      validateRuleSet(lCruiseOptions.ruleSet)
    );
  }

  bus.emit("progress", "making sense of files and directories", c(3));
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

  bus.emit("progress", "reporting", c(7));
  return reportWrap(lCruiseResult, lCruiseOptions);
}

// see [api.md](../../doc/api.md) and/ or the
// [type definition](../../types/depencency-cruiser.d.ts) for details
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
