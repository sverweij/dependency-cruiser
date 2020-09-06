const getStream = require("get-stream");
const main = require("../main");
const validateFileExistence = require("./utl/validate-file-existence");
const normalizeOptions = require("./normalize-options");
const io = require("./utl/io");

const KNOWN_FMT_OPTIONS = [
  "collapse",
  "doNotFollow",
  "exclude",
  "focus",
  "help",
  "includeOnly",
  "outputTo",
  "outputType",
  "version",
];

module.exports = async (pResultFile, pOptions) => {
  const lOptions = normalizeOptions(pOptions, KNOWN_FMT_OPTIONS);

  /* istanbul ignore else */
  if (pResultFile !== "-") {
    validateFileExistence(pResultFile);
  }

  const lResult = await getStream(io.getInStream(pResultFile));

  const lReportingResult = main.format(JSON.parse(lResult), lOptions);

  io.write(lOptions.outputTo, lReportingResult.output);
  return lReportingResult.exitCode;
};
