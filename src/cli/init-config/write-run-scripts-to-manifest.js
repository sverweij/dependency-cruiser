/* eslint-disable security/detect-object-injection */
const fs = require("fs");
const figures = require("figures");
const chalk = require("chalk");
const wrapAndIndent = require("../../utl/wrap-and-indent");
const $defaults = require("../defaults");
const { readManifest } = require("./environment-helpers");
const { folderNameArrayToRE } = require("./utl");

const PACKAGE_MANIFEST = `./${$defaults.PACKAGE_MANIFEST}`;

const EXPERIMENTAL_SCRIPT_DOC = [
  {
    name: "depcruise",
    headline: "npm run depcruise",
    description:
      "validates against the rules in .dependency-cruiser.js and writes the outcome to stdout",
  },
  {
    name: "depcruise:html",
    headline: "npm run depcruise:html",
    description:
      "validates against the rules in .dependency-cruiser.js and writes it to 'dependendency-violation-report.html' with a friendly layout",
  },
  {
    name: "depcruise:graph",
    headline: "npm run depcruise:graph",
    description:
      "writes a detailed internal graph of your app to 'dependency-graph.html'",
  },
  {
    name: "depcruise:graph:dev",
    headline: "npm run depcruise:graph:dev",
    description:
      "opens a detailed internal graph of your app in your default browser (uses the 'browser' command line program)",
  },
  {
    name: "depcruise:graph:archi",
    headline: "depcruise:graph:archi",
    description:
      "writes a high-level internal graph of your app to 'high-level-dependency-graph.html",
  },
  {
    name: "depcruise:focus",
    headline: "npm run depcruise:focus <regex>",
    description:
      "writes all dependencies to and from modules matching the given <regex> to stdout - in simple text",
  },
  // {
  //   name: "depcruise:text",
  //   headline: "",
  //   description: "",
  // },
];

/**
 *
 * @param {import("../../../types/init-config").IInitConfig} pInitOptions
 * @return {any} an bunch of key value pairs that can be plonked into a `scripts` attribute in a package.json
 */
function compileRunScripts(pInitOptions) {
  let lReturnValue = {};

  if (pInitOptions && (pInitOptions.sourceLocation || []).length > 0) {
    const lSourceLocations = pInitOptions.sourceLocation.join(" ");
    const lSourceLocationRE = folderNameArrayToRE(pInitOptions.sourceLocation);
    const lTestLocations = (pInitOptions.testLocation || []).join(" ");

    lReturnValue = {
      depcruise: `depcruise ${lSourceLocations} ${lTestLocations} --config`,
      "depcruise:graph": `depcruise ${lSourceLocations} --include-only '${lSourceLocationRE}' --config --output-type dot | dot -T svg | depcruise-wrap-stream-in-html > dependency-graph.html`,
      "depcruise:graph:dev": `depcruise ${lSourceLocations} --include-only '${lSourceLocationRE}' --prefix vscode://file/$(pwd)/ --config --output-type dot | dot -T svg | depcruise-wrap-stream-in-html | browser`,
      "depcruise:graph:archi": `depcruise ${lSourceLocations} --include-only '${lSourceLocationRE}' --config --output-type archi | dot -T svg | depcruise-wrap-stream-in-html > high-level-dependency-graph.html`,
      "depcruise:html": `depcruise ${lSourceLocations} ${lTestLocations} --progress --config --output-type err-html --output-to dependency-violation-report.html`,
      "depcruise:text": `depcruise ${lSourceLocations} ${lTestLocations} --progress --config --output-type text`,
      "depcruise:focus": `depcruise ${lSourceLocations} ${lTestLocations} --progress --config --output-type text --focus`,
    };
  }

  return lReturnValue;
}

/**
 * Return the scripts in pAdditionalRunScripts that don't yet exist in
 * pExistingRunScripts
 *
 * @param {any} pAdditionalRunScripts
 * @param {any} pExistingRunScripts
 *
 * @return {any} the scripts in pAdditionalRunScripts that don't yet exist in
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
  const lExplanationIndent = 6;

  return EXPERIMENTAL_SCRIPT_DOC.reduce((pAll, pScript) => {
    return `${pAll}${
      `\n    ${chalk.green(figures.play)} ${pScript.headline}` +
      `\n${wrapAndIndent(`${pScript.description}`, lExplanationIndent)}\n\n`
    }`;
  }, `  ${chalk.green(figures.tick)} Run scripts added to '${pDestinationManifestFileName}':\n`);
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
