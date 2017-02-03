"use strict";

const _                = require('lodash');
const resolveAMDModule = require('./resolve-AMD');
const resolveCJSModule = require('./resolve-commonJS');

const isRelativeModuleName = pString => pString.startsWith(".");

module.exports = (pDependency, pBaseDir, pFileDir) => {
    if (isRelativeModuleName(pDependency.moduleName)){
        return resolveCJSModule(pDependency.moduleName, pBaseDir, pFileDir);
    } else if (_.includes(["cjs", "es6"], pDependency.moduleSystem)){
        return resolveCJSModule(pDependency.moduleName, pBaseDir, pFileDir);
    } else {
        return resolveAMDModule(pDependency.moduleName, pBaseDir, pFileDir);
    }
};
