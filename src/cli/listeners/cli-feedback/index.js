const chalk = require("chalk");
const figures = require("figures");
const busLogLevels = require("../../../utl/bus-log-levels");

function getProgressMessageWriter(pStream, pMaxLogLevel) {
  return (pMessage, pLevel = busLogLevels.SUMMARY) => {
    if (pStream.isTTY && pLevel <= pMaxLogLevel) {
      pStream.clearLine(1);
      pStream.write(`  ${chalk.greenBright(figures.play)} ${pMessage} ...\n`);
      pStream.moveCursor(0, -1);
    }
  };
}

function getStartWriter(pStream) {
  return () => {
    // before writing the real business output make a decent attempt
    // to clear the 'log' output so the cli behaviour looks more clean.
    if (pStream.isTTY) {
      pStream.moveCursor(0, 0);
      pStream.clearLine(1);
    }
  };
}

module.exports = function setUpCliFeedbackListener(
  pEventEmitter,
  pMaxLogLevel = busLogLevels.SUMMARY,
  pStream = process.stderr
) {
  pEventEmitter.on("progress", getProgressMessageWriter(pStream, pMaxLogLevel));

  pEventEmitter.on("write-start", getStartWriter(pStream));

  pEventEmitter.on("end", () => pStream.end());
};
