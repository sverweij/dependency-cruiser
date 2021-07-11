const tryRequire = require("semver-try-require");
const livescript = tryRequire(
  "livescript",
  require("../../../package.json").supportedTranspilers.livescript
);

/* c8 ignore start */
module.exports = {
  isAvailable: () => livescript !== false,

  transpile: (pSource) => livescript.compile(pSource),
};
/* c8 ignore stop */
