const getExtension = require("../utl/get-extension");

let gFollowableExtensions = new Set();
let gFollowableExtensionsInitialized = false;

function initFollowableExtensions(pResolveOptions) {
  let lReturnValue = new Set(pResolveOptions.extensions);

  // we could include things like pictures, movies, html, xml
  // etc in KNOWN_UNFOLLOWABLES as well. Typically in
  // javascript-like sources you don't import non-javascript
  // stuff without mentioning the extension (`import 'styles.scss`
  // is more clear than`import 'styles'` as you'd expect that
  // to resolve to something javascript-like.
  // Defensively added the stylesheetlanguages here explicitly
  // nonetheless - they can contain import statements and the
  // fallback javascript parser will happily parse them, which
  // will result in false positives.
  const KNOWN_UNFOLLOWABLES = [
    ".json",
    ".node",
    ".css",
    ".sass",
    ".scss",
    ".stylus",
    ".less",
  ];

  KNOWN_UNFOLLOWABLES.forEach((pUnfollowable) => {
    lReturnValue.delete(pUnfollowable);
  });
  return lReturnValue;
}

function init(pResolveOptions) {
  if (!gFollowableExtensionsInitialized || pResolveOptions.bustTheCache) {
    gFollowableExtensions = initFollowableExtensions(pResolveOptions);
    gFollowableExtensionsInitialized = true;
  }
}

function isFollowable(pResolvedFilename, pResolveOptions) {
  init(pResolveOptions);
  return gFollowableExtensions.has(getExtension(pResolvedFilename));
}

module.exports = isFollowable;
