"use strict";

const fs                          = require('fs');
const path                        = require('path').posix;
const acorn                       = require('acorn');
const acorn_loose                 = require('acorn/dist/acorn_loose');
const _                           = require('lodash');
const pathToPosix                 = require('./resolve/pathToPosix');
const resolve                     = require('./resolve');
const transpile                   = require('./transpile');
const ignore                      = require('./ignore');
const extractES6Dependencies      = require('./extract-ES6');
const extractCommonJSDependencies = require('./extract-commonJS');
const extractAMDDependencies      = require('./extract-AMD');

/**
 * Returns the extension of the given file name path.
 *
 * Just using path.extname would be fine for most cases,
 * except for coffeescript, where a markdown extension can
 * mean literate coffeescript.
 *
 * @param {string} pFileName path to the file to be parsed
 * @return {string}          extension
 */
function getExtension(pFileName) {
    let lRetval = path.extname(pFileName);

    if (lRetval === ".md") {
        return pFileName.endsWith(".coffee.md") ? ".coffee.md" : lRetval;
    }
    return lRetval;
}

/**
 * Returns the abstract syntax tree of the module identified by the passed
 * file name. It obtains this by (1) transpiling the contents of the file
 * into javascript (if necessary) (2) parsing it.
 *
 * If parsing fails we fall back to acorn's 'loose' parser
 *
 * @param {string} pFileName path to the file to be parsed
 * @returns {object}         the abstract syntax tree
 */
function getAST(pFileName) {
    const lFile = transpile(
        getExtension(pFileName),
        fs.readFileSync(pFileName, 'utf8')
    );

    try {
        return acorn.parse(lFile, {sourceType: 'module'});
    } catch (e) {
        return acorn_loose.parse_dammit(lFile, {sourceType: 'module'});
    }
}
const getASTCached = _.memoize(getAST);


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
                moduleSystems: ["cjs", "es6", "amd"]
            },
            pOptions
        );

        lOptions.baseDir = pathToPosix(lOptions.baseDir);
        const lAST = getASTCached(path.join(lOptions.baseDir, pFileName));
        let lDependencies = [];

        if (lOptions.moduleSystems.indexOf("cjs") > -1){
            extractCommonJSDependencies(lAST, lDependencies);
        }

        if (lOptions.moduleSystems.indexOf("es6") > -1){
            extractES6Dependencies(lAST, lDependencies);
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
