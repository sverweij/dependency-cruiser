#!/usr/bin/env node

import { parseArgs } from "node:util";
import assertNodeEnvironmentSuitable from "#cli/assert-node-environment-suitable.mjs";
import cli from "#cli/index.mjs";
import meta from "#meta.cjs";

function showHelp() {
  process.stdout
    .write(`Usage: depcruise-baseline [options] <files-or-directories...>

Writes all known violations of rules in a .dependency-cruiser.js to a file.
Alias for dependency-cruiser --baseline 

Options:
  -c, --config [file]       read rules and options from [file] (default: true)
  -f, --output-to [file]    file to write output to; - for stdout (default: ".dependency-cruiser-known-violations.json")
  -V, --version             display version number
  -h, --help                display help for command

‼ Deprecated. Use dependency-cruiser --baseline in stead.
‼ See https://github.com/sverweij/dependency-cruiser/blob/main/doc/cli.md#--baseline-create-or-update-a-known-violations-baseline

`);
}

try {
  assertNodeEnvironmentSuitable();

  const { values: options, positionals } = parseArgs({
    options: {
      config: {
        type: "string",
        short: "c",
        default: "",
      },
      "output-to": {
        type: "string",
        short: "f",
        default: ".dependency-cruiser-known-violations.json",
      },
      progress: {
        type: "string",
        default: "none",
      },
      version: {
        type: "boolean",
        short: "V",
      },
      help: {
        type: "boolean",
        short: "h",
      },
    },
    allowPositionals: true,
  });

  if (options.version) {
    process.stdout.write(`${meta.version}\n`);
  } else if (options.help || positionals.length === 0) {
    showHelp();
  } else {
    if (options.config === "") {
      options.config = true;
    }

    process.exitCode = await cli(positionals, {
      config: options.config,
      baseline: options["output-to"],
      progress: options["progress"],
    });
  }
} catch (pError) {
  process.stderr.write(pError.message);
  process.exitCode = 1;
}
