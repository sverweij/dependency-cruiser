#!/usr/bin/env node
import { parseArgs } from "node:util";
import { EOL } from "node:os";
import assertNodeEnvironmentSuitable from "#cli/assert-node-environment-suitable.mjs";
import format from "#cli/format.mjs";
import meta from "#meta.cjs";

const ARGUMENTS_OFFSET = 2;
const HELP_MESSAGE = `Usage: depcruise-fmt [options] <dependency-cruiser-json>

Format dependency-cruiser output json.
Details: https://github.com/sverweij/dependency-cruiser

Options:
  -f, --output-to <file>      file to write output to; - for stdout (default:
                              "-")
  -T, --output-type <type>    output type; e.g. err, err-html, dot, ddot,
                              archi, flat, d2, mermaid or json (default: "err")
  -I, --include-only <regex>  only include modules matching the regex
  -F, --focus <regex>         only include modules matching the regex + their
                              direct neighbours
  --focus-depth <number>      the depth to focus on - only applied when --focus
                              is passed too. 1= direct neighbors, 2=neighbours
                              of neighbours etc. (default: 1)
  -R, --reaches <regex>       only include modules matching the regex + all
                              modules that can reach it
  -H, --highlight <regex>     mark modules matching the regex as 'highlighted'
  -x, --exclude <regex>       exclude all modules matching the regex
  -S, --collapse <regex>      collapse a to a folder depth by passing a single
                              digit (e.g. 2). Or pass a regex to collapse to a
                              pattern E.g. ^packages/[^/]+/ would collapse to
                              modules/ folders directly under your packages
                              folder.
  -P, --prefix <prefix>       prefix to use for links in the dot and err-html
                              reporters
  -e, --exit-code             exit with a non-zero exit code when the input
                              json contains error level dependency violations.
                              Works for err, err-long and teamcity output types
  -V, --version               output the version number
  -h, --help                  display help`;

function formatError(pError, pErrorStream) {
  pErrorStream.write(`${pError.message}${EOL}`);
}

function normalizeValues(pValues) {
  const lReturnValue = {
    ...pValues,
    outputTo: pValues["output-to"],
    outputType: pValues["output-type"],
    focusDepth: Number.parseInt(pValues["focus-depth"], 10),
  };
  delete lReturnValue["output-to"];
  delete lReturnValue["output-type"];
  delete lReturnValue["focus-depth"];

  if (pValues["include-only"]) {
    lReturnValue.includeOnly = pValues["include-only"];
    delete lReturnValue["include-only"];
  }
  if (pValues["exit-code"]) {
    lReturnValue.exitCode = pValues["exit-code"];
    delete lReturnValue["exit-code"];
  }
  return lReturnValue;
}

function getOptions(pArguments) {
  return parseArgs({
    args: pArguments,
    options: {
      "output-to": { type: "string", short: "f", default: "-" },
      "output-type": { type: "string", short: "T", default: "err" },
      "include-only": { type: "string", short: "I" },
      focus: { type: "string", short: "F" },
      "focus-depth": { type: "string", default: "1" },
      reaches: { type: "string", short: "R" },
      highlight: { type: "string", short: "H" },
      exclude: { type: "string", short: "x" },
      collapse: { type: "string", short: "S" },
      prefix: { type: "string", short: "P" },
      "exit-code": { type: "boolean", short: "e" },
      version: { type: "boolean", short: "V" },
      help: { type: "boolean", short: "h" },
    },
    strict: true,
    allowPositionals: true,
    tokens: false,
  });
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

    const lExitCode = await format(positionals[0], normalizedValues);
    if (normalizedValues.exitCode) {
      // eslint-disable-next-line require-atomic-updates
      process.exitCode = lExitCode;
    }
  } catch (pError) {
    formatError(pError, pErrorStream);
    // eslint-disable-next-line require-atomic-updates
    process.exitCode = pErrorExitCode;
  }
}

await commandLineInterface();
