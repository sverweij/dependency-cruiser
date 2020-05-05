#!/usr/bin/env node
const validateNodeEnvironment = require("../src/cli/validate-node-environment");

function formatError(pError) {
  process.stderr.write(pError.message);
  process.exitCode = 1;
}

try {
  validateNodeEnvironment();

  // importing things only after the validateNodeEnv check so we can show an understandable
  // error. Otherwise, on unsupported platforms we would show a stack trace, which is
  // not so nice
  /* eslint-disable node/global-require */
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
      `output type - err|err-long|err-html|dot|ddot|archi|json
                         `,
      "err"
    )
    .option(
      "-e, --exit-code",
      `exit with a non-zero exit code when the input json
                          contains error level dependency violations. Works for
                          err, err-long and teamcity output types`
    )
    .arguments("<dependency-cruiser-json>")
    .parse(process.argv);

  if (program.args[0]) {
    format(program.args[0], program)
      .then((pExitCode) => {
        if (program.exitCode) {
          process.exitCode = pExitCode;
        }
      })
      .catch(formatError);
  } else {
    program.help();
  }
} catch (pError) {
  formatError(pError);
}
