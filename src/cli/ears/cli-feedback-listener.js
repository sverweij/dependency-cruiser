const chalk = require("chalk");
const figures = require("figures");
const bus = require("../../main/bus");

module.exports = function setUpCliFeedbackListener() {
  const lStream = process.stderr;

  bus.on("progress", (pMessage) => {
    lStream.clearLine(1);
    lStream.write(`  ${chalk.greenBright(figures.play)} ${pMessage}...\n`);
    lStream.moveCursor(0, -1);
  });

  bus.on("write-start", () => {
    lStream.moveCursor(0, 0);
    lStream.clearLine(1);
  });
};
