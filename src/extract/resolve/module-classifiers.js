const { builtinModules } = require("module");
const path = require("path");
const getExtension = require("../utl/get-extension");

let gFollowableExtensionsCache = new Set();
let gFollowableExtensionsCacheInitialized = false;

function isScoped(pModuleName) {
  return pModuleName.startsWith("@");
}

function isRelativeModuleName(pModuleName) {
  return (
    pModuleName.startsWith("./") ||
    pModuleName.startsWith("../") ||
    pModuleName === "." ||
    pModuleName === ".."
    // note ".blah" and "..blah" are _not_ relative
  );
}

function isCore(pModuleName) {
  return builtinModules.includes(pModuleName);
}

function isExternalModule(
  pResolvedModuleName,
  pModuleFolderNames = ["node_modules"],
  pBaseDirectory = "."
) {
  return (
    Boolean(pResolvedModuleName) &&
    pModuleFolderNames.some(
      // pModules can contain relative paths, but also absolute ones.
      // WebPack treats these differently:
      // - absolute paths only match that exact path
      // - relative paths get a node lookup treatment so "turtle" matches
      //   "turtle", "../turtle", "../../turtle", "../../../turtle" (.. =>
      // turtles all the way down)
      // hence we'll have to test for them in different fashion as well.
      // reference: https://webpack.js.org/configuration/resolve/#resolve-modules
      (pModuleFolderName) => {
        if (path.isAbsolute(pModuleFolderName)) {
          return path
            .resolve(pBaseDirectory, pResolvedModuleName)
            .startsWith(pModuleFolderName);
        }
        return pResolvedModuleName.includes(pModuleFolderName);
      }
    )
  );
}

function determineFollowableExtensions(pResolveOptions) {
  let lReturnValue = new Set(pResolveOptions.extensions);

  // we could include things like pictures, movies, html, xml
  // etc in lKnownUnfollowables as well. Typically in
  // javascript-like sources you don't import non-javascript
  // stuff without mentioning the extension (`import 'styles.scss`
  // is more clear than`import 'styles'` as you'd expect that
  // to resolve to something javascript-like.
  // Defensively added the stylesheetlanguages here explicitly
  // nonetheless - they can contain import statements and the
  // fallback javascript parser will happily parse them, which
  // will result in false positives.
  const lKnownUnfollowables = [
    ".json",
    ".node",
    ".css",
    ".sass",
    ".scss",
    ".stylus",
    ".less",
  ];

  lKnownUnfollowables.forEach((pUnfollowable) => {
    lReturnValue.delete(pUnfollowable);
  });
  return lReturnValue;
}

function getFollowableExtensions(pResolveOptions) {
  if (!gFollowableExtensionsCacheInitialized || pResolveOptions.bustTheCache) {
    gFollowableExtensionsCache = determineFollowableExtensions(pResolveOptions);
    gFollowableExtensionsCacheInitialized = true;
  }
  return gFollowableExtensionsCache;
}

function isFollowable(pResolvedFilename, pResolveOptions) {
  return getFollowableExtensions(pResolveOptions).has(
    getExtension(pResolvedFilename)
  );
}

function isWebPackAliased(pModuleName, pAliasObject) {
  return Object.keys(pAliasObject || {}).some((pAliasLHS) =>
    pModuleName.startsWith(pAliasLHS)
  );
}

function isLikelyTSAliased(
  pModuleName,
  pResolvedModuleName,
  pResolveOptions,
  pBaseDirectory
) {
  return (
    pResolveOptions.tsConfig &&
    !isRelativeModuleName(pModuleName) &&
    pResolvedModuleName &&
    !isExternalModule(pResolvedModuleName, ["node_modules"], pBaseDirectory)
  );
}

function isAliassy(pModuleName, pResolvedModuleName, pResolveOptions) {
  return (
    isWebPackAliased(pModuleName, pResolveOptions.alias) ||
    isLikelyTSAliased(pModuleName, pResolvedModuleName, pResolveOptions)
  );
}

module.exports = {
  isScoped,
  isRelativeModuleName,
  isCore,
  isExternalModule,
  isFollowable,
  isAliassy,
};
