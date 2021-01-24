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
    .description(
      "Format dependency-cruiser output json.\nDetails: https://github.com/sverweij/dependency-cruiser"
    )
    .option(
      "-f, --output-to <file>",
      "file to write output to; - for stdout",
      "-"
    )
    .option(
      "-T, --output-type <type>",
      "output type; e.g. err, err-html, dot, ddot, archi, flat or json",
      "err"
    )
    .option(
      "-I, --include-only <regex>",
      "only include modules matching the regex"
    )
    .option(
      "-F, --focus <regex>",
      "only include modules matching the regex + their direct neighbours"
    )
    .option("-x, --exclude <regex>", "exclude all modules matching the regex")
    .option(
      "-S, --collapse <regex>",
      "collapse a to a folder depth by passing a single digit (e.g. 2). Or pass a " +
        "regex to collapse to a pattern E.g. ^packages/[^/]+/ would collapse to " +
        "modules/ folders directly under your packages folder. "
    )
    .option(
      "-e, --exit-code",
      "exit with a non-zero exit code when the input json contains error level " +
        "dependency violations. Works for err, err-long and teamcity output types"
    )
    .version($package.version)
    .arguments("<dependency-cruiser-json>")
    .parse(process.argv);

  if (program.args[0]) {
    format(program.args[0], program.opts())
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
