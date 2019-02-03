const path = require('path').posix;

function toFullPath (pAll, pCurrent) {
    return `${pAll}${pCurrent}${path.sep}`;
}

function aggregate (pPathSnippet, pCounter, pPathArray){
    return {
        snippet: pPathSnippet,
        aggregateSnippet: `${pPathArray.slice(0, pCounter).reduce(toFullPath, '')}${pPathSnippet}`
    };
}

function folderify(pModule) {
    let lAdditions = {};
    let lDirName = path.dirname(pModule.source);

    if (lDirName !== ".") {
        lAdditions.folder = lDirName;
        lAdditions.path   = lDirName.split(path.sep).map(aggregate);
    }

    lAdditions.label = path.basename(pModule.source);

    return Object.assign(
        {},
        pModule,
        lAdditions
    );
}

module.exports = folderify;
