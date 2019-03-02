const fs             = require('fs');
const Handlebars     = require('handlebars/runtime');
const $package       = require('../../../package.json');
const {fileExists} = require('./helpers');

/* eslint import/no-unassigned-import: 0 */
require("./config.json.template");
require("./config.js.template");


function getFileName(pInitOptions) {
    return `.dependency-cruiser${pInitOptions.configFormat}`;
}

function buildConfig(pInitOptions){
    if (pInitOptions.configFormat === ".json") {
        return Handlebars.templates['config.json.template.hbs'](pInitOptions);
    }
    return Handlebars.templates['config.js.template.hbs'](pInitOptions);
}

function writeTheThing (pFileName, pConfig) {
    if (fileExists(pFileName)) {
        throw Error(`A '${pFileName}' already exists here - leaving it be.\n`);
    } else {
        try {
            fs.writeFileSync(
                pFileName,
                pConfig
            );
            process.stdout.write(
                `\n  Successfully created '${pFileName}'\n\n`
            );
        } catch (e) {

            /* istanbul ignore next  */
            throw Error(`ERROR: Writing to '${pFileName}' didn't work. ${e}\n`);
        }
    }
}

function normalizeInitOptions(pInitOptions){
    let lRetval = Object.assign(
        {
            version: $package.version,
            date: (new Date()).toJSON(),
            configFormat: ".json",
            configType: "self-contained"
        },
        pInitOptions
    );

    if (lRetval.configType === "preset" && !lRetval.preset) {
        lRetval.preset = "dependency-cruiser/configs/recommended-warn-only";
    }

    if (lRetval.useYarnPnP) {
        lRetval.externalModuleResolutionStrategy = "yarn-pnp";
    }

    return lRetval;
}

/**
 * Creates a .dependency-cruiser config with a set of basic validations
 * to the current directory.
 *
 * @returns {void}  Nothing
 * @param  {any}    pInitOptions Options that influence the shape of the
 *                  configFormat - file format to use either ".json" or ".js"
 *                  configType   - "self-contained" or "preset"
 *                  preset       -
 * @throws {Error}  An error object with the root cause of the problem
 *                  as a description:
 *                  - file already exists
 *                  - writing to the file doesn't work
 *
 */
module.exports = (pInitOptions) => {
    const lNormalizedInitOptions = normalizeInitOptions(pInitOptions);

    writeTheThing(
        getFileName(lNormalizedInitOptions),
        buildConfig(lNormalizedInitOptions)
    );
};
