"use strict";

const fs  = require('fs');

function validateFileExistence(pDirOrFile) {
    try {
        fs.accessSync(pDirOrFile, fs.R_OK);
    } catch (e) {
        throw Error(`Can't open '${pDirOrFile}' for reading. Does it exist?\n`);
    }
}

function validateValidation(pValidate) {
    if (typeof pValidate !== 'boolean'){
        validateFileExistence(pValidate);
    } else if (pValidate === true){
        validateFileExistence(".dependency-cruiser.json");
    }
}

module.exports = (pFileDirArray, pValidate) => {
    pFileDirArray.forEach(validateFileExistence);
    if (Boolean(pValidate)) {
        validateValidation(pValidate);
    }
};
