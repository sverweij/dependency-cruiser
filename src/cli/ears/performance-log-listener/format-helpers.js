const MS_PER_SECOND = 1000;
const DECIMAL_BASE = 10;
const MAX_EXPECTED_LENGTH = 9;
const K = 1024;

function formatTime(pNumber) {
  return Math.round(MS_PER_SECOND * pNumber)
    .toString(DECIMAL_BASE)
    .concat("ms")
    .padStart(MAX_EXPECTED_LENGTH);
}

function formatMemory(pBytes) {
  return Math.round(pBytes / K / K)
    .toString(DECIMAL_BASE)
    .concat("Mb")
    .padStart(MAX_EXPECTED_LENGTH);
}

function formatPerfLine(pTime, pPreviousTime, pMessage) {
  return `${formatTime(pTime - pPreviousTime)} ${formatMemory(
    process.memoryUsage().heapTotal
  )} ${formatMemory(process.memoryUsage().heapUsed)} ${pMessage}\n`;
}

module.exports = {
  formatTime,
  formatMemory,
  formatPerfLine,
};
