const fs = require("fs");
const figures = require("figures");
const chalk = require("chalk");
const {
  fileExists,
  getDefaultConfigFileName,
} = require("./environment-helpers");

/**
 * Write a .dependency-cruiser config to the current directory
 *
 * @returns {void}  Nothing
 * @param  {string} pConfig - dependency-cruiser configuration
 * @param  {string} pFileName - name of the file to write to
 * @throws {Error}  An error object with the root cause of the problem
 *                  as a description:
 *                  - file already exists
 *                  - writing to the file doesn't work
 *
 */
module.exports = function writeConfig(
  pConfig,
  pFileName = getDefaultConfigFileName()
) {
  if (fileExists(pFileName)) {
    throw new Error(`A '${pFileName}' already exists here - leaving it be.\n`);
  } else {
    try {
      fs.writeFileSync(pFileName, pConfig);
      process.stdout.write(
        `\n  ${chalk.green(
          figures.tick
        )} Successfully created '${pFileName}'\n\n`
      );
      /* c8 ignore start */
    } catch (pError) {
      throw new Error(
        `ERROR: Writing to '${pFileName}' didn't work. ${pError}\n`
      );
    }
    /* c8 ignore stop */
  }
};
