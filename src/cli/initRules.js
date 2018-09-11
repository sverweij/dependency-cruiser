"use strict";

const fs   = require('fs');
const path = require('path');

const STARTER_RULES_FILENAME = path.join(__dirname, './rules.starter.json');

/*
  We could have used utl.fileExists - but that one is cached.
  Not typically what we want for this util.
 */
function fileExists(pFile) {
    try {
        fs.accessSync(pFile, fs.R_OK);
    } catch (e) {
        return false;
    }
    return true;
}

/**
 * Creates a .dependency-cruiser config with a set of basic validations
 * to the current directory.
 *
 * @returns {void} Nothing
 * @param  {string} pFileName The file name to write the rules to
 * @throws {Error}  An error object with the root cause of the problem
 *                  as a description:
 *                  - file already exists
 *                  - writing to the file doesn't work
 *
 */
module.exports = (pFileName) => {
    if (fileExists(pFileName)) {
        throw Error(`A '${pFileName}' already exists here - leaving it be.\n`);
    } else {
        try {
            // when dropping node 6 support use this in stead:
            // fs.copyFileSync(STARTER_RULES_FILENAME, pFileName, fs.constants.COPYFILE_EXCL);
            fs.writeFileSync(
                pFileName,
                fs.readFileSync(
                    STARTER_RULES_FILENAME,
                    {encoding: "utf8", flag: "r"}
                ),
                {encoding: "utf8", flag: "w"}
            );
        } catch (e) {

            /* istanbul ignore next  */
            throw Error(`ERROR: Writing to '${pFileName}' didn't work. ${e}\n`);
        }
    }
};
