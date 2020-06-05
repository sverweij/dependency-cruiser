const inquirer = require("inquirer");
const $defaults = require("../defaults.json");
const {
  fileExists,
  getFirstExistingFileName,
  getSourceFolderCandidates,
  getTestFolderCandidates,
  getMonoRepoPackagesCandidates,
  hasTestsWithinSource,
  isLikelyMonoRepo,
  pnpIsEnabled,
  toSourceLocationArray,
} = require("./environment-helpers");
const {
  validateFileExistence,
  validateLocation,
} = require("./inquirer-validators");

const TYPESCRIPT_CONFIG = `./${$defaults.TYPESCRIPT_CONFIG}`;
const WEBPACK_CONFIG = `./${$defaults.WEBPACK_CONFIG}`;
const BABEL_CONFIG_NAME_SEARCH_ARRAY = $defaults.BABEL_CONFIG_NAME_SEARCH_ARRAY;

const INQUIRER_QUESTIONS = [
  {
    name: "isMonoRepo",
    type: "confirm",
    message: "This looks like a mono repo. Is that correct?",
    default: isLikelyMonoRepo(),
    when: () => isLikelyMonoRepo(),
  },
  {
    name: "sourceLocation",
    type: "input",
    message: "Mono repo it is! Where do your packages live?",
    default: getMonoRepoPackagesCandidates(),
    validate: validateLocation,
    when: (pAnswers) => pAnswers.isMonoRepo,
  },
  {
    name: "sourceLocation",
    type: "input",
    message: "Where do your source files live?",
    default: getSourceFolderCandidates(),
    validate: validateLocation,
    when: (pAnswers) => !pAnswers.isMonoRepo,
  },
  {
    name: "hasTestsOutsideSource",
    type: "confirm",
    message: "Do your test files live in a separate folder?",
    default: (pAnswers) => {
      return !hasTestsWithinSource(
        getTestFolderCandidates(),
        toSourceLocationArray(pAnswers.sourceLocation)
      );
    },
    when: (pAnswers) => !pAnswers.isMonoRepo,
  },
  {
    name: "testLocation",
    type: "input",
    message: "Where do your test files live?",
    default: getTestFolderCandidates(),
    validate: validateLocation,
    when: (pAnswers) => pAnswers.hasTestsOutsideSource && !pAnswers.isMonoRepo,
  },

  {
    name: "useYarnPnP",
    type: "confirm",
    message: "You seem to be using yarn Plug'n'Play. Take that into account?",
    default: true,
    when: () => pnpIsEnabled(),
  },
  {
    name: "useTsConfig",
    type: "confirm",
    message: "Looks like you're using TypeScript. Use a 'tsconfig.json'?",
    default: true,
    when: () => fileExists(TYPESCRIPT_CONFIG),
  },
  {
    name: "tsConfig",
    type: "input",
    message: "Full path to your 'tsconfig.json':",
    default: TYPESCRIPT_CONFIG,
    validate: validateFileExistence,
    when: (pAnswers) => pAnswers.useTsConfig,
  },
  {
    name: "tsPreCompilationDeps",
    type: "confirm",
    message:
      "Also regard TypeScript dependencies that exist only before compilation?",
    when: (pAnswers) => fileExists(TYPESCRIPT_CONFIG) && pAnswers.useTsConfig,
  },
  {
    name: "useBabelConfig",
    type: "confirm",
    message: "Looks like you're using Babel. Use a babel config?",
    default: true,
    when: () => getFirstExistingFileName(BABEL_CONFIG_NAME_SEARCH_ARRAY),
  },
  {
    name: "babelConfig",
    type: "input",
    message: "Full path to your babel config:",
    default: getFirstExistingFileName(BABEL_CONFIG_NAME_SEARCH_ARRAY),
    validate: validateFileExistence,
    when: (pAnswers) => pAnswers.useBabelConfig,
  },
  {
    name: "useWebpackConfig",
    type: "confirm",
    message: "Looks like you're using webpack - specify a webpack config?",
    default: true,
    when: () => fileExists(WEBPACK_CONFIG),
  },
  {
    name: "webpackConfig",
    type: "input",
    message: "Full path to your webpack config:",
    default: WEBPACK_CONFIG,
    validate: validateFileExistence,
    when: (pAnswers) => pAnswers.useWebpackConfig,
  },
];

module.exports = () => inquirer.prompt(INQUIRER_QUESTIONS);
