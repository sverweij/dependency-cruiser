import { isAbsolute, resolve as path_resolve } from "node:path";
import { isMatch } from "picomatch";
import getExtension from "#utl/get-extension.mjs";

let gFollowableExtensionsCache = new Set();
let gFollowableExtensionsCacheInitialized = false;

export function isScoped(pModuleName) {
  return pModuleName.startsWith("@");
}

export function isRelativeModuleName(pModuleName) {
  return (
    pModuleName.startsWith("./") ||
    pModuleName.startsWith("../") ||
    pModuleName === "." ||
    pModuleName === ".."
    // note ".blah" and "..blah" are _not_ relative
  );
}

export function isExternalModule(
  pResolvedModuleName,
  pModuleFolderNames = ["node_modules"],
  pBaseDirectory = ".",
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
        if (isAbsolute(pModuleFolderName)) {
          return path_resolve(pBaseDirectory, pResolvedModuleName).startsWith(
            pModuleFolderName,
          );
        }
        return pResolvedModuleName.includes(pModuleFolderName);
      },
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

export function isFollowable(pResolvedFilename, pResolveOptions) {
  return getFollowableExtensions(pResolveOptions).has(
    getExtension(pResolvedFilename),
  );
}

/**
 * @param {string} pModuleName
 * @param {object} pManifest
 * @returns {boolean}
 */
function isSubpathImport(pModuleName, pManifest) {
  return (
    pModuleName.startsWith("#") &&
    Object.keys(pManifest?.imports ?? {}).some((pImportLHS) => {
      // Although they might look as such, the LHS of an import statement
      // (a 'subpath pattern') is not a glob. The * functions as string
      // replacement only.
      // Quoting https://nodejs.org/api/packages.html#subpath-imports :
      // > "* maps expose nested subpaths as it is a string replacement syntax only"
      const lMatchREasString = pImportLHS.replace(/\*/g, ".+");
      // eslint-disable-next-line security/detect-non-literal-regexp
      const lMatchRE = new RegExp(`^${lMatchREasString}$`);
      return Boolean(pModuleName.match(lMatchRE));
    })
  );
}

/**
 * @param {string} pModuleName
 * @param {object} pAliasObject
 * @returns {boolean}
 */
function isWebPackAliased(pModuleName, pAliasObject) {
  return Object.keys(pAliasObject || {}).some((pAliasLHS) =>
    pModuleName.startsWith(pAliasLHS),
  );
}

/**
 * @param {string} pModuleName
 * @param {string} pResolvedModuleName
 * @param {object} pManifest
 * @returns {boolean}
 */
// eslint-disable-next-line max-lines-per-function
function isWorkspaceAliased(pModuleName, pResolvedModuleName, pManifest) {
  // reference: https://docs.npmjs.com/cli/v10/using-npm/workspaces
  if (pManifest?.workspaces) {
    // workspaces are an array of globs that match the (sub) workspace
    // folder itself only.
    //
    // workspaces: [
    //  "packages/*",  -> matches packages/a, packages/b, packages/c, ...
    //  "libs/x",      -> matches libs/x
    //  "libs/y",      -> matches libs/y
    //  "apps"         -> matches apps
    // ]
    //
    // By definition this will _never_ match resolved module names.
    // E.g. in packages/a => packages/a/dist/main/index.js or
    // in libs/x => libs/x/index.js
    //
    // This is why we chuck a `/**` at the end of each workspace glob, which
    // transforms it into a 'starts with' glob. And yeah, you can have a /
    // at the end of a glob. And because double slashes are taken literally
    // we have a ternary operator to prevent those.
    //
    // oh and: ```picomatch.isMatch('asdf', 'asdf/**') === true``` so
    // in case it's only 'asdf' that's in the resolved module name for some reason
    //  we're good as well.
    const lModuleFriendlyWorkspaceGlobs = pManifest.workspaces.map(
      (pWorkspace) =>
        pWorkspace.endsWith("/") ? `${pWorkspace}**` : `${pWorkspace}/**`,
    );
    if (isMatch(pResolvedModuleName, lModuleFriendlyWorkspaceGlobs)) {
      return true;
    }
    // it's possible to run node with --preserve-symlinks, in which case
    // the symlinked workspace folders are not resolved to their realpath.
    // So we need to check both the thing in node_modules _and_ the resolved
    // thing. Annoyingly, the symlink in node_modules is the `name` attribute
    // of the workspace, not the path of the  workspace itself. So if it's
    // in node_modules we need to check against the unresolved modulename.
    //
    // Other then the detection for when symlinks are resolved to their realpath
    // (the if above), this is a 'best effort' detection only for now; there's
    // guaranteed to be scenarios where this will fail. How often is the
    // --preserve-symlinks flag used in practice, though?
    const lModuleFriendlyWorkspaceGlobsWithNodeModules =
      lModuleFriendlyWorkspaceGlobs.map(
        (pWorkspace) => `(node_modules/)?${pWorkspace}`,
      );
    return isMatch(pModuleName, lModuleFriendlyWorkspaceGlobsWithNodeModules);
  }
  return false;
}

/**
 * @param {string} pModuleName
 * @param {string} pResolvedModuleName
 * @param {import("../../../types/resolve-options").IResolveOptions} pResolveOptions
 * @param {string} pBaseDirectory
 * @returns {boolean}
 */
function isLikelyTSAliased(
  pModuleName,
  pResolvedModuleName,
  pResolveOptions,
  pBaseDirectory,
) {
  return (
    pResolveOptions.tsConfig &&
    !isRelativeModuleName(pModuleName) &&
    pResolvedModuleName &&
    !isExternalModule(pResolvedModuleName, ["node_modules"], pBaseDirectory)
  );
}

/**
 * @param {string} pModuleName
 * @param {string} pResolvedModuleName
 * @param {import("../../../types/resolve-options").IResolveOptions} pResolveOptions
 * @param {object} pManifest
 * @returns {string[]}
 */
export function getAliasTypes(
  pModuleName,
  pResolvedModuleName,
  pResolveOptions,
  pManifest,
) {
  if (isSubpathImport(pModuleName, pManifest)) {
    return ["aliased", "aliased-subpath-import"];
  }
  if (isWebPackAliased(pModuleName, pResolveOptions.alias)) {
    return ["aliased", "aliased-webpack"];
  }
  if (isWorkspaceAliased(pModuleName, pResolvedModuleName, pManifest)) {
    return ["aliased", "aliased-workspace"];
  }
  if (
    isLikelyTSAliased(
      pModuleName,
      pResolvedModuleName,
      pResolveOptions,
      pResolveOptions.baseDirectory,
    )
  ) {
    return ["aliased", "aliased-tsconfig"];
  }
  return [];
}
