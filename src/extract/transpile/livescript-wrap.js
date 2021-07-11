const tryRequire = require("semver-try-require");
const { supportedTranspilers } = require("../../../src/meta.js");

const livescript = tryRequire("livescript", supportedTranspilers.livescript);

/* c8 ignore start */
module.exports = {
  isAvailable: () => livescript !== false,

  transpile: (pSource) => livescript.compile(pSource),
};
/* c8 ignore stop */
