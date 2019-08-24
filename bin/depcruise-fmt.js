#!/usr/bin/env node
const validateNodeEnv = require("../src/cli/validateNodeEnv");

function formatError(pError) {
  process.stderr.write(pError.message);
  process.exitCode = 1;
}

try {
  validateNodeEnv();

  // importing things only after the validateNodeEnv check so we can show an understandable
  // error. Otherwise, on unsupported platforms we would show a stack trace, which is
  // not so nice
  /* eslint-disable global-require */
  const program = require("commander");
  const $package = require("../package.json");
  const format = require("../src/cli/format");

  program
    .version($package.version)
    .description(
      "Format dependency-cruiser output json.\nDetails: https://github.com/sverweij/dependency-cruiser"
    )
    .option(
      "-f, --output-to <file>",
      `file to write output to; - for stdout
                         `,
      "-"
    )
    .option(
      "-T, --output-type <type>",
      `output type - err|err-long|err-html|dot|ddot|json
                         `,
      "err"
    )
    .arguments("<dependency-cruiser-json>")
    .parse(process.argv);

  if (program.args[0]) {
    format(program.args[0], program).catch(formatError);
  } else {
    program.help();
  }
} catch (e) {
  formatError(e);
}
