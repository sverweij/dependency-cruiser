const chalk = require("chalk");
const { formatTime, formatPerfLine } = require("./format-helpers");

function getHeader(pLevel, pMaxLevel) {
  if (pLevel <= pMaxLevel) {
    return chalk.bold("  elapsed heapTotal  heapUsed after step...\n");
  }
  return "";
}

function getProgressLine(pMessage, pState, pLevel, pMaxLevel) {
  let lReturnValue = "";

  if (pLevel <= pMaxLevel) {
    const lTime = process.uptime();

    lReturnValue = formatPerfLine(
      lTime,
      pState.previousTime,
      pState.previousMessage
    );
    pState.previousMessage = pMessage;
    pState.previousTime = lTime;
  }
  return lReturnValue;
}

function getEndText(pState, pLevel, pMaxLevel) {
  if (pLevel <= pMaxLevel) {
    const lTime = process.uptime();

    return formatPerfLine(
      lTime,
      pState.previousTime,
      `really done (${formatTime(lTime).trim()})`
    );
  }
  return "";
}

module.exports = {
  getHeader,
  getProgressLine,
  getEndText,
};
