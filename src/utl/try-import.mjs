import { join } from "node:path/posix";
import { createRequire } from "node:module";
import { coerce, satisfies } from "semver";
import extractRootModuleName from "./extract-root-module-name.cjs";

const require = createRequire(import.meta.url);

/**
 * @throws {Error}
 * @param {string} pModuleName
 * @returns {string}
 */
function getVersion(pModuleName) {
  // // The 'proper' way to do this would be with a dynamic import with an
  // // import assertion. Because it's 'experimental' since node 16 and prints
  // // an ugly warning on stderr since node 19 we'll be using the require
  // // hack below in stead.
  // const lManifest = await import(
  //   // @ts-expect-error TS2345 extractRootModuleName can return either a string or
  //   // undefined. If undefined this function will throw. Which is _fine_, even
  //   // _expected_ in the context it's currently used
  //   path.join(extractRootModuleName(pModuleName), "package.json"),
  //   { assert: { type: "json" } }
  // );
  // // changes the return type to Promise<string>
  // return lManifest.default.version;
  // eslint-disable-next-line import/no-dynamic-require, security/detect-non-literal-require
  const lManifest = require(
    join(
      // @ts-expect-error TS2345 extractRootModuleName can return either a string or
      // undefined. If undefined this function will throw. Which is _fine_, even
      // _expected_ in the context it's currently used
      extractRootModuleName(pModuleName),
      "package.json",
    ),
  );
  return lManifest.version;
}

/**
 * Tries to import a module and optionally checks its version.
 *
 * @param {string} pModuleName - The name of the module to import.
 * @param {string} [pSemanticVersion] - An semantic version to check against.
 * @returns {Promise<NodeModule | false>} - The imported module or false if the import fails or the version does not satisfy the provided semantic version.
 */

export default async function tryImport(pModuleName, pSemanticVersion) {
  try {
    if (pSemanticVersion) {
      const lVersion = getVersion(pModuleName);
      const lCoerced = coerce(lVersion);
      if (
        lVersion &&
        lCoerced &&
        !satisfies(lCoerced.version, pSemanticVersion)
      ) {
        return false;
      }
    }
    const lModule = await import(pModuleName);
    return lModule.default ? lModule.default : lModule;
  } catch (pError) {
    return false;
  }
}
