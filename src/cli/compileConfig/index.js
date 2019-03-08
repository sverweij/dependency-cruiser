const path                    = require('path');
const resolve                 = require('../../extract/resolve/resolve');
const normalizeResolveOptions = require('../../main/resolveOptions/normalize');
const readConfig              = require('./readConfig');
const mergeConfigs            = require('./mergeConfigs');


/* eslint no-use-before-define: 0 */
function processExtends(pRetval, pAlreadyVisited, pBaseDir) {
    if (typeof pRetval.extends === "string") {
        pRetval = mergeConfigs(
            pRetval,
            compileConfig(pRetval.extends, pAlreadyVisited, pBaseDir)
        );
    }

    if (Array.isArray(pRetval.extends)) {
        pRetval = pRetval.extends.reduce(
            (pAll, pExtends) =>
                mergeConfigs(
                    pAll,
                    compileConfig(pExtends, pAlreadyVisited, pBaseDir)
                ),
            pRetval
        );
    }
    Reflect.deleteProperty(pRetval, 'extends');
    return pRetval;
}

function getRunningProcessResolutionStrategy() {
    // This should work, but doesn't:
    // process.versions.pnp ? "yarn-pnp" : "node_modules";

    // "yarn-pnp" works both for the pnp and for the node_modules strategies,
    // and because it's only for the config it won't hamper performance
    // (should typically be 0 - 2 calls for an entire run)
    return "yarn-pnp";
}

function compileConfig(pConfigFileName, pAlreadyVisited = new Set(), pBaseDir = process.cwd()) {

    const lResolvedFileName = resolve(
        pConfigFileName,
        pBaseDir,
        normalizeResolveOptions(
            {
                extensions: [".js", ".json"]
            },
            {
                externalModuleResolutionStrategy: getRunningProcessResolutionStrategy()
            }
        ),
        'cli'
    );
    const lBaseDir = path.dirname(lResolvedFileName);

    if (pAlreadyVisited.has(lResolvedFileName)){
        throw new Error(`config is circular - ${Array.from(pAlreadyVisited).join(' -> ')} -> ${lResolvedFileName}.\n`);
    }
    pAlreadyVisited.add(lResolvedFileName);

    let lRetval = readConfig(lResolvedFileName, pBaseDir);

    if (lRetval.hasOwnProperty("extends")) {
        lRetval = processExtends(lRetval, pAlreadyVisited, lBaseDir);
    }

    return lRetval;
}

module.exports = compileConfig;
