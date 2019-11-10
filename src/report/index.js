const csv = require("../report/csv");
const html = require("../report/html");
const ddot = require("../report/dot/folderLevel");
const dot = require("../report/dot/moduleLevel");
const json = require("../report/json");
const errLong = require("./err/err-long");
const err = require("./err/err-short");
const errHtml = require("./err-html");
const identity = require("./identity");
const teamcity = require("./teamcity");
const anon = require("./anonymous");

const TYPE2REPORTER = {
  json,
  html,
  dot,
  ddot,
  csv,
  err,
  "err-long": errLong,
  "err-html": errHtml,
  teamcity,
  anon
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
