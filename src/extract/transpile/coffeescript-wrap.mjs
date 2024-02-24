import tryImport from "semver-try-require";
import meta from "#meta.cjs";

/*
 * coffeescript's npm repo was renamed from coffee-script to coffeescript
 * which means that we can encounter both in the wild (at least for a while)
 * As long as that is happening: first try coffeescript, then coffee-script.
 */
async function getCoffeeScriptModule() {
  let lReturnValue = await tryImport(
    "coffeescript",
    meta.supportedTranspilers.coffeescript,
  );

  /* c8 ignore start */
  if (lReturnValue === false) {
    lReturnValue = await tryImport(
      "coffee-script",
      meta.supportedTranspilers["coffee-script"],
    );
  }
  /* c8 ignore stop */
  return lReturnValue;
}

const coffeeScript = await getCoffeeScriptModule();

export default function coffeeScriptWrap(pLiterate) {
  return {
    isAvailable: () => coffeeScript !== false,
    transpile: (pSource) => {
      const lOptions = pLiterate ? { literate: true } : {};

      return coffeeScript.compile(pSource, lOptions);
    },
  };
}
