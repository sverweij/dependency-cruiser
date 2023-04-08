import getStream from "get-stream";
import { format as _format } from "../main/index.mjs";
import validateFileExistence from "./utl/validate-file-existence.mjs";
import normalizeOptions from "./normalize-cli-options.mjs";
import { getInStream, write } from "./utl/io.mjs";

/**
 *
 * @param {string} pResultFile the name of the file with cruise results
 * @param {import("../../types/dependency-cruiser").IFormatOptions} pOptions
 * @returns {Number} an exitCode
 */
export default async function format(pResultFile, pOptions) {
  const lOptions = await normalizeOptions(pOptions);

  if (pResultFile !== "-") {
    validateFileExistence(pResultFile);
  }

  const lResult = await getStream(getInStream(pResultFile));

  const lReportingResult = _format(JSON.parse(lResult), lOptions);

  write(lOptions.outputTo, lReportingResult.output);
  return lReportingResult.exitCode;
}
