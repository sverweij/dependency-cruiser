const fs = require("fs");
const path = require("path");
const renderCdot = require("../src/report/dot")("custom");
const renderDdot = require("../src/report/dot")("folder");
const renderFdot = require("../src/report/dot")("flat");
const renderDot = require("../src/report/dot")("module");
const renderTeamcity = require("../src/report/teamcity");
const renderHTML = require("../src/report/html");
const renderCSV = require("../src/report/csv");

function transformJSONtoFile(pInputFileName, pOutputFileName, pFunction) {
  fs.writeFileSync(
    pOutputFileName,
    pFunction(JSON.parse(fs.readFileSync(pInputFileName, "utf8"))).output,
    "utf8"
  );
}

function regenerateReportFixtures(pDirectory, pFunction, pTargetExtension) {
  fs.readdirSync(pDirectory)
    .filter((pFileName) => pFileName.endsWith(".json"))
    .map((pFileName) => ({
      inputFileName: path.join(pDirectory, pFileName),
      outputFileName: path.join(
        pDirectory,
        pFileName.replace(/\.json$/g, pTargetExtension)
      ),
    }))
    .forEach((pPair) => {
      transformJSONtoFile(pPair.inputFileName, pPair.outputFileName, pFunction);
    });
}

function renderBareThemeDot(pResultObject) {
  const lBareTheme = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "../test/report/dot/module-level/bare-theme.json")
    )
  );
  return renderDot(pResultObject, { theme: lBareTheme });
}

function renderDefaultThemeDot(pResultObject) {
  // empty theme with no overrides gets the default theme assigned
  return renderDot(pResultObject, { theme: {} });
}

const CDOT_MOCK_DIR = path.join(
  __dirname,
  "../test/report/dot/custom-level/mocks/"
);
const DDOT_MOCK_DIR = path.join(
  __dirname,
  "../test/report/dot/folder-level/mocks/"
);
const FDOT_MOCK_DIR = path.join(
  __dirname,
  "../test/report/dot/flat-level/mocks/"
);
const DOT_MOCK_DIR = path.join(
  __dirname,
  "../test/report/dot/module-level/mocks/"
);
const TEAMCITY_MOCK_DIR = path.join(
  __dirname,
  "../test/report/teamcity/mocks/"
);
const HTML_MOCK_DIR = path.join(__dirname, "../test/report/html/mocks/");
const CSV_MOCK_DIR = path.join(__dirname, "../test/report/csv/mocks/");

regenerateReportFixtures(DDOT_MOCK_DIR, renderDdot, ".dot");
regenerateReportFixtures(CDOT_MOCK_DIR, renderCdot, ".dot");
regenerateReportFixtures(FDOT_MOCK_DIR, renderFdot, ".dot");
regenerateReportFixtures(DOT_MOCK_DIR, renderBareThemeDot, ".dot");
regenerateReportFixtures(
  DOT_MOCK_DIR,
  renderDefaultThemeDot,
  "-default-theme.dot"
);
regenerateReportFixtures(
  TEAMCITY_MOCK_DIR,
  renderTeamcity,
  "-teamcity-format.txt"
);
regenerateReportFixtures(HTML_MOCK_DIR, renderHTML, ".html");
regenerateReportFixtures(CSV_MOCK_DIR, renderCSV, ".csv");
