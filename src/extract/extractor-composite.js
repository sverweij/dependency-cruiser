"use strict";

const fs        = require('fs');
const path      = require('path');
const _         = require('lodash');

const extractor = require('./extractor');
const utl       = require('../utl');

function getAllJSFilesFromDir (pDirName, pOptions) {
    return fs.readdirSync(pDirName)
        .filter(pFileInDir => utl.ignore(pFileInDir, pOptions.exclude))
        .reduce((pSum, pFileName) => {
            if (fs.statSync(path.join(pDirName, pFileName)).isDirectory()){
                return pSum.concat(getAllJSFilesFromDir(path.join(pDirName, pFileName), pOptions));
            }
            if (path.extname(pFileName) === ".js"){
                return pSum.concat(path.join(pDirName, pFileName));
            }
            return pSum;
        }, []);
}

function extractRecursive (pFileName, pOptions, pVisited) {
    pOptions = pOptions || {};
    pVisited = pVisited || new Set();
    pVisited.add(pFileName);

    let lRetval = [];
    const lDependencies = extractor.extractDependencies(pFileName, pOptions);

    lRetval.push({
        source: pFileName,
        dependencies: lDependencies
    });

    lDependencies
        .filter(pDep => pDep.followable && !pVisited.has(pDep.resolved))
        .forEach(
            pDep => {
                if (!pVisited.has(pDep.resolved)){
                    lRetval = lRetval.concat(
                        extractRecursive(pDep.resolved, pOptions, pVisited)
                    );
                }
            }
        );
    return lRetval;
}

function extractRecursiveDir(pDirName, pOptions) {
    let lVisited = new Set();

    return _.spread(_.concat)(
        getAllJSFilesFromDir(pDirName, pOptions)
            .reduce((pDependencies, pFilename) => {
                if (!lVisited.has(pFilename)){
                    lVisited.add(pFilename);
                    return pDependencies.concat(
                        extractRecursive(pFilename, pOptions, lVisited)
                    );
                }
                return pDependencies;
            }, [])
    );
}

function extract(pDirOrFile, pOptions, pCallback) {
    let lRetvalToTransform = {};
    let lCallback = pCallback ? pCallback : pInput => pInput;

    if (fs.statSync(pDirOrFile).isDirectory()) {
        lRetvalToTransform = extractRecursiveDir(pDirOrFile, pOptions);
    } else {
        lRetvalToTransform = extractRecursive(pDirOrFile, pOptions);
    }
    return lCallback(lRetvalToTransform);
}

exports.extract = extract;
