const fs = require("fs");

module.exports = pFileName => {
  try {
    fs.unlinkSync(pFileName);
  } catch (e) {
    // process.stderr.write(e.message || e);
  }
};
