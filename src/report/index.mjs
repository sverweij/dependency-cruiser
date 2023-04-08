import anon from "./anon/index.mjs";
import csv from "./csv.mjs";
import dotBase from "./dot/index.mjs";
import errorHtml from "./error-html/index.mjs";
import error from "./error.mjs";
import errorLong from "./error-long.mjs";
import html from "./html/index.mjs";
import identity from "./identity.mjs";
import json from "./json.mjs";
import teamcity from "./teamcity.mjs";
import text from "./text.mjs";
import baseline from "./baseline.mjs";
import metrics from "./metrics.mjs";
import { getExternalPluginReporter } from "./plugins.mjs";
import markdown from "./markdown.mjs";
import mermaid from "./mermaid.mjs";

const dot = dotBase("module");
const ddot = dotBase("folder");
const cdot = dotBase("custom");
const fdot = dotBase("flat");

const TYPE2REPORTER = {
  anon,
  csv,
  dot,
  ddot,
  cdot,
  archi: cdot,
  fdot,
  flat: fdot,
  "err-html": errorHtml,
  markdown,
  "err-long": errorLong,
  err: error,
  html,
  json,
  teamcity,
  text,
  baseline,
  metrics,
  mermaid,
};

/**
 * Returns the reporter function associated with given output type,
 * or the identity reporter if that output type wasn't found
 *
 * @param {import("../../types/shared-types.js").OutputType} pOutputType -
 * @returns {function} - a function that takes an ICruiseResult, optionally
 *                       an options object (specific to that function)
 *                       and returns an IReporterOutput
 */
async function getReporter(pOutputType) {
  return (
    // eslint-disable-next-line security/detect-object-injection
    TYPE2REPORTER[pOutputType] ||
    (await getExternalPluginReporter(pOutputType)) ||
    identity
  );
}

/**
 * Returns a list of all currently available reporters
 *
 * @returns {import("../../types/shared-types.js").OutputType[]} -
 */
function getAvailableReporters() {
  return Object.keys(TYPE2REPORTER);
}

export default {
  getAvailableReporters,
  getReporter,
};
