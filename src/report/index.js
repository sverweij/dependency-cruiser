const curryRight = require("lodash/curryRight");
const anon = require("./anon");
const csv = require("./csv");
const dot = require("./dot")("module");
const ddot = require("./dot")("folder");
const cdot = require("./dot")("custom");
const errorHtml = require("./error-html");
const errorLong = curryRight(require("./error"))({ long: true });
const error = require("./error");
const html = require("./html");
const identity = require("./identity");
const json = require("./json");
const teamcity = require("./teamcity");
const text = require("./text");

const TYPE2REPORTER = {
  anon,
  csv,
  dot,
  ddot,
  cdot,
  archi: cdot,
  "err-html": errorHtml,
  "err-long": errorLong,
  err: error,
  html,
  json,
  teamcity,
  text,
};

/**
 * Returns the reporter function associated with given output type,
 * or the identity reporter if that output type wasn't found
 *
 * @param {OutputType} pOutputType -
 * @returns {function} - a function that takes an ICruiseResult, optionally
 *                       an options object (specific to that function)
 *                       and returns an IReporterOutput
 */
function getReporter(pOutputType) {
  // eslint-disable-next-line security/detect-object-injection
  return TYPE2REPORTER[pOutputType] || identity;
}

/**
 * Returns a list of all currently available reporters
 *
 * @returns {OutputType[]} -
 */
function getAvailableReporters() {
  return Object.keys(TYPE2REPORTER);
}

module.exports = {
  getAvailableReporters,
  getReporter,
};
