import { EOL } from "node:os";
import { INFO, SUMMARY } from "#utl/bus.mjs";

const MICRO_SECONDS_PER_SECOND = 1000000;

function formatPerfLine({
  runStartTime,
  message,
  time,
  elapsedTime,
  elapsedUser,
  elapsedSystem,
  rss,
  heapUsed,
  heapTotal,
  external,
}) {
  return (
    JSON.stringify({
      runStartTime,
      message,
      time: Math.round(time * MICRO_SECONDS_PER_SECOND),
      elapsedTime: Math.round(elapsedTime * MICRO_SECONDS_PER_SECOND),
      elapsedUser,
      elapsedSystem,
      rss,
      heapUsed,
      heapTotal,
      external,
    }) + EOL
  );
}

function getProgressLine(pMessage, pState, pLevel, pMaxLevel) {
  let lReturnValue = "";

  if (pLevel <= pMaxLevel) {
    const lTime = process.uptime();
    const { user, system } = process.cpuUsage();
    const { rss, heapTotal, heapUsed, external } = process.memoryUsage();
    const lStats = {
      runStartTime: pState.runStartTime,
      message: pState.previousMessage,
      time: lTime,
      elapsedTime: lTime - pState.previousTime,
      elapsedUser: user - pState.previousUserUsage,
      elapsedSystem: system - pState.previousSystemUsage,
      rss,
      heapUsed,
      heapTotal,
      external,
    };

    pState.previousMessage = pMessage;
    pState.previousTime = lTime;
    pState.previousUserUsage = user;
    pState.previousSystemUsage = system;

    lReturnValue = formatPerfLine(lStats);
  }
  return lReturnValue;
}

function getProgressWriter(pStream, pState, pMaxLevel) {
  return (pMessage, pOptions) => {
    const lOptions = { level: SUMMARY, ...(pOptions || {}) };

    pStream.write(getProgressLine(pMessage, pState, lOptions.level, pMaxLevel));
  };
}

export default function setUpNDJSONListener(
  pEventEmitter,
  pMaxLevel = INFO,
  pStream = process.stderr,
) {
  let lState = {
    runStartTime: new Date(Date.now()).toISOString(),
    previousMessage: "nodejs starting",
    previousTime: 0,
    previousUserUsage: 0,
    previousSystemUsage: 0,
  };

  pEventEmitter.on("progress", getProgressWriter(pStream, lState, pMaxLevel));

  pEventEmitter.on("end", () => {
    pStream.end();
  });
}
