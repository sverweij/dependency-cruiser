import { fileURLToPath } from "node:url";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import dot from "../src/report/dot/index.mjs";
import renderTeamcity from "../src/report/teamcity.mjs";
import renderHTML from "../src/report/html/index.mjs";
import renderCSV from "../src/report/csv.mjs";

const renderCdot = dot("custom");
const renderDdot = dot("folder");
const renderFdot = dot("flat");
const renderDot = dot("module");

const __dirname = fileURLToPath(new URL(".", import.meta.url));

function transformJSONtoFile(pInputFileName, pOutputFileName, pFunction) {
  writeFileSync(
    pOutputFileName,
    pFunction(JSON.parse(readFileSync(pInputFileName, "utf8"))).output,
    "utf8"
  );
}

function regenerateReportFixtures(
  pDirectory,
  pFunction,
  pTargetExtension,
  pRelativeTargetDirectory = "../__fixtures__"
) {
  readdirSync(pDirectory)
    .filter((pFileName) => pFileName.endsWith(".json"))
    .map((pFileName) => ({
      inputFileName: join(pDirectory, pFileName),
      outputFileName: join(
        join(pDirectory, pRelativeTargetDirectory),
        pFileName.replace(/\.json$/g, pTargetExtension)
      ),
    }))
    .forEach((pPair) => {
      transformJSONtoFile(pPair.inputFileName, pPair.outputFileName, pFunction);
    });
}

function transformMJStoFile(pInputFileName, pOutputFileName, pFunction) {
  import(pInputFileName).then((pModule) => {
    writeFileSync(pOutputFileName, pFunction(pModule.default).output, "utf8");
  });
}

function regenerateReportFixturesFromMJS(
  pDirectory,
  pFunction,
  pTargetExtension,
  pRelativeTargetDirectory = "../__fixtures__"
) {
  readdirSync(pDirectory)
    .filter((pFileName) => pFileName.endsWith(".mjs"))
    .map((pFileName) => ({
      inputFileName: join(pDirectory, pFileName),
      outputFileName: join(
        join(pDirectory, pRelativeTargetDirectory),
        pFileName.replace(/\.mjs$/g, pTargetExtension)
      ),
    }))
    .forEach((pPair) => {
      transformMJStoFile(pPair.inputFileName, pPair.outputFileName, pFunction);
    });
}

function renderBareThemeDot(pResultObject) {
  const lBareTheme = JSON.parse(
    readFileSync(
      join(__dirname, "../test/report/dot/module-level/bare-theme.json")
    )
  );
  return renderDot(pResultObject, { theme: lBareTheme });
}

const CDOT_MOCK_DIR = join(
  __dirname,
  "../test/report/dot/custom-level/__mocks__/"
);
const DDOT_MOCK_DIR = join(
  __dirname,
  "../test/report/dot/folder-level/__mocks__/"
);
const FDOT_MOCK_DIR = join(
  __dirname,
  "../test/report/dot/flat-level/__mocks__/"
);
const DOT_MOCK_DIR = join(
  __dirname,
  "../test/report/dot/module-level/__mocks__/"
);
const TEAMCITY_MOCK_DIR = join(__dirname, "../test/report/teamcity/__mocks__/");
const HTML_MOCK_DIR = join(__dirname, "../test/report/html/__mocks__/");
const CSV_MOCK_DIR = join(__dirname, "../test/report/csv/__mocks__/");

regenerateReportFixtures(DDOT_MOCK_DIR, renderDdot, ".dot");
regenerateReportFixtures(CDOT_MOCK_DIR, renderCdot, ".dot");
regenerateReportFixtures(FDOT_MOCK_DIR, renderFdot, ".dot");
regenerateReportFixtures(DOT_MOCK_DIR, renderBareThemeDot, ".dot");

regenerateReportFixturesFromMJS(
  TEAMCITY_MOCK_DIR,
  renderTeamcity,
  "-teamcity-format.txt",
  "."
);
regenerateReportFixtures(HTML_MOCK_DIR, renderHTML, ".html", ".");
regenerateReportFixtures(CSV_MOCK_DIR, renderCSV, ".csv", ".");
