#!/usr/bin/env node

import { parseArgs } from "node:util";
import assertNodeEnvironmentSuitable from "#cli/assert-node-environment-suitable.mjs";
import format from "#cli/format.mjs";
import meta from "#meta.cjs";

function showHelp() {
  process.stdout.write(`Usage: depcruise-fmt [options] <dependency-cruiser-json>

Format dependency-cruiser output json.
Details: https://github.com/sverweij/dependency-cruiser

Options:
  -f, --output-to <file>      file to write output to; - for stdout (default: "-")
  -T, --output-type <type>    output type; e.g. err, err-html, dot, ddot, archi, flat, 
                              d2, mermaid or json (default: "err")
  -I, --include-only <regex>  only include modules matching the regex
  -F, --focus <regex>         only include modules matching the regex + their direct neighbours
      --focus-depth <number>  the depth to focus on - only applied when --focus is passed too.
                              1= direct neighbors, 2=neighbours of neighbours etc. (default: 1)
  -R, --reaches <regex>       only include modules matching the regex + all modules that can reach it
  -H, --highlight <regex>     mark modules matching the regex as 'highlighted'
  -x, --exclude <regex>       exclude all modules matching the regex
  -S, --collapse <regex>      collapse to a folder depth by passing a single digit (e.g. 2). Or 
                              pass a regex to collapse to a pattern E.g. ^packages/[^/]+/ would 
                              collapse to modules/ folders directly under your packages folder.
  -P, --prefix <prefix>       prefix to use for links in the dot and err-html reporters
  -e, --exit-code             exit with a non-zero exit code when the input json contains error 
                              level dependency violations. Works for err, err-long and teamcity 
                              output types
  -V, --version               display version number
  -h, --help                  display help for command
`);
}

try {
  assertNodeEnvironmentSuitable();

  const { values: options, positionals } = parseArgs({
    options: {
      "output-to": {
        type: "string",
        short: "f",
        default: "-",
      },
      "output-type": {
        type: "string",
        short: "T",
        default: "err",
      },
      "include-only": {
        type: "string",
        short: "I",
      },
      focus: {
        type: "string",
        short: "F",
      },
      "focus-depth": {
        type: "string",
        default: "1",
      },
      reaches: {
        type: "string",
        short: "R",
      },
      highlight: {
        type: "string",
        short: "H",
      },
      exclude: {
        type: "string",
        short: "x",
      },
      collapse: {
        type: "string",
        short: "S",
      },
      prefix: {
        type: "string",
        short: "P",
      },
      "exit-code": {
        type: "boolean",
        short: "e",
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
    const lFormatOptions = {
      ...options,
      outputTo: options["output-to"],
      outputType: options["output-type"],
      includeOnly: options["include-only"],
      focusDepth: options["focus-depth"],
      exitCode: options["exit-code"],
    };
    delete lFormatOptions["output-to"];
    delete lFormatOptions["output-type"];
    delete lFormatOptions["include-only"];
    delete lFormatOptions["focus-depth"];
    delete lFormatOptions["exit-code"];
    const lExitCode = await format(positionals[0], lFormatOptions);
    if (lFormatOptions.exitCode) {
      process.exitCode = lExitCode;
    }
  }
} catch (pError) {
  process.stderr.write(pError.message);
  process.exitCode = 1;
}
