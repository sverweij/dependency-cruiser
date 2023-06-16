import path from "node:path/posix";
import { createRequire } from "node:module";
import { coerce, satisfies } from "semver";

const require = createRequire(import.meta.url);
const scopedRequire = createRequire(path.join(process.cwd(), "/dummy.js"));

const PACKAGE_RE = "[^/]+";
const SCOPED_PACKAGE_RE = "@[^/]+(/[^/]+)";
const ROOT_MODULE_RE = new RegExp(`^(${SCOPED_PACKAGE_RE}|${PACKAGE_RE})`, "g");

function extractRootModuleName(pModuleName) {
  return (pModuleName.match(ROOT_MODULE_RE) || []).shift();
}

function getVersion(pModuleName, pRequireFunction) {
  // of course we'd love to use something like an import with an import assertion
  // (yo, you're import-ing 'json'!), but that's _experimental_, printing scary
  // messages to stderr so: ¯\_(ツ)_/¯
  const lManifest = pRequireFunction(
    path.join(extractRootModuleName(pModuleName), "package.json")
  );
  return lManifest.version;
}

function doTryImportAvailable(pModuleName, pSemanticVersion, pRequireFunction) {
  try {
    if (pSemanticVersion) {
      const lVersion = getVersion(pModuleName, pRequireFunction);
      const lCoerced = coerce(lVersion);
      if (
        lVersion &&
        lCoerced &&
        !satisfies(lCoerced.version, pSemanticVersion)
      ) {
        return false;
      }
    }
    // of course we'd love to use something like import.meta.resolve, but
    // that's _experimental_, so ¯\_(ツ)_/¯
    return Boolean(pRequireFunction.resolve(pModuleName));
  } catch (pError) {
    return false;
  }
}

export default function tryImportAvailable(pModuleName, pSemanticVersion) {
  return (
    doTryImportAvailable(pModuleName, pSemanticVersion, scopedRequire) ||
    doTryImportAvailable(pModuleName, pSemanticVersion, require)
  );
}
