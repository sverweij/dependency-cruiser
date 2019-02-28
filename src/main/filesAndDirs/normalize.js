const path = require("path");

function relativize(pFileDir) {
    return path.isAbsolute(pFileDir)
        ? path.relative(process.cwd(), pFileDir)
        : pFileDir;
}

module.exports = (pFileDirArray) => pFileDirArray.map(relativize);
