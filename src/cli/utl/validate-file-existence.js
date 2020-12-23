const fs = require("fs");

module.exports = function validateFileExistence(pDirectoryOrFile) {
  try {
    fs.accessSync(pDirectoryOrFile, fs.R_OK);
  } catch (pError) {
    throw new Error(
      `Can't open '${pDirectoryOrFile}' for reading. Does it exist?\n`
    );
  }
};
