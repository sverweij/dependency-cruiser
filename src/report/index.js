const reportHtml     = require("../report/html");
const reportJson     = require("../report/json");
const reportDot      = require("../report/dot/moduleLevel");
const reportDDot     = require("../report/dot/folderLevel");
const reportCsv      = require("../report/csv");
const reportErr      = require("./err/err-short");
const reportErrLong  = require("./err/err-long");
const reportErrHtml  = require("./err-html");
const reportTeamCity = require("./teamcity");

const TYPE2REPORTER      = {
    "json"     : reportJson,
    "html"     : reportHtml,
    "dot"      : reportDot,
    "ddot"     : reportDDot,
    "csv"      : reportCsv,
    "err"      : reportErr,
    "err-long" : reportErrLong,
    "err-html" : reportErrHtml,
    "teamcity" : reportTeamCity
};

function getReporter(pOutputType) {
    // eslint-disable-next-line security/detect-object-injection
    return TYPE2REPORTER[pOutputType] || ((x) => x);
}

module.exports = {
    getReporter
};
