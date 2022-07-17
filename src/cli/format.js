const getStream = require("get-stream");
const main = require("../main");
const validateFileExistence = require("./utl/validate-file-existence");
const normalizeOptions = require("./normalize-cli-options");
const io = require("./utl/io");

const KNOWN_FMT_OPTIONS = [
  "collapse",
  "exclude",
  "focus",
  "focusDepth",
  "help",
  "includeOnly",
  "outputTo",
  "outputType",
  "prefix",
  "reaches",
  "version",
];

/**
 *
 * @param {string} pResultFile the name of the file with cruise results
 * @param {import("../../types/dependency-cruiser").IFormatOptions} pOptions
 * @returns {Number} an exitCode
 */
module.exports = async (pResultFile, pOptions) => {
  const lOptions = normalizeOptions(pOptions, KNOWN_FMT_OPTIONS);

  if (pResultFile !== "-") {
    validateFileExistence(pResultFile);
  }

  const lResult = await getStream(io.getInStream(pResultFile));

  const lReportingResult = main.format(JSON.parse(lResult), lOptions);

  io.write(lOptions.outputTo, lReportingResult.output);
  return lReportingResult.exitCode;
};
