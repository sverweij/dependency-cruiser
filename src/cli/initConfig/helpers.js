const fs   = require('fs');
const _get = require('lodash/get');

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

function pnpIsEnabled() {
    let lRetval = false;

    try {
        const lPackageFileText = fs.readFileSync('./package.json', 'utf8');
        const lPackageJSON = JSON.parse(lPackageFileText);

        lRetval = _get(lPackageJSON, 'installConfig.pnp', lRetval);
    } catch (e) {
        // silently ignore - we'll return false anyway then
    }
    return lRetval;
}

module.exports = {
    fileExists,
    pnpIsEnabled
};
