import chalk from "chalk";
import { INFO } from "#utl/bus.mjs";

const MS_PER_SECOND = 1000;
const MS_PER_MICRO_SECOND = 0.001;
const MAX_EXPECTED_METRIC_LENGTH = 13;
const MAX_EXPECTED_MESSAGE_LENGTH = 42;
const NUMBER_OF_COLUMNS = 8;
const K = 1024;
/*
 * using `undefined` as the first parameter to Intl.NumberFormat so
 * it will fall back to the 'current' locale. Using a non-existent language
 * (e.g. `zz`) also works, but `undefined` seems to be the lesser of the two
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

const pad = (pString) =>
  pString.padStart(MAX_EXPECTED_METRIC_LENGTH).concat(" ");

export function formatDividerLine() {
  const lNumberColumnDivider = "-".repeat(MAX_EXPECTED_METRIC_LENGTH);
  const lMessageColumnHDivider = "-".repeat(MAX_EXPECTED_MESSAGE_LENGTH);

  return `${`${lNumberColumnDivider} `.repeat(
    NUMBER_OF_COLUMNS - 1,
  )}${lMessageColumnHDivider}\n`;
}

export function formatHeader() {
  return chalk
    .bold(
      `${
        pad("∆ rss") +
        pad("∆ heapTotal") +
        pad("∆ heapUsed") +
        pad("∆ external") +
        pad("⏱  system") +
        pad("⏱  user") +
        pad("⏱  real")
      }after step...\n`,
    )
    .concat(formatDividerLine());
}

function formatMessage(pMessage, pLevel) {
  return pLevel >= INFO ? chalk.dim(pMessage) : pMessage;
}

export function formatTime(
  pNumber,
  pConversionMultiplier = MS_PER_SECOND,
  pLevel,
) {
  return formatMessage(
    gTimeFormat(pConversionMultiplier * pNumber)
      .padStart(MAX_EXPECTED_METRIC_LENGTH)
      .concat(" "),
    pLevel,
  );
}

export function formatMemory(pBytes, pLevel) {
  const lReturnValue = gSizeFormat(pBytes / K).padStart(
    MAX_EXPECTED_METRIC_LENGTH,
  );

  return formatMessage(
    (pBytes < 0 ? chalk.blue(lReturnValue) : lReturnValue).concat(" "),
    pLevel,
  );
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
  level,
}) {
  return `${
    formatMemory(deltaRss, level) +
    formatMemory(deltaHeapTotal, level) +
    formatMemory(deltaHeapUsed, level) +
    formatMemory(deltaExternal, level) +
    formatTime(elapsedSystem, MS_PER_MICRO_SECOND, level) +
    formatTime(elapsedUser, MS_PER_MICRO_SECOND, level) +
    formatTime(elapsedTime, MS_PER_SECOND, level) +
    formatMessage(message, level)
  }\n`;
}
