#!/usr/bin/env node

import { program } from "commander";
import assertNodeEnvironmentSuitable from "#cli/assert-node-environment-suitable.mjs";
import format from "#cli/format.mjs";
import meta from "#meta.cjs";

function formatError(pError) {
  process.stderr.write(pError.message);
  process.exitCode = 1;
}

try {
  assertNodeEnvironmentSuitable();

  program
    .description(
      "Format dependency-cruiser output json.\nDetails: https://github.com/sverweij/dependency-cruiser",
    )
    .option(
      "-f, --output-to <file>",
      "file to write output to; - for stdout",
      "-",
    )
    .option(
      "-T, --output-type <type>",
      "output type; e.g. err, err-html, dot, ddot, archi, flat, d2, mermaid or json",
      "err",
    )
    .option(
      "-I, --include-only <regex>",
      "only include modules matching the regex",
    )
    .option(
      "-F, --focus <regex>",
      "only include modules matching the regex + their direct neighbours",
    )
    .option(
      "--focus-depth <number>",
      "the depth to focus on - only applied when --focus is passed too. " +
        "1= direct neighbors, 2=neighbours of neighbours etc.",
      1,
    )
    .option(
      "-R, --reaches <regex>",
      "only include modules matching the regex + all modules that can reach it",
    )
    .option(
      "-H, --highlight <regex>",
      "mark modules matching the regex as 'highlighted'",
    )
    .option("-x, --exclude <regex>", "exclude all modules matching the regex")
    .option(
      "-S, --collapse <regex>",
      "collapse a to a folder depth by passing a single digit (e.g. 2). Or pass a " +
        "regex to collapse to a pattern E.g. ^packages/[^/]+/ would collapse to " +
        "modules/ folders directly under your packages folder. ",
    )
    .option(
      "-P, --prefix <prefix>",
      "prefix to use for links in the dot and err-html reporters",
    )
    .option(
      "-e, --exit-code",
      "exit with a non-zero exit code when the input json contains error level " +
        "dependency violations. Works for err, err-long and teamcity output types",
    )
    .version(meta.version)
    .arguments("<dependency-cruiser-json>")
    .parse(process.argv);

  if (program.args[0]) {
    const lExitCode = await format(program.args[0], program.opts());
    if (program.opts().exitCode) {
      process.exitCode = lExitCode;
    }
  } else {
    program.help();
  }
} catch (pError) {
  formatError(pError);
}
