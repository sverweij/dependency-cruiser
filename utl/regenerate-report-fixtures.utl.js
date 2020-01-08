const fs = require("fs");
const path = require("path");
const renderDdot = require("../src/report/dot")("folder");
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

function regenerateReportFixtures(pDir, pFunction, pTargetExtension) {
  fs.readdirSync(pDir)
    .filter(pFileName => pFileName.endsWith(".json"))
    .map(pFileName => ({
      inputFileName: path.join(pDir, pFileName),
      outputFileName: path.join(
        pDir,
        pFileName.replace(/\.json$/g, pTargetExtension)
      )
    }))
    .forEach(pPair => {
      transformJSONtoFile(pPair.inputFileName, pPair.outputFileName, pFunction);
    });
}

function renderBareThemeDot(pResultObject) {
  const lBareTheme = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "../test/report/dot/moduleLevel/bareTheme.json")
    )
  );

  return renderDot(pResultObject, lBareTheme);
}

function renderDefaultThemeDot(pResultObject) {
  // empty theme with no overrides gets the default theme assigned
  return renderDot(pResultObject, {});
}

const DDOT_MOCK_DIR = path.join(
  __dirname,
  "../test/report/dot/folderLevel/mocks/"
);
const DOT_MOCK_DIR = path.join(
  __dirname,
  "../test/report/dot/moduleLevel/mocks/"
);
const TEAMCITY_MOCK_DIR = path.join(
  __dirname,
  "../test/report/teamcity/mocks/"
);
const HTML_MOCK_DIR = path.join(__dirname, "../test/report/html/mocks/");
const CSV_MOCK_DIR = path.join(__dirname, "../test/report/csv/mocks/");

regenerateReportFixtures(DDOT_MOCK_DIR, renderDdot, ".dot");
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
