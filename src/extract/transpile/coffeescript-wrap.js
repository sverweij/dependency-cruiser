const tryRequire = require("semver-try-require");
const { supportedTranspilers } = require("../../../src/meta.js");

/*
 * coffeescript's npm repo was renamed from coffee-script to coffeescript
 * which means that we can encounter both in the wild (at least for a while)
 * As long as that is happening: first try coffeescript, then coffee-script.
 */
function getCoffeeScriptModule() {
  let lReturnValue = tryRequire(
    "coffeescript",
    supportedTranspilers.coffeescript
  );

  /* c8 ignore start */
  if (lReturnValue === false) {
    lReturnValue = tryRequire(
      "coffee-script",
      supportedTranspilers["coffee-script"]
    );
  }
  /* c8 ignore stop */
  return lReturnValue;
}

const coffeeScript = getCoffeeScriptModule();

module.exports = function coffeeScriptWrap(pLiterate) {
  return {
    isAvailable: () => coffeeScript !== false,
    transpile: (pSource) => {
      const lOptions = pLiterate ? { literate: true } : {};

      return coffeeScript.compile(pSource, lOptions);
    },
  };
};
