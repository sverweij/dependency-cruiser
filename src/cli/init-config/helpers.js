const fs = require("fs");
const _get = require("lodash/get");

/*
  We could have used utl.fileExists - but that one is cached.
  Not typically what we want for this util.
 */
function fileExists(pFile) {
  try {
    fs.accessSync(pFile, fs.R_OK);
  } catch (pError) {
    return false;
  }
  return true;
}

function pnpIsEnabled() {
  let lReturnValue = false;

  try {
    const lPackageFileText = fs.readFileSync("./package.json", "utf8");
    const lPackageJSON = JSON.parse(lPackageFileText);

    lReturnValue = _get(lPackageJSON, "installConfig.pnp", lReturnValue);
  } catch (pError) {
    // silently ignore - we'll return false anyway then
  }
  return lReturnValue;
}

module.exports = {
  fileExists,
  pnpIsEnabled
};
