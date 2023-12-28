import { writeFileSync } from "node:fs";
import figures from "figures";
import chalk from "chalk";
import {
  fileExists,
  getDefaultConfigFileName,
} from "./environment-helpers.mjs";

/**
 * Write a .dependency-cruiser config to the current directory
 *
 * @returns {void}  Nothing
 * @param  {string} pConfig - dependency-cruiser configuration
 * @param  {import("fs").PathOrFileDescriptor} pFileName - name of the file to write to
 * @param  {NodeJS.WritableStream} pOutStream - the stream to write user feedback to
 * @throws {Error}  An error object with the root cause of the problem
 *                  as a description:
 *                  - file already exists
 *                  - writing to the file doesn't work
 *
 */
export default function writeConfig(
  pConfig,
  pFileName = getDefaultConfigFileName(),
  pOutStream = process.stdout,
) {
  if (fileExists(pFileName)) {
    throw new Error(`A '${pFileName}' already exists here - leaving it be.\n`);
  } else {
    try {
      writeFileSync(pFileName, pConfig);
      pOutStream.write(
        `\n  ${chalk.green(
          figures.tick,
        )} Successfully created '${pFileName}'\n\n`,
      );
      /* c8 ignore start */
    } catch (pError) {
      throw new Error(
        `ERROR: Writing to '${pFileName}' didn't work. ${pError}\n`,
      );
    }
    /* c8 ignore stop */
  }
}
