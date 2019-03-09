const defaults = require('./defaults.json');

function uniq(pArray) {
    return Array.from(new Set(pArray));
}

function normalizeDoNotFollow(pDoNotFollow) {
    const lDoNotFollow = pDoNotFollow || {};

    if (typeof lDoNotFollow === 'string') {
        return {
            path: lDoNotFollow
        };
    }
    return lDoNotFollow;
}

module.exports = pOptions => {
    let lRetval = Object.assign(
        {
            baseDir: process.cwd()
        },
        defaults,
        pOptions
    );

    lRetval.maxDepth = parseInt(lRetval.maxDepth, 10);
    lRetval.moduleSystems = uniq(lRetval.moduleSystems.sort());
    lRetval.doNotFollow = normalizeDoNotFollow(lRetval.doNotFollow);

    return lRetval;
};
