"use strict";

const acorn                       = require('acorn');
const acorn_loose                 = require('acorn/dist/acorn_loose');
const fs                          = require('fs');
const _                           = require('lodash');
const path                        = require('path');
const resolver                    = require('./resolver');
const validator                   = require('../validate/validator');
const utl                         = require('../utl');
const extractES6Dependencies      = require('./extractor-ES6').extract;
const extractCommonJSDependencies = require('./extractor-commonJS').extract;
const extractAMDDependencies      = require('./extractor-AMD').extract;

function getASTBare(pFileName) {
    const lFile = fs.readFileSync(pFileName, 'utf8');

    try {
        return acorn.parse(lFile, {sourceType: 'module'});
    } catch (e) {
        return acorn_loose.parse_dammit(lFile, {sourceType: 'module'});
    }
}
const getAST = _.memoize(getASTBare);


/**
 * Returns an array of dependencies present in the given file. Of
 * each dependency it returns
 *   module        - the name of the module as found in the file
 *   resolved      - the filename the dependency resides in (including the path
 *                   to the current directory or the directory passed as
 *                   'baseDir' in the options)
 *   moduleSystem  - the module system
 *   coreModule    - a boolean indicating whether it is a (nodejs) core module
 *
 *
 * @param  {string} pFileName path to the file
 * @param  {object} pOptions  an object with one or more of these properties:
 *                            - baseDir       - the directory to consider as the
 *                                              base for all files
 *                                              Default: the current working directory
 *                            - moduleSystems - an array of module systems to
 *                                              consider.
 *                                              Default: ["cjs", "es6", "amd"]
 *                            - exclude       - a regular expression string
 *                              with a pattern of modules to exclude (e.g.
 *                              "(node_modules)"). Default: none
 * @return {array}           an array of dependency objects (see above)
 */
function extractDependencies(pFileName, pOptions) {
    try {
        const lAST = getAST(pFileName);
        let lDependencies = [];

        pOptions = _.defaults(
            pOptions,
            {
                baseDir: process.cwd(),
                moduleSystems: ["cjs", "es6", "amd"]
            }
        );

        if (_.includes(pOptions.moduleSystems, "cjs")){
            extractCommonJSDependencies(lAST, lDependencies);
        }

        if (_.includes(pOptions.moduleSystems, "es6")){
            extractES6Dependencies(lAST, lDependencies);
        }

        if (_.includes(pOptions.moduleSystems, "amd")){
            extractAMDDependencies(lAST, lDependencies);
        }

        return _(lDependencies)
            .uniqBy(pDependency => `${pDependency.moduleName} ${pDependency.moduleSystem}`)
            .sortBy(pDependency => `${pDependency.moduleName} ${pDependency.moduleSystem}`)
            .map(
                pDependency => {
                    const lResolved = resolver.resolveModuleToPath(
                        pDependency,
                        pOptions.baseDir,
                        path.dirname(pFileName)
                    );

                    return Object.assign(
                        {
                            module       : pDependency.moduleName,
                            resolved     : lResolved.resolved,
                            moduleSystem : pDependency.moduleSystem,
                            coreModule   : lResolved.coreModule,
                            followable   : lResolved.followable
                        },
                        validator.validate(
                            pOptions.validate,
                            pOptions.rulesFile,
                            pFileName,
                            lResolved.resolved
                        )
                    );
                }
            )
            .filter(pDep => utl.ignore(pDep.resolved, pOptions.exclude))
            .value();
    } catch (e) {
        throw new Error(`Extracting dependencies ran afoul of... ${e.message} in ${pFileName}`);
    }
}

exports.extractDependencies = extractDependencies;
