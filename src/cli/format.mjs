import assertFileExistence from "./utl/assert-file-existence.mjs";
import normalizeOptions from "./normalize-cli-options.mjs";
import { getInStream, write } from "./utl/io.mjs";
import _format from "#main/format.mjs";

/**
 *
 * @param {string} pResultFile the name of the file with cruise results
 * @param {import("../../types/dependency-cruiser").IFormatOptions} pOptions
 * @returns {Promise<Number>} an exitCode
 */
export default async function format(pResultFile, pOptions) {
  const lOptions = await normalizeOptions(pOptions);

  if (pResultFile !== "-") {
    assertFileExistence(pResultFile);
  }

  return new Promise((pResolve, pReject) => {
    let lInputAsString = "";
    const lInStream = getInStream(pResultFile);

    lInStream
      .on("data", (pChunk) => {
        lInputAsString += pChunk;
      })
      .on(
        "error",
        /* c8 ignore start */
        (pError) => {
          pReject(pError);
        },
        /* c8 ignore stop */
      )
      .on("end", async () => {
        const lReportingResult = await _format(
          JSON.parse(lInputAsString),
          lOptions,
        );

        write(lOptions.outputTo, lReportingResult.output);
        pResolve(lReportingResult.exitCode);
      });
  });
}
