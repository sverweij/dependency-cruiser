import { randomInt } from "node:crypto";
import { EOL } from "node:os";
import { INFO, SUMMARY } from "#utl/bus.mjs";

const MICRO_SECONDS_PER_SECOND = 1_000_000;
// 2 ** 47;
const MIN_RUN_ID = 140_737_488_355_328;
// Max safe int (2 ** 48), - 1. Note: != Number.MAX_SAFE_INTEGER, which is too big for crypto.randomInt
const MAX_RUN_ID = 281_474_976_710_655;

function formatPerfLine({
  runStartTime,
  runId,
  message,
  time,
  elapsedTime,
  user,
  elapsedUser,
  system,
  elapsedSystem,
  rss,
  heapUsed,
  heapTotal,
  external,
}) {
  return (
    JSON.stringify({
      runStartTime,
      runId,
      message,
      time: Math.round(time * MICRO_SECONDS_PER_SECOND),
      elapsedTime: Math.round(elapsedTime * MICRO_SECONDS_PER_SECOND),
      user,
      elapsedUser,
      system,
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
      runId: pState.runId,
      message: pState.previousMessage,
      time: lTime,
      elapsedTime: lTime - pState.previousTime,
      user,
      elapsedUser: user - pState.previousUserUsage,
      system,
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
    runId: randomInt(MIN_RUN_ID, MAX_RUN_ID),
    previousMessage: "startup: nodejs loading",
    previousTime: 0,
    previousUserUsage: 0,
    previousSystemUsage: 0,
  };

  pEventEmitter.on("progress", getProgressWriter(pStream, lState, pMaxLevel));

  pEventEmitter.on("end", () => {
    pStream.end();
  });
}
