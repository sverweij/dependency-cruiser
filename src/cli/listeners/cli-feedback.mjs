import chalk from "chalk";
import { SUMMARY } from "#utl/bus.mjs";

const FULL_ON = 100;

function normalizeParameters(pParameters) {
  return {
    barSize: 10,
    block: "■",
    blank: "□",
    ...(pParameters || {}),
  };
}
function getPercentageBar(pPercentage, pParameters) {
  const lParameters = normalizeParameters(pParameters);
  const lPercentage = Math.min(pPercentage || 0, 1);
  const lBlocks = Math.floor(lParameters.barSize * lPercentage);
  const lBlanks = lParameters.barSize - lBlocks;

  return `${chalk.green(lParameters.block.repeat(lBlocks))}${chalk.green(
    lParameters.blank.repeat(lBlanks),
  )} ${Math.round(FULL_ON * lPercentage)}%`;
}

function getProgressMessageWriter(pStream, pState, pMaxLogLevel) {
  return (pMessage, pOptions) => {
    const lOptions = {
      level: SUMMARY,
      complete: pState.complete,
      ...(pOptions || {}),
    };

    pState.complete = lOptions.complete;

    if (pStream.isTTY && lOptions.level <= pMaxLogLevel) {
      pStream.clearLine(1);
      pStream.write(
        `  ${getPercentageBar(lOptions.complete)} ${pMessage} ...\n`,
      );
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

export default function setUpCliFeedbackListener(
  pEventEmitter,
  pMaxLogLevel = SUMMARY,
  pStream = process.stderr,
) {
  const lState = {
    complete: 0,
  };
  pEventEmitter.on(
    "progress",
    getProgressMessageWriter(pStream, lState, pMaxLogLevel),
  );

  pEventEmitter.on("write-start", getStartWriter(pStream));

  pEventEmitter.on("end", () => pStream.end());
}
