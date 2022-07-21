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
  const { version } = require("../src/meta.js");
  const cli = require("../src/cli");

  program
    .description(
      "Writes all known violations of rules in a .dependency-cruiser.js to a file.\n" +
        "Alias for depcruise -c -T baseline -f .dependency-cruiser-known-violations.json [files-or-directories]\n" +
        "Details: https://github.com/sverweij/dependency-cruiser"
    )
    .option("-c, --config [file]", "read rules and options from [file]", true)
    .option(
      "-f, --output-to [file]",
      "file to write output to; - for stdout",
      ".dependency-cruiser-known-violations.json"
    )
    .version(version)
    .arguments("<files-or-directories>")
    .parse(process.argv);

  if (Boolean(program.args[0])) {
    process.exitCode = cli(program.args, {
      ...program.opts(),
      cache: false,
      outputType: "baseline",
    });
  } else {
    program.help();
  }
} catch (pError) {
  formatError(pError);
  process.exitCode = 1;
}
