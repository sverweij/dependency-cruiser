const chalk = require("chalk");
const bus = require("../../../utl/bus");
const { formatTime, formatPerfLine } = require("./format-helpers");

function writeHeader(pStream, pMaxLogLevel) {
  return (_pMessage, pLevel = bus.levels.SUMMARY) => {
    if (pLevel <= pMaxLogLevel) {
      pStream.write(
        chalk.bold("  elapsed heapTotal  heapUsed after step...\n")
      );
    }
  };
}

function writeProgressMessage(pStream, pState, pMaxLogLevel) {
  return (pMessage, pLevel = bus.levels.SUMMARY) => {
    if (pLevel <= pMaxLogLevel) {
      const lTime = process.uptime();

      pStream.write(
        formatPerfLine(lTime, pState.previousTime, pState.previousMessage)
      );
      pState.previousMessage = pMessage;
      pState.previousTime = lTime;
    }
  };
}

function writeEndMessage(pStream, pState, pMaxLogLevel) {
  return (_pMessage, pLevel = bus.levels.SUMMARY) => {
    if (pLevel <= pMaxLogLevel) {
      const lTime = process.uptime();

      pStream.write(
        formatPerfLine(
          lTime,
          pState.previousTime,
          `really done (${formatTime(lTime).trim()})`
        )
      );
      pStream.end();
    }
  };
}

module.exports = function setUpTimeLogListener(
  pMaxLogLevel = bus.levels.INFO,
  pStream = process.stderr
) {
  let lState = {
    previousMessage: "start of node process",
    previousTime: 0,
  };

  bus.on("start", writeHeader(pStream, pMaxLogLevel));

  bus.on("progress", writeProgressMessage(pStream, lState, pMaxLogLevel));

  bus.on("end", writeEndMessage(pStream, lState, pMaxLogLevel));
};

module.exports.writeEndMessage = writeEndMessage;
