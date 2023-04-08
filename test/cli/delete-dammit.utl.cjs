const fs = require("node:fs");

module.exports = (pFileName) => {
  try {
    fs.unlinkSync(pFileName);
  } catch (pError) {
    // process.stderr.write(e.message || e);
  }
};
