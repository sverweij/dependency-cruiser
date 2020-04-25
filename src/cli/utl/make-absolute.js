const path = require("path");

module.exports = (pFilename) => {
  let lReturnValue = pFilename;

  if (!path.isAbsolute(pFilename)) {
    lReturnValue = path.join(process.cwd(), pFilename);
  }
  return lReturnValue;
};
