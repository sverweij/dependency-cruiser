import chalk from "chalk";

const MS_PER_SECOND = 1000;
const MS_PER_MICRO_SECOND = 0.001;
const MAX_EXPECTED_LENGTH = 13;
const NUMBER_OF_COLUMNS = 8;
const K = 1024;
/*
 * using `undefined` as the first parameter to Intl.NumberFormat so
 * it will fall back to the 'current' locale. Using a non-existent language
 * (e.g. `zz`) also works, but `undefined`  seems to be the lesser of the two
 * evil as it is closer to the intent (skip the optional parameter).
 */
// eslint-disable-next-line no-undefined
const LOCALE = undefined;

const gTimeFormat = new Intl.NumberFormat(LOCALE, {
  style: "unit",
  unit: "millisecond",
  unitDisplay: "narrow",
  maximumFractionDigits: 0,
}).format;
const gSizeFormat = new Intl.NumberFormat(LOCALE, {
  signDisplay: "exceptZero",
  style: "unit",
  unit: "kilobyte",
  unitDisplay: "narrow",
  maximumFractionDigits: 0,
}).format;

const pad = (pString) => pString.padStart(MAX_EXPECTED_LENGTH).concat(" ");

export function formatDividerLine() {
  return `${`${"-".repeat(MAX_EXPECTED_LENGTH)} `.repeat(NUMBER_OF_COLUMNS)}\n`;
}

export function formatHeader() {
  return chalk
    .bold(
      `${
        pad("∆ rss") +
        pad("∆ heapTotal") +
        pad("∆ heapUsed") +
        pad("∆ external") +
        pad("⏱ system") +
        pad("⏱ user") +
        pad("⏱ real")
      }after step...\n`
    )
    .concat(formatDividerLine());
}

export function formatTime(pNumber, pConversionMultiplier = MS_PER_SECOND) {
  return gTimeFormat(pConversionMultiplier * pNumber)
    .padStart(MAX_EXPECTED_LENGTH)
    .concat(" ");
}

export function formatMemory(pBytes) {
  const lReturnValue = gSizeFormat(pBytes / K).padStart(MAX_EXPECTED_LENGTH);

  return (pBytes < 0 ? chalk.blue(lReturnValue) : lReturnValue).concat(" ");
}

export function formatPerfLine({
  elapsedTime,
  elapsedUser,
  elapsedSystem,
  deltaRss,
  deltaHeapUsed,
  deltaHeapTotal,
  deltaExternal,
  message,
}) {
  return `${
    formatMemory(deltaRss) +
    formatMemory(deltaHeapTotal) +
    formatMemory(deltaHeapUsed) +
    formatMemory(deltaExternal) +
    formatTime(elapsedSystem, MS_PER_MICRO_SECOND) +
    formatTime(elapsedUser, MS_PER_MICRO_SECOND) +
    formatTime(elapsedTime) +
    message
  }\n`;
}
