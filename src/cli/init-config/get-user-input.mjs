// @ts-check
import prompts from "prompts";
import {
  isLikelyMonoRepo,
  isTypeModule,
  getMonoRepoPackagesCandidates,
  getSourceFolderCandidates,
  getTestFolderCandidates,
  hasJSConfigCandidates,
  hasTSConfigCandidates,
  hasTestsWithinSource,
  toSourceLocationArray,
  getJSConfigCandidates,
  getTSConfigCandidates,
  hasBabelConfigCandidates,
  getBabelConfigCandidates,
  hasWebpackConfigCandidates,
  getWebpackConfigCandidates,
} from "./environment-helpers.mjs";
import { validateLocation } from "./validators.mjs";

function toPromptChoice(pString) {
  return {
    title: pString,
    value: pString,
  };
}

/** @type {import('prompts').PromptObject[]} */
const QUESTIONS = [
  {
    name: "isMonoRepo",
    type: () => (isLikelyMonoRepo() ? "confirm" : false),
    message: "This looks like mono repo. Is that correct?",
    initial: isLikelyMonoRepo(),
  },
  {
    name: "isTypeModule",
    type: () => (isTypeModule() ? "confirm" : false),
    message: "It looks like this is an ESM package. Is that correct?",
    initial: isTypeModule(),
  },
  {
    name: "sourceLocation",
    type: (_, pAnswers) => (pAnswers.isMonoRepo ? "list" : false),
    message: "Mono repo it is! Where do your packages live?",
    initial: getMonoRepoPackagesCandidates().join(", "),
    validate: validateLocation,
  },
  {
    name: "combinedDependencies",
    type: (_, pAnswers) => (pAnswers.isMonoRepo ? "confirm" : false),
    message:
      "Do your packages use dependencies declared in the root of your repo?",
    initial: false,
  },
  {
    name: "sourceLocation",
    type: (_, pAnswers) => (pAnswers.isMonoRepo ? false : "list"),
    message: "Where do your source files live?",
    initial: getSourceFolderCandidates().join(", "),
    validate: validateLocation,
  },
  {
    name: "hasTestsOutsideSource",
    type: (_, pAnswers) => (pAnswers.isMonoRepo ? false : "confirm"),
    message: "Do your test files live in a separate folder?",
    initial: (_, pAnswers) => {
      return !hasTestsWithinSource(
        getTestFolderCandidates(),
        toSourceLocationArray(pAnswers.sourceLocation),
      );
    },
  },
  {
    name: "testLocation",
    type: (_, pAnswers) =>
      pAnswers.hasTestsOutsideSource && !pAnswers.isMonoRepo ? "list" : false,
    message: "Where do your test files live?",
    initial: getTestFolderCandidates().join(", "),
    validate: validateLocation,
  },
  {
    name: "useJsConfig",
    type: () =>
      hasJSConfigCandidates() && !hasTSConfigCandidates() ? "confirm" : false,
    message: "Looks like you're using a 'jsconfig.json'. Use that?",
    initial: true,
  },
  {
    name: "jsConfig",
    type: (_, pAnswers) => (pAnswers.useJsConfig ? "select" : false),
    message: "Full path to your 'jsconfig.json",
    choices: getJSConfigCandidates().map((pCandidate) => ({
      title: pCandidate,
      value: pCandidate,
    })),
  },
  {
    name: "useTsConfig",
    type: () => (hasTSConfigCandidates() ? "confirm" : false),
    message: "Looks like you're using a 'tsconfig.json'. Use that?",
    initial: true,
  },
  {
    name: "tsConfig",
    type: (_, pAnswers) => (pAnswers.useTsConfig ? "select" : false),
    message: "Full path to your 'tsconfig.json",
    choices: getTSConfigCandidates().map(toPromptChoice),
  },
  {
    name: "tsPreCompilationDeps",
    type: (_, pAnswers) => (pAnswers.useTsConfig ? "confirm" : false),
    message:
      "Also regard TypeScript dependencies that exist only before compilation?",
    initial: true,
  },
  {
    name: "useBabelConfig",
    type: () => (hasBabelConfigCandidates() ? "confirm" : false),
    message: "Looks like you're using Babel. Use a babel config?",
    initial: true,
  },
  {
    name: "babelConfig",
    type: (_, pAnswers) => (pAnswers.useBabelConfig ? "select" : false),
    message: "Full path to your babel config:",
    choices: getBabelConfigCandidates().map(toPromptChoice),
  },
  {
    name: "useWebPackConfig",
    type: () => (hasWebpackConfigCandidates() ? "confirm" : false),
    message: "Looks like you're using webpack - specify a webpack config?",
    initial: true,
  },
  {
    name: "webpackConfig",
    type: (_, pAnswers) => (pAnswers.useWebpackConfig ? "select" : false),
    message: "Full path to your webpack config:",
    choices: getWebpackConfigCandidates().map(toPromptChoice),
  },
];

/**
 * @return {Promise<import("./types").IPartialInitConfig>}
 */
export default function getUserInput() {
  return prompts(QUESTIONS);
}
