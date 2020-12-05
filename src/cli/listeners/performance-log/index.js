const busLogLevels = require("../../../utl/bus-log-levels");
const { getHeader, getProgressLine, getEndText } = require("./handlers");

function getHeaderWriter(pStream, pMaxLevel) {
  return (_pMessage, pOptions) => {
    const lOptions = { level: busLogLevels.SUMMARY, ...(pOptions || {}) };

    pStream.write(getHeader(lOptions.level, pMaxLevel));
  };
}

function getProgressWriter(pStream, pState, pMaxLevel) {
  return (pMessage, pOptions) => {
    const lOptions = { level: busLogLevels.SUMMARY, ...(pOptions || {}) };

    pStream.write(getProgressLine(pMessage, pState, lOptions.level, pMaxLevel));
  };
}

function getEndWriter(pStream, pState, pMaxLevel) {
  return (_pMessage, pLevel = busLogLevels.SUMMARY) => {
    pStream.write(getEndText(pState, pLevel, pMaxLevel));
    pStream.end();
  };
}

module.exports = function setUpPerformanceLogListener(
  pEventEmitter,
  pMaxLevel = busLogLevels.INFO,
  pStream = process.stderr
) {
  let lState = {
    previousMessage: "start of node process",
    previousTime: 0,
  };

  pEventEmitter.on("start", getHeaderWriter(pStream, pMaxLevel));

  pEventEmitter.on("progress", getProgressWriter(pStream, lState, pMaxLevel));

  pEventEmitter.on("end", getEndWriter(pStream, lState, pMaxLevel));
};
