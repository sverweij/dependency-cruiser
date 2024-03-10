#!/usr/bin/env node
import { parseArgs } from "node:util";
import { EOL } from "node:os";
import assertNodeEnvironmentSuitable from "#cli/assert-node-environment-suitable.mjs";
import cli from "#cli/index.mjs";
import meta from "#meta.cjs";

const ARGUMENTS_OFFSET = 2;
const HELP_MESSAGE = `Usage: depcruise-baseline [options] <files-or-directories>

Writes all known violations of rules in a .dependency-cruiser.js to a file.
Details: https://github.com/sverweij/dependency-cruiser

Alias for 
  depcruise -T baseline -f .dependency-cruiser-known-violations.json [files-or-directories]

  Options:
  -c, --config [file]     read rules and options from [file] (default: true)
  -f, --output-to [file]  file to write output to; - for stdout (default:
                          ".dependency-cruiser-known-violations.json")
  -V, --version           output the version number
  -h, --help              display help`;

function getOptions(pArguments) {
  return parseArgs({
    args: pArguments,
    options: {
      config: { type: "string", short: "c" },
      "output-to": {
        type: "string",
        short: "f",
        default: ".dependency-cruiser-known-violations.json",
      },
      help: { type: "boolean", short: "h", default: false },
      version: { type: "boolean", short: "V", default: false },
    },
    strict: true,
    allowPositionals: true,
    tokens: false,
  });
}

function formatError(pError, pErrorStream) {
  pErrorStream.write(`${pError.message}${EOL}`);
}

function normalizeValues(pValues) {
  return {
    ...pValues,
    outputTo: pValues["output-to"],
    config: pValues.config ? pValues.config : true,
  };
}

export async function commandLineInterface(
  pArguments = process.argv.slice(ARGUMENTS_OFFSET),
  pOutStream = process.stdout,
  pErrorStream = process.stderr,
  pErrorExitCode = 1,
) {
  try {
    assertNodeEnvironmentSuitable();
    const { values, positionals } = getOptions(pArguments);
    const normalizedValues = normalizeValues(values);

    if (normalizedValues.version) {
      pOutStream.write(`${meta.version}${EOL}`);
      return;
    }
    if (normalizedValues.help || positionals.length === 0) {
      pOutStream.write(`${HELP_MESSAGE}${EOL}`);
      return;
    }

    // eslint-disable-next-line require-atomic-updates
    process.exitCode = await cli(positionals, {
      ...normalizedValues,
      cache: false,
      outputType: "baseline",
    });
  } catch (pError) {
    formatError(pError, pErrorStream);
    // eslint-disable-next-line require-atomic-updates
    process.exitCode = pErrorExitCode;
  }
}

await commandLineInterface();
