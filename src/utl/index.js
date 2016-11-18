const fs = require("fs");
const _  = require("lodash");

exports.fileExists = _.memoize(pFile => {
    try {
        fs.accessSync(pFile, fs.R_OK);
    } catch (e) {
        return false;
    }

    return true;
});

/*
 * set detect-non-literal-regexp to ignore because we sanitized our input
 * (see main.js)
 */

/* eslint security/detect-non-literal-regexp: 0 */
exports.ignore = (pString, pExcludeREString) =>
    Boolean(pExcludeREString) ? !(RegExp(pExcludeREString, "g").test(pString)) : true;
