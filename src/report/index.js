const anon = require("./anon");
const csv = require("./csv");
const ddot = require("./dot/folderLevel");
const dot = require("./dot/moduleLevel");
const errHtml = require("./err-html");
const errLong = require("./err/err-long");
const err = require("./err/err-short");
const html = require("./html");
const identity = require("./identity");
const json = require("./json");
const teamcity = require("./teamcity");

const TYPE2REPORTER = {
  anon,
  csv,
  dot,
  ddot,
  "err-html": errHtml,
  "err-long": errLong,
  err,
  html,
  json,
  teamcity
};

function getReporter(pOutputType) {
  // eslint-disable-next-line security/detect-object-injection
  return TYPE2REPORTER[pOutputType] || identity;
}

function getAvailableReporters() {
  return Object.keys(TYPE2REPORTER);
}

module.exports = {
  getAvailableReporters,
  getReporter
};
