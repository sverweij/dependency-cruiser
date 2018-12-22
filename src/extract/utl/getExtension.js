const path = require("path");


/**
 * Returns the extension of the given file name path.
 *
 * Just using path.extname would be fine for most cases,
 * except for coffeescript, where a markdown extension can
 * mean literate coffeescript.
 *
 * @param {string} pFileName path to the file to be parsed
 * @return {string}          extension
 */
module.exports = (pFileName) => {
    let lRetval = path.extname(pFileName);

    if (lRetval === ".md") {
        return pFileName.endsWith(".coffee.md") ? ".coffee.md" : lRetval;
    }
    return lRetval;
};
