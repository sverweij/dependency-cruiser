const defaults = require('./defaults.json');

function uniq(pArray) {
    return Array.from(new Set(pArray));
}

module.exports = pOptions => {
    let lRetval = Object.assign(
        {
            baseDir: process.cwd()
        },
        defaults,
        pOptions
    );

    // lRetval.baseDir = pathToPosix(lRetval.baseDir);
    lRetval.maxDepth = parseInt(lRetval.maxDepth, 10);
    lRetval.moduleSystems = uniq(lRetval.moduleSystems.sort());

    return lRetval;
};
