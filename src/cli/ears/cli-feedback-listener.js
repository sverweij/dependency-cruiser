const chalk = require("chalk");
const figures = require("figures");
const bus = require("../../utl/bus");

module.exports = function setUpCliFeedbackListener(
  pMaxLogLevel = bus.levels.SUMMARY,
  pStream = process.stderr
) {
  bus.on("progress", (pMessage, pLevel = bus.levels.SUMMARY) => {
    if (pLevel <= pMaxLogLevel) {
      pStream.clearLine(1);
      pStream.write(`  ${chalk.greenBright(figures.play)} ${pMessage} ...\n`);
      pStream.moveCursor(0, -1);
    }
  });

  bus.on("write-start", () => {
    // before writing the real business output make a decent attempt
    // to clear the 'log' output so the cli behaviour looks more clean.
    pStream.moveCursor(0, 0);
    pStream.clearLine(1);
  });

  bus.on("end", () => {
    pStream.end();
  });
};
