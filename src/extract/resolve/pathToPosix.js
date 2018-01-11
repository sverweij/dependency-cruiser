const path = require('path');

/**
 * On win32 platforms transform win32 type paths into posix paths
 * (leaves paths on posix platforms alone)
 *
 * @param  {string} pFilePath   the path to transform
 * @param  {string} pPathModule the path module/ object to use (for testing
 *                              this module on posix platforms only; defaults to require('path'))
 * @return {string}             the transformed path
 */
module.exports = (pFilePath, pPathModule) => {
    const lPathModule = pPathModule || path;

    if (lPathModule.sep !== lPathModule.posix.sep) {
        return pFilePath.split(lPathModule.sep).join(lPathModule.posix.sep);
    }

    return pFilePath;
};
