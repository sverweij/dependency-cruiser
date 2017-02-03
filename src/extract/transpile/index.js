"use strict";

const meta = require("./meta");

module.exports = (pExtension, pFile) => {
    const lWrapper = meta.getWrapper(pExtension);

    if (lWrapper.isAvailable()) {
        return lWrapper.transpile(pFile);
    } else {
        return pFile;
    }
};
