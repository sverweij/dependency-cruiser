const regexpTree = require('regexp-tree');

const DEFAULT_REPLIMIT = 25;

/* this is a ~1:1 copy from safe-regex, maybe we refactor later */
/* eslint complexity:0 */

/* this thing is for testing any regexpses, so non-literal regexps are expected */
/* eslint security/detect-non-literal-regexp:0 */

/**
 * returns true if the passed regular expression is probably 'safe'
 * (doesn't require exponential time to calculate).
 *
 * This code is adapted from davisjam/safe-regex (which is a fork of substack/safe-regex)
 * and inlined to prevent the security problem with one of the transient dependencies
 * in that package.
 *
 * If that's patched, probably we can use the safe-regex npm module again.
 *
 * @param {string|RegExp} pRegEx - a
 * @param {any} pOptions - options denoting what to discern as safe:
 *          limit: the maximum number of repetitions still acceptable
 * @returns {boolean} - true if the expression seems safe, false in all other cases
 */
module.exports = (pRegEx, pOptions) => {
    pOptions = pOptions || {};
    const lRepLimit = pOptions.limit || DEFAULT_REPLIMIT;

    // Build an AST
    let lRegExp = null;
    let lAST = null;

    try {
    // Construct a RegExp object
        if (pRegEx instanceof RegExp) {
            lRegExp = pRegEx;
        } else if (typeof pRegEx === 'string') {
            lRegExp = new RegExp(pRegEx);
        } else {
            lRegExp = new RegExp(String(pRegEx));
        }

        // Build an AST
        lAST = regexpTree.parse(lRegExp);
    } catch (err) {
    // Invalid or unparseable input
    /* istanbul ignore next */
        return false;
    }

    let currentStarHeight = 0;
    let maxObservedStarHeight = 0;

    let repetitionCount = 0;

    regexpTree.traverse(lAST, {
        'Repetition': {
            pre () {
                repetitionCount += 1;

                currentStarHeight += 1;
                if (maxObservedStarHeight < currentStarHeight) {
                    maxObservedStarHeight = currentStarHeight;
                }
            },

            post () {
                currentStarHeight -= 1;
            }
        }
    });

    return (maxObservedStarHeight <= 1) && (repetitionCount <= lRepLimit);
};
