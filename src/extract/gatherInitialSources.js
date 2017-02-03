const fs   = require('fs');
const path = require('path');
const utl  = require('../utl');
const transpileMeta = require('./transpile/meta');

const SUPPORTED_EXTENSIONS = transpileMeta.scannableExtensions;

function gatherScannableFilesFromDir (pDirName, pOptions) {
    return fs.readdirSync(pDirName)
        .filter(pFileInDir => utl.ignore(pFileInDir, pOptions.exclude))
        .reduce((pSum, pFileName) => {
            if (fs.statSync(path.join(pDirName, pFileName)).isDirectory()){
                return pSum.concat(gatherScannableFilesFromDir(path.join(pDirName, pFileName), pOptions));
            }
            if (SUPPORTED_EXTENSIONS.some(pExt => pFileName.endsWith(pExt))){
                return pSum.concat(path.join(pDirName, pFileName));
            }
            return pSum;
        }, []);
}

module.exports = (pFileDirArray, pOptions) =>
    pFileDirArray.reduce(
        (pAll, pThis) => {
            if (fs.statSync(pThis).isDirectory()) {
                return pAll.concat(gatherScannableFilesFromDir(pThis, pOptions));
            } else {
                return pAll.concat(pThis);
            }
        },
        []
    );
