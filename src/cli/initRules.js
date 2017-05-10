"use strict";

const fs                        = require('fs');
const starterRules              = require('./rules.starter.json');
const DEPENDENCY_CRUISER_CONFIG = ".dependency-cruiser.json";

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
 * @throws {Error}  An error object with the root cause of the problem
 *                  as a description:
 *                  - file already exists
 *                  - writing to the file doesn't work
 *
 */
module.exports = () => {
    if (fileExists(DEPENDENCY_CRUISER_CONFIG)) {
        throw Error(`A '${DEPENDENCY_CRUISER_CONFIG}' already exists here - leaving it be.\n`);
    } else {
        try {
            fs.writeFileSync(
                DEPENDENCY_CRUISER_CONFIG,
                JSON.stringify(starterRules, null, "  "),
                {encoding: "utf8", flag: "w"}
            );
        } catch (e) {

            /* istanbul ignore next  */
            throw Error(`ERROR: Writing to '${DEPENDENCY_CRUISER_CONFIG}' didn't work. ${e}\n`);
        }
    }
};
