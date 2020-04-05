const fs = require("fs");
const { fileExists } = require("./helpers");

const DEFAULT_CONFIG_FILE_NAME = `.dependency-cruiser.js`;

/**
 * Write a .dependency-cruiser config to the current directory
 *
 * @returns {void}  Nothing
 * @param  {any}    pConfig - dependency-cruiser configuration
 * @param  {string} pFileName - name of the file to write to
 * @throws {Error}  An error object with the root cause of the problem
 *                  as a description:
 *                  - file already exists
 *                  - writing to the file doesn't work
 *
 */
module.exports = function writeConfig(
  pConfig,
  pFileName = DEFAULT_CONFIG_FILE_NAME
) {
  if (fileExists(pFileName)) {
    throw new Error(`A '${pFileName}' already exists here - leaving it be.\n`);
  } else {
    try {
      fs.writeFileSync(pFileName, pConfig);
      process.stdout.write(`\n  Successfully created '${pFileName}'\n\n`);
    } catch (pError) {
      /* istanbul ignore next  */
      throw new Error(
        `ERROR: Writing to '${pFileName}' didn't work. ${pError}\n`
      );
    }
  }
};
