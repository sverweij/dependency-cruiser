const fs = require("node:fs");

module.exports = (pFileName) => {
  try {
    fs.unlinkSync(pFileName);
  } catch {
    // deliberately left empty
  }
};
