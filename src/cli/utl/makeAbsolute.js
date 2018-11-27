const path = require('path');

module.exports = (pFilename) => {
    let lRetval = pFilename;

    if (!path.isAbsolute(pFilename)) {
        lRetval = path.join(process.cwd(), pFilename);
    }
    return lRetval;

};
