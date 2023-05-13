import {
  formatPerfLine,
  formatHeader,
  formatDividerLine,
} from "./format-helpers.mjs";

export function getHeader(pLevel, pMaxLevel) {
  if (pLevel <= pMaxLevel) {
    return formatHeader();
  }
  return "";
}

export function getProgressLine(pMessage, pState, pLevel, pMaxLevel) {
  let lReturnValue = "";

  if (pLevel <= pMaxLevel) {
    const lTime = process.uptime();
    const { user, system } = process.cpuUsage();
    const { rss, heapTotal, heapUsed, external } = process.memoryUsage();
    const lStats = {
      elapsedTime: lTime - pState.previousTime,
      elapsedUser: user - pState.previousUserUsage,
      elapsedSystem: system - pState.previousSystemUsage,
      deltaRss: rss - pState.previousRss,
      deltaHeapUsed: heapUsed - pState.previousHeapUsed,
      deltaHeapTotal: heapTotal - pState.previousHeapTotal,
      deltaExternal: external - pState.previousExternal,
      message: pState.previousMessage,
      level: pState.previousLevel,
    };

    pState.previousMessage = pMessage;
    pState.previousTime = lTime;
    pState.previousUserUsage = user;
    pState.previousSystemUsage = system;
    pState.previousRss = rss;
    pState.previousHeapTotal = heapTotal;
    pState.previousHeapUsed = heapUsed;
    pState.previousExternal = external;
    pState.previousLevel = pLevel;

    lReturnValue = formatPerfLine(lStats);
  }
  return lReturnValue;
}

export function getEndText(pState, pLevel, pMaxLevel) {
  if (pLevel <= pMaxLevel) {
    const lTime = process.uptime();
    const { user, system } = process.cpuUsage();
    const { heapUsed, heapTotal, external, rss } = process.memoryUsage();
    pState.previousMessage = "really done";

    return (
      getProgressLine("", pState, pLevel, pMaxLevel) +
      formatDividerLine() +
      formatPerfLine({
        elapsedTime: lTime,
        elapsedUser: user,
        elapsedSystem: system,
        deltaRss: rss,
        deltaHeapUsed: heapUsed,
        deltaHeapTotal: heapTotal,
        deltaExternal: external,
        message: "",
      })
    );
  }
  return "";
}
