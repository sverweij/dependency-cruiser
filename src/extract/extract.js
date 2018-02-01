"use strict";

const path                        = require('path');
const _                           = require('lodash');
const resolve                     = require('./resolve');
const ignore                      = require('./ignore');
const extractES6Dependencies      = require('./ast-extractors/extract-ES6-deps');
const extractCommonJSDependencies = require('./ast-extractors/extract-commonJS-deps');
const extractAMDDependencies      = require('./ast-extractors/extract-AMD-deps');
const extractTypeScript           = require('./ast-extractors/extract-typescript-deps');
const getJSASTCached              = require('./parse/toJavascriptAST').getASTCached;
const toTypescriptAST             = require('./parse/toTypescriptAST');

/**
 * Returns an array of dependencies present in the given file. Of
 * each dependency it returns
 *   module        - the name of the module as found in the file
 *   resolved      - the filename the dependency resides in (including the path
 *                   to the current directory or the directory passed as
 *                   'baseDir' in the options)
 *   moduleSystems  - the module system(s)
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
module.exports = (pFileName, pOptions) => {
    try {
        let lOptions = Object.assign(
            {
                baseDir: process.cwd(),
                moduleSystems: ["cjs", "es6", "amd"],
                tsPreCompilationDeps: false
            },
            pOptions
        );

        const lAST = getJSASTCached(path.join(lOptions.baseDir, pFileName));
        let lDependencies = [];

        if (lOptions.moduleSystems.indexOf("cjs") > -1){
            extractCommonJSDependencies(lAST, lDependencies);
        }

        if (lOptions.moduleSystems.indexOf("es6") > -1) {
            if (
                lOptions.tsPreCompilationDeps &&
                path.extname(pFileName).startsWith(".ts") &&
                toTypescriptAST.isAvailable()
            ) {
                lDependencies = lDependencies.concat(
                    extractTypeScript(
                        toTypescriptAST.getASTCached(
                            path.join(lOptions.baseDir, pFileName)
                        )
                    )
                );
            } else {
                extractES6Dependencies(lAST, lDependencies);
            }
        }

        if (lOptions.moduleSystems.indexOf("amd") > -1){
            extractAMDDependencies(lAST, lDependencies);
        }

        return _(lDependencies)
            .uniqBy(pDependency => `${pDependency.moduleName} ${pDependency.moduleSystem}`)
            .sortBy(pDependency => `${pDependency.moduleName} ${pDependency.moduleSystem}`)
            .map(
                pDependency => {
                    const lResolved = resolve(
                        pDependency,
                        lOptions.baseDir,
                        path.join(lOptions.baseDir, path.dirname(pFileName))
                    );
                    const lMatchesDoNotFollow = Boolean(lOptions.doNotFollow)
                        ? RegExp(lOptions.doNotFollow, "g").test(lResolved.resolved)
                        : false;

                    return Object.assign(
                        lResolved,
                        {
                            module       : pDependency.moduleName,
                            moduleSystem : pDependency.moduleSystem,
                            followable   : lResolved.followable && !lMatchesDoNotFollow,
                            matchesDoNotFollow : lMatchesDoNotFollow
                        }
                    );
                }
            )
            .filter(pDep => ignore(pDep.resolved, lOptions.exclude))
            .value();
    } catch (e) {
        throw new Error(`Extracting dependencies ran afoul of...\n\n  ${e.message}\n... in ${pFileName}\n\n`);
    }
};
