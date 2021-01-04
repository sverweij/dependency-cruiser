const inquirer = require("inquirer");
const {
  getSourceFolderCandidates,
  getTestFolderCandidates,
  hasBabelConfigCandidates,
  getBabelConfigCandidates,
  hasTSConfigCandidates,
  getTSConfigCandidates,
  hasWebpackConfigCandidates,
  getWebpackConfigCandidates,
  getMonoRepoPackagesCandidates,
  hasTestsWithinSource,
  isLikelyMonoRepo,
  toSourceLocationArray,
} = require("./environment-helpers");
const { validateLocation } = require("./inquirer-validators");

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
    name: "combinedDependencies",
    type: "confirm",
    message:
      "Do your packages use dependencies declared in the root of your repo?",
    default: false,
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
    name: "useTsConfig",
    type: "confirm",
    message: "Looks like you're using TypeScript. Use a 'tsconfig.json'?",
    default: true,
    when: () => hasTSConfigCandidates(),
  },
  {
    name: "tsConfig",
    type: "list",
    message: "Full path to your 'tsconfig.json':",
    choices: getTSConfigCandidates(),
    when: (pAnswers) => pAnswers.useTsConfig,
  },
  {
    name: "tsPreCompilationDeps",
    type: "confirm",
    message:
      "Also regard TypeScript dependencies that exist only before compilation?",
    when: (pAnswers) => pAnswers.useTsConfig,
  },
  {
    name: "useBabelConfig",
    type: "confirm",
    message: "Looks like you're using Babel. Use a babel config?",
    default: true,
    when: () => hasBabelConfigCandidates(),
  },
  {
    name: "babelConfig",
    type: "list",
    message: "Full path to your babel config:",
    choices: getBabelConfigCandidates(),
    when: (pAnswers) => pAnswers.useBabelConfig,
  },
  {
    name: "useWebpackConfig",
    type: "confirm",
    message: "Looks like you're using webpack - specify a webpack config?",
    default: true,
    when: () => hasWebpackConfigCandidates(),
  },
  {
    name: "webpackConfig",
    type: "list",
    message: "Full path to your webpack config:",
    choices: getWebpackConfigCandidates(),
    when: (pAnswers) => pAnswers.useWebpackConfig,
  },
];
/**
 * @return {Promise<import("../../../types/init-config").IPartialInitConfig>}
 */
module.exports = function getUserInput() {
  return inquirer.prompt(INQUIRER_QUESTIONS);
};
