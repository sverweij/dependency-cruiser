/* eslint-disable security/detect-object-injection */
const fs = require("fs");
const figures = require("figures");
const chalk = require("chalk");
const wrapAndIndent = require("../../utl/wrap-and-indent");
const $defaults = require("../defaults.json");
const { readManifest, folderNameArrayToRE } = require("./environment-helpers");

const PACKAGE_MANIFEST = `./${$defaults.PACKAGE_MANIFEST}`;

function compileRunScripts(pInitOptions) {
  let lReturnValue = {};

  if (pInitOptions && (pInitOptions.sourceLocation || []).length > 0) {
    const lSourceLocations = pInitOptions.sourceLocation.join(" ");
    const lSourceLocationRE = folderNameArrayToRE(pInitOptions.sourceLocation);
    const lTestLocations = (pInitOptions.testLocation || []).join(" ");

    lReturnValue = {
      depcruise: `depcruise ${lSourceLocations} ${lTestLocations} -v`,
      "depcruise:graph": `depcruise ${lSourceLocations} --include-only '${lSourceLocationRE}' -v -T dot | dot -T svg | depcruise-wrap-stream-in-html > dependency-graph.html`,
      "depcruise:graph-archi": `depcruise ${lSourceLocations} --include-only '${lSourceLocationRE}' -v -T archi | dot -T svg | depcruise-wrap-stream-in-html > high-level-dependency-graph.html`,
      "depcruise:html": `depcruise ${lSourceLocations} ${lTestLocations} -v -T err-html > dependency-violation-report.html`,
    };
  }

  return lReturnValue;
}

/**
 * Return the scripts in pAdditionalRunScripts that don't yet exist in
 * pExistingRunScripts
 *
 * @param {object} pAdditionalRunScripts
 * @param {object} pExistingRunScripts
 *
 * @return {object} the scripts in pAdditionalRunScripts that don't yet exist in
 * pExistingRunScripts
 */
function filterNewScriptEntries(pExistingRunScripts, pAdditionalRunScripts) {
  return Object.keys(pAdditionalRunScripts || {})
    .filter((pKey) => !pExistingRunScripts[pKey])
    .reduce((pAll, pKey) => {
      pAll[pKey] = pAdditionalRunScripts[pKey];
      return pAll;
    }, {});
}

function addRunScriptsToManifest(pManifest, pAdditionalRunScripts) {
  const lManifest = { ...(pManifest || {}) };
  const lExistingRunScripts = lManifest.scripts || {};

  // This could instead simply be done with
  // {...pAdditionalScriptEntries, ...lManifest} and no logic at all,
  // but that'd add the new scripts on top, which doesn't feel right
  //
  // An alternative would be to sort the keys - but that'd be rude
  lManifest.scripts = {
    ...lExistingRunScripts,
    ...filterNewScriptEntries(lExistingRunScripts, pAdditionalRunScripts),
  };

  return lManifest;
}

function getSuccessMessage(pDestinationManifestFileName) {
  const EXPLANATION_INDENT = 6;

  return (
    `  ${chalk.green(
      figures.tick
    )} Run scripts added to '${pDestinationManifestFileName}':` +
    `\n    ${chalk.green(figures.play)} npm run depcruise` +
    `\n${wrapAndIndent(
      "validates against the rules in .dependency-cruiser.json and writes the outcome to stdout",
      EXPLANATION_INDENT
    )}` +
    `\n\n    ${chalk.green(figures.play)} npm run depcruise:html` +
    `\n${wrapAndIndent(
      "validates against the rules in .dependency-cruiser.json and writes it to 'dependendency-violation-report.html' with a friendly layout",
      EXPLANATION_INDENT
    )}` +
    `\n\n    ${chalk.green(figures.play)} npm run depcruise:graph` +
    `\n${wrapAndIndent(
      "writes a detailed internal graph of your app to 'dependency-graph.html'",
      EXPLANATION_INDENT
    )}` +
    `\n\n    ${chalk.green(figures.play)} npm run depcruise:graph-archi` +
    `\n${wrapAndIndent(
      "writes a high-level internal graph of your app to 'high-level-dependency-graph.html'",
      EXPLANATION_INDENT
    )}` +
    `\n\n`
  );
}

module.exports = {
  addRunScriptsToManifest,
  compileRunScripts,
  writeRunScriptsToManifest: (
    pNormalizedInitOptions,
    pManifest = readManifest(),
    pDestinationManifestFileName = PACKAGE_MANIFEST
  ) => {
    const lUpdatedManifest = addRunScriptsToManifest(
      pManifest,
      compileRunScripts(pNormalizedInitOptions)
    );

    fs.writeFileSync(
      pDestinationManifestFileName,
      JSON.stringify(lUpdatedManifest, null, "  "),
      "utf8"
    );

    process.stdout.write(getSuccessMessage(pDestinationManifestFileName));
  },
};
