const path = require("path");

function relativize(pFileDir) {
  // if pFileDir === process.cwd() path.relative will yield an empty string
  // whereas we actually want something non-empty => hence normalize
  // the thing
  return path.isAbsolute(pFileDir)
    ? path.normalize(path.relative(process.cwd(), pFileDir))
    : pFileDir;
}

module.exports = pFileDirArray => pFileDirArray.map(relativize);
