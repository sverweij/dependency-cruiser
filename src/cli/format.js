const getStream = require("get-stream");
const main = require("../main");
const validateFileExistence = require("./utl/validate-file-existence");
const normalizeOptions = require("./normalize-options");
const io = require("./utl/io");

module.exports = async (pResultFile, pOptions) => {
  const lOptions = normalizeOptions(pOptions);

  /* istanbul ignore else */
  if (pResultFile !== "-") {
    validateFileExistence(pResultFile);
  }

  const lResult = await getStream(io.getInStream(pResultFile));

  const lReportingResult = main.format(JSON.parse(lResult), lOptions);

  io.write(lOptions.outputTo, lReportingResult.output);
  return lReportingResult.exitCode;
};
