"use strict";

/*
 * set detect-non-literal-regexp to ignore because we sanitized our input
 * (see main.js)
 */

/* eslint security/detect-non-literal-regexp: 0 */
exports.ignore = (pString, pExcludeREString) =>
    Boolean(pExcludeREString) ? !(RegExp(pExcludeREString, "g").test(pString)) : true;
