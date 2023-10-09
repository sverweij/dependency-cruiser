import { getHeader, getProgressLine, getEndText } from "./handlers.mjs";
import { INFO, SUMMARY } from "#utl/bus.mjs";

function getHeaderWriter(pStream, pMaxLevel) {
  return (_pMessage, pOptions) => {
    const lOptions = { level: SUMMARY, ...(pOptions || {}) };

    pStream.write(getHeader(lOptions.level, pMaxLevel));
  };
}

function getProgressWriter(pStream, pState, pMaxLevel) {
  return (pMessage, pOptions) => {
    const lOptions = { level: SUMMARY, ...(pOptions || {}) };
    const lProgressLine = getProgressLine(
      pMessage,
      pState,
      lOptions.level,
      pMaxLevel,
    );
    pStream.write(lProgressLine);
  };
}

function getEndWriter(pStream, pState, pMaxLevel) {
  return (_pMessage, pLevel = SUMMARY) => {
    pStream.write(getEndText(pState, pLevel, pMaxLevel));
    pStream.end();
  };
}

export default function setUpPerformanceLogListener(
  pEventEmitter,
  pMaxLevel = INFO,
  pStream = process.stderr,
) {
  let lState = {
    previousMessage: "nodejs starting",
    previousTime: 0,
    previousUserUsage: 0,
    previousSystemUsage: 0,
    previousRss: 0,
    previousHeapTotal: 0,
    previousHeapUsed: 0,
    previousExternal: 0,
  };

  pEventEmitter.on("start", getHeaderWriter(pStream, pMaxLevel));

  pEventEmitter.on("progress", getProgressWriter(pStream, lState, pMaxLevel));

  pEventEmitter.on("end", getEndWriter(pStream, lState, pMaxLevel));
}
