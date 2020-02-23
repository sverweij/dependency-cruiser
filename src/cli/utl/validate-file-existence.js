const fs = require("fs");

module.exports = pDirOrFile => {
  try {
    fs.accessSync(pDirOrFile, fs.R_OK);
  } catch (pError) {
    throw new Error(`Can't open '${pDirOrFile}' for reading. Does it exist?\n`);
  }
};
