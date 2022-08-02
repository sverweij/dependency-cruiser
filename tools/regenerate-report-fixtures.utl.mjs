import { fileURLToPath } from "url";
import fs from "node:fs";
import path from "node:path";
import dot from "../src/report/dot/index.js";
import renderTeamcity from "../src/report/teamcity.js";
import renderHTML from "../src/report/html/index.js";
import renderCSV from "../src/report/csv.js";

const renderCdot = dot("custom");
const renderDdot = dot("folder");
const renderFdot = dot("flat");
const renderDot = dot("module");

const __dirname = fileURLToPath(new URL(".", import.meta.url));

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

function transformMJStoFile(pInputFileName, pOutputFileName, pFunction) {
  import(pInputFileName).then((pModule) => {
    fs.writeFileSync(
      pOutputFileName,
      pFunction(pModule.default).output,
      "utf8"
    );
  });
}

function regenerateReportFixturesFromMJS(
  pDirectory,
  pFunction,
  pTargetExtension
) {
  fs.readdirSync(pDirectory)
    .filter((pFileName) => pFileName.endsWith(".mjs"))
    .map((pFileName) => ({
      inputFileName: path.join(pDirectory, pFileName),
      outputFileName: path.join(
        pDirectory,
        pFileName.replace(/\.mjs$/g, pTargetExtension)
      ),
    }))
    .forEach((pPair) => {
      transformMJStoFile(pPair.inputFileName, pPair.outputFileName, pFunction);
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

const CDOT_MOCK_DIR = path.join(
  __dirname,
  "../test/report/dot/custom-level/__mocks__/"
);
const DDOT_MOCK_DIR = path.join(
  __dirname,
  "../test/report/dot/folder-level/__mocks__/"
);
const FDOT_MOCK_DIR = path.join(
  __dirname,
  "../test/report/dot/flat-level/__mocks__/"
);
const DOT_MOCK_DIR = path.join(
  __dirname,
  "../test/report/dot/module-level/__mocks__/"
);
const TEAMCITY_MOCK_DIR = path.join(
  __dirname,
  "../test/report/teamcity/__mocks__/"
);
const HTML_MOCK_DIR = path.join(__dirname, "../test/report/html/__mocks__/");
const CSV_MOCK_DIR = path.join(__dirname, "../test/report/csv/__mocks__/");

regenerateReportFixtures(DDOT_MOCK_DIR, renderDdot, ".dot");
regenerateReportFixtures(CDOT_MOCK_DIR, renderCdot, ".dot");
regenerateReportFixtures(FDOT_MOCK_DIR, renderFdot, ".dot");
regenerateReportFixtures(DOT_MOCK_DIR, renderBareThemeDot, ".dot");

regenerateReportFixturesFromMJS(
  TEAMCITY_MOCK_DIR,
  renderTeamcity,
  "-teamcity-format.txt"
);
regenerateReportFixtures(HTML_MOCK_DIR, renderHTML, ".html");
regenerateReportFixtures(CSV_MOCK_DIR, renderCSV, ".csv");
