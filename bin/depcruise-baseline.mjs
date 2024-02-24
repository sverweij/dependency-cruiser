#!/usr/bin/env node
import { program } from "commander";
import assertNodeEnvironmentSuitable from "#cli/assert-node-environment-suitable.mjs";
import cli from "#cli/index.mjs";
import meta from "#meta.cjs";

function formatError(pError) {
  process.stderr.write(pError.message);
  process.exitCode = 1;
}

try {
  assertNodeEnvironmentSuitable();

  program
    .description(
      "Writes all known violations of rules in a .dependency-cruiser.js to a file.\n" +
        "Alias for depcruise -c -T baseline -f .dependency-cruiser-known-violations.json [files-or-directories]\n" +
        "Details: https://github.com/sverweij/dependency-cruiser",
    )
    .option("-c, --config [file]", "read rules and options from [file]", true)
    .option(
      "-f, --output-to [file]",
      "file to write output to; - for stdout",
      ".dependency-cruiser-known-violations.json",
    )
    .version(meta.version)
    .arguments("<files-or-directories>")
    .parse(process.argv);

  if (Boolean(program.args[0])) {
    process.exitCode = await cli(program.args, {
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
