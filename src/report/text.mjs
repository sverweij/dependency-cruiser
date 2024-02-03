import figures from "figures";
import chalk from "chalk";

const DEFAULT_OPTIONS = {
  highlightFocused: false,
};
const EOL = "\n";

/**
 *
 * @param {import("../../types/cruise-result").IModule} pModule
 * @param {Set<string>} pModulesInFocus
 * @param {boolean} pHighlightFocused
 * @returns {any}
 */
function toFlatModuleDependencies(pModule, pModulesInFocus, pHighlightFocused) {
  return pModule.dependencies.map((pDependency) => ({
    from: {
      name: pModule.source,
      highlight: pHighlightFocused && Boolean(pModule.matchesFocus),
    },
    to: {
      name: pDependency.resolved,
      highlight: pHighlightFocused && pModulesInFocus.has(pDependency.resolved),
    },
  }));
}

function toFlatDependencies(pModules, pModulesInFocus, pHighlightFocused) {
  return pModules.reduce(
    (pAll, pModule) =>
      pAll.concat(
        toFlatModuleDependencies(pModule, pModulesInFocus, pHighlightFocused),
      ),
    [],
  );
}

function stringifyModule(pModule) {
  return pModule.highlight ? chalk.underline(pModule.name) : pModule.name;
}

function stringify(pFlatDependency) {
  return `${stringifyModule(pFlatDependency.from)} ${
    figures.arrowRight
  } ${stringifyModule(pFlatDependency.to)}`;
}

/**
 *
 * @param {import("../../types/cruise-result").IModule[]} pModules
 * @returns {Set<string>}
 */
function getModulesInFocus(pModules) {
  return new Set(
    pModules
      .filter((pModule) => pModule.matchesFocus || pModule.matchesReaches)
      .map((pModule) => pModule.source),
  );
}

/**
 *
 * @param {import("../../types/cruise-result").ICruiseResult} pResults
 * @param {import("../../types/reporter-options").ITextReporterOptions} pOptions
 * @returns {string}
 */
function report(pResults, pOptions) {
  const lOptions = { ...DEFAULT_OPTIONS, ...pOptions };

  return (
    toFlatDependencies(
      pResults.modules,
      getModulesInFocus(pResults.modules),
      lOptions.highlightFocused === true,
    ).reduce(
      (pAll, pDependency) => pAll.concat(stringify(pDependency)).concat(EOL),
      "",
    ) || EOL
  );
}

/**
 * Returns the results of a cruise in a text only format
 * - for each dependency the from and the two, separated by an arrow.
 * @param {import("../../types/cruise-result").ICruiseResult} pResults
 * @param {import("../../types/reporter-options").ITextReporterOptions} pOptions
 * @returns {import("../../types/dependency-cruiser").IReporterOutput}
 */
export default function text(pResults, pOptions) {
  return {
    output: report(pResults, pOptions || {}),
    exitCode: 0,
  };
}
