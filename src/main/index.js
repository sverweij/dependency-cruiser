const Ajv = require("ajv");
const extract = require("../extract");
const cruiseResultSchema = require("../schema/cruise-result.schema.json");
const meta = require("../extract/transpile/meta");
const report = require("../report");
const normalizeFilesAndDirs = require("./filesAndDirs/normalize");
const validateRuleSet = require("./ruleSet/validate");
const normalizeRuleSet = require("./ruleSet/normalize");
const validateOptions = require("./options/validate");
const normalizeOptions = require("./options/normalize");
const normalizeResolveOptions = require("./resolveOptions/normalize");

// see [api.md](../../doc/api.md) and/ or the
// [type definition](../../types/depencency-cruiser.d.ts) for details
function format(pResult, pOutputType) {
  const ajv = new Ajv();

  validateOptions.validateOutputType(pOutputType);

  if (!ajv.validate(cruiseResultSchema, pResult)) {
    throw new Error(
      `The supplied dependency-cruiser result is not valid: ${ajv.errorsText()}.\n`
    );
  }
  return report.getReporter(pOutputType)(pResult);
}

// see [api.md](../../doc/api.md) and/ or the
// [type definition](../../types/depencency-cruiser.d.ts) for details
function cruise(pFileDirArray, pOptions, pResolveOptions, pTSConfig) {
  pOptions = normalizeOptions(validateOptions(pOptions));

  if (Boolean(pOptions.ruleSet)) {
    pOptions.ruleSet = normalizeRuleSet(validateRuleSet(pOptions.ruleSet));
  }

  const lExtractionResult = extract(
    normalizeFilesAndDirs(pFileDirArray),
    pOptions,
    normalizeResolveOptions(pResolveOptions, pOptions, pTSConfig),
    pTSConfig
  );

  return report.getReporter(pOptions.outputType)(lExtractionResult);
}

module.exports = {
  cruise,
  format,
  allExtensions: meta.allExtensions,
  getAvailableTranspilers: meta.getAvailableTranspilers
};
