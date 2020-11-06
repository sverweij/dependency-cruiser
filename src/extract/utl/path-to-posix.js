const path = require("path");

/**
 * On win32 platforms transform win32 type paths into posix paths
 * (leaves paths on posix platforms alone)
 *
 * This function is just to make dependency-cruiser's internal
 * representation consistent. This is the reason it doesn't have
 * exceptions for extended paths (\\my-cool-share\bladiebla)
 * and paths that contain non-ascii characters like e.g.
 * sindresorhus/slash does.
 *
 * One consequence of this is that internal dependency-cruise
 * representations cannot be converted back to win32 paths
 * with 100% confidence.
 *
 * @param  {string} pFilePath   the path to transform
 * @param  {string} pPathModule optional - the path module/ object to use (for testing
 *                              this module on posix platforms only; defaults to require('path'))
 * @return {string}             the transformed path
 */
module.exports = function pathToPosix(pFilePath, pPathModule) {
  const lPathModule = pPathModule || path;

  if (lPathModule.sep !== path.posix.sep) {
    return pFilePath.split(lPathModule.sep).join(path.posix.sep);
  }

  return pFilePath;
};
