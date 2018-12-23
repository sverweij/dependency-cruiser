const fs   = require('fs');
const path = require('path');

const STARTER_RULES_MOLD_JSON = path.join(__dirname, './rules.starter.json.mold');
const STARTER_RULES_MOLD_JS   = path.join(__dirname, './rules.starter.js.mold');

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
 * Yet undocumented feature: when specifying a rules file name
 * that ends in .js use a (1) javascript config that (2) extends
 * dependency-cruiser/configs/recommended.
 * Otherwise use the (existing) plain & simple json
 *
 * Put in here as preparation for an improved --init experience
 * (that's probably going to be an Inquirer.js ui)
 *
 * @param  {string} pFileName The configuration file name to write to
 * @return {string}           The mold/ template to use
 */
function getStarterRulesMold(pFileName) {
    let lRetval = STARTER_RULES_MOLD_JSON;

    if (path.extname(pFileName) === '.js'){
        lRetval = STARTER_RULES_MOLD_JS;
    }
    return lRetval;
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
            // fs.copyFileSync(getStarterRulesMold(pFileName), pFileName, fs.constants.COPYFILE_EXCL);
            fs.writeFileSync(
                pFileName,
                fs.readFileSync(
                    getStarterRulesMold(pFileName),
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
