const chalk = require("chalk");
const bus = require("../../utl/bus");

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

module.exports = function setUpTimeLogListener(pStream = process.stderr) {
  let lPreviousMessage = "start of node process";
  let lPreviousTime = 0;

  pStream.write(chalk.bold("  elapsed heapTotal  heapUsed after step...\n"));

  bus.on("progress", (pMessage) => {
    const lTime = process.uptime();

    pStream.write(formatPerfLine(lTime, lPreviousTime, lPreviousMessage));
    lPreviousMessage = pMessage;
    lPreviousTime = lTime;
  });

  bus.on("end", () => {
    const lTime = process.uptime();
    pStream.write(
      formatPerfLine(
        lTime,
        lPreviousTime,
        `really done (${formatTime(lTime).trim()})`
      )
    );
  });
};
