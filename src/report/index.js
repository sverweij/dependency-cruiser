const anon = require("./anon");
const csv = require("./csv");
const dot = require("./dot")("module");
const ddot = require("./dot")("folder");
const cdot = require("./dot")("custom");
const fdot = require("./dot")("flat");
const errorHtml = require("./error-html");
const error = require("./error");
const errorLong = require("./error-long");
const html = require("./html");
const identity = require("./identity");
const json = require("./json");
const teamcity = require("./teamcity");
const text = require("./text");
const baseline = require("./baseline");
const metrics = require("./metrics");
const { getExternalPluginReporter } = require("./plugins");
const markdown = require("./markdown");
const mermaid = require("./mermaid");

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
 * @param {import("../../types/shared-types").OutputType} pOutputType -
 * @returns {function} - a function that takes an ICruiseResult, optionally
 *                       an options object (specific to that function)
 *                       and returns an IReporterOutput
 */
function getReporter(pOutputType) {
  return (
    // eslint-disable-next-line security/detect-object-injection
    TYPE2REPORTER[pOutputType] ||
    getExternalPluginReporter(pOutputType) ||
    identity
  );
}

/**
 * Returns a list of all currently available reporters
 *
 * @returns {import("../../types/shared-types").OutputType[]} -
 */
function getAvailableReporters() {
  return Object.keys(TYPE2REPORTER);
}

module.exports = {
  getAvailableReporters,
  getReporter,
};
