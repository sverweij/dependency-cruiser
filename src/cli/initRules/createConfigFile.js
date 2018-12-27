const fs         = require('fs');
const Handlebars = require('handlebars/runtime');

/* eslint import/no-unassigned-import: 0 */
require("./config.json.template");
require("./config.js.template");

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

function buildConfigFile(pInitOptions){
    if (pInitOptions.configFormat === ".json") {
        return Handlebars.templates['config.json.template.hbs'](pInitOptions);
    }
    return Handlebars.templates['config.js.template.hbs'](pInitOptions);
}

function writeTheThing (pInitOptions) {
    if (fileExists(pInitOptions.fileName)) {
        throw Error(`A '${pInitOptions.fileName}' already exists here - leaving it be.\n`);
    } else {
        try {
            fs.writeFileSync(
                pInitOptions.fileName,
                buildConfigFile(pInitOptions)
            );
            process.stdout.write(
                `\n  Successfully created '${pInitOptions.fileName}'\n\n`
            );
        } catch (e) {

            /* istanbul ignore next  */
            throw Error(`ERROR: Writing to '${pInitOptions.fileName}' didn't work. ${e}\n`);
        }
    }
}

function normalizeInitOptions(pInitOptions){
    let lRetval = Object.assign(
        {
            configFormat: ".json",
            configType: "self-contained"
        },
        pInitOptions
    );

    lRetval.fileName = `.dependency-cruiser${lRetval.configFormat}`;
    if (lRetval.configType === "preset" && !lRetval.preset) {
        lRetval.preset = "dependency-cruiser/configs/recommended-warn-only";
    }
    return lRetval;
}

/**
 * Creates a .dependency-cruiser config with a set of basic validations
 * to the current directory.
 *
 * @returns {void}  Nothing
 * @param  {any}    pInitOptions Options that influence the shape of the
 *                  config
 * @throws {Error}  An error object with the root cause of the problem
 *                  as a description:
 *                  - file already exists
 *                  - writing to the file doesn't work
 *
 */
module.exports = (pInitOptions) => {
    writeTheThing(normalizeInitOptions(pInitOptions));
};
