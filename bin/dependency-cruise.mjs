#!/usr/bin/env node
import { EOL } from "node:os";
import { program } from "commander";
import validateNodeEnvironment from "../src/cli/validate-node-environment.mjs";
import meta from "../src/meta.js";
import cli from "../src/cli/index.mjs";

try {
  validateNodeEnvironment();

  program
    .description(
      `Validate and visualize dependencies.${EOL}Details: https://github.com/sverweij/dependency-cruiser`
    )
    .option(
      "--init [oneshot]",
      `set up dependency-cruiser for use in your environment (<<< recommended!)${EOL}${EOL}`
    )
    .option(
      "-c, --config [file]",
      "read rules and options from [file] (e.g. .dependency-cruiser.js)",
      true
    )
    .addOption(
      new program.Option(
        "--no-config",
        "do not use a configuration file. " +
          "Overrides any --config option set earlier"
      ).hideHelp(true)
    )
    .option(
      "-T, --output-type <type>",
      "output type; e.g. err, err-html, dot, ddot, archi, flat, text or json",
      "err"
    )
    .option("-m, --metrics", "calculate stability metrics", false)
    .addOption(new program.Option("--no-metrics").hideHelp(true))
    .option(
      "-f, --output-to <file>",
      "file to write output to; - for stdout",
      "-"
    )
    .option(
      "-I, --include-only <regex>",
      "only include modules matching the regex"
    )
    .option(
      "-F, --focus <regex>",
      "only include modules matching the regex + their direct neighbours"
    )
    .option(
      "--focus-depth <number>",
      "the depth to focus on - only applied when --focus is passed too. " +
        "1= direct neighbors, 2=neighbours of neighbours etc.",
      1
    )
    .option(
      "-R, --reaches <regex>",
      "only include modules matching the regex + all modules that can reach it"
    )
    .option(
      "-H, --highlight <regex>",
      "mark modules matching the regex as 'highlighted'"
    )
    .option("-x, --exclude <regex>", "exclude all modules matching the regex")
    .option(
      "-X, --do-not-follow <regex>",
      "include modules matching the regex, but don't follow their dependencies"
    )
    .option(
      "--ignore-known [file]",
      "ignore known violations as saved in [file] (default: .dependency-cruiser-known-violations.json)"
    )
    .addOption(new program.Option("--no-ignore-known").hideHelp(true))
    .addOption(
      new program.Option(
        "--ts-config [file]",
        "use a TypeScript configuration (e.g. tsconfig.json) or it's JavaScript counterpart (e.g. jsconfig.json)"
      ).hideHelp(true)
    )
    .addOption(
      new program.Option(
        "--webpack-config [file]",
        "use a webpack configuration (e.g. webpack.config.js)"
      ).hideHelp(true)
    )
    .addOption(
      new program.Option(
        "--ts-pre-compilation-deps",
        "detect dependencies that only exist before typescript-to-javascript " +
          "compilation (off by default)"
      ).hideHelp(true)
    )
    .option(
      "-S, --collapse <regex>",
      "collapse a to a folder depth by passing a single digit (e.g. 2). When passed a " +
        'regex collapses to that pattern. E.g. "^packages/[^/]+/" would collapse to ' +
        "modules/ folders directly under your packages folder. "
    )
    .addOption(
      new program.Option(
        "-p, --progress [type]",
        "show progress while dependency-cruiser is busy"
      ).choices(["cli-feedback", "performance-log", "ndjson", "none"])
    )
    .addOption(
      new program.Option("--no-progress", "Alias of --progress none").hideHelp(
        true
      )
    )
    .addOption(
      new program.Option(
        "-d, --max-depth <n>",
        "You probably want to use --collapse instead of --max-depth. " +
          "(max-depth would limit the cruise depth; 0 <= n <= 99 (default: 0 - no limit))."
      ).hideHelp(true)
    )
    .addOption(
      new program.Option(
        "-M, --module-systems <items>",
        "list of module systems (default: amd, cjs, es6, tsd)"
      ).hideHelp(true)
    )
    .option(
      "-P, --prefix <prefix>",
      `prefix to use for links in the dot and err-html reporters${EOL}${EOL}`
    )
    .option(
      "-C, --cache [cache-directory]",
      "(experimental) use a cache to speed up execution. " +
        "The directory defaults to node_modules/.cache/dependency-cruiser"
    )
    .addOption(
      new program.Option(
        "--cache-strategy <strategy>",
        "(experimental) strategy to use for detecting changed files in the cache."
      ).choices(["metadata", "content"])
    )
    .addOption(
      new program.Option(
        "--no-cache",
        "switch off caching. Overrides the 'cache' key in .dependency-cruiser.js " +
          "and --cache options set earlier on the command line"
      ).hideHelp(true)
    )
    .addOption(
      new program.Option(
        "--preserve-symlinks",
        "leave symlinks unchanged (off by default)"
      ).hideHelp(true)
    )
    .addOption(
      new program.Option(
        "-v, --validate [file]",
        `alias for --config`
      ).hideHelp(true)
    )
    .option(
      "-i, --info",
      "shows what languages and extensions dependency-cruiser supports"
    )
    .addHelpText(
      "after",
      `${EOL}Other options:` +
        `${EOL}  see https://github.com/sverweij/dependency-cruiser/blob/develop/doc/cli.md${EOL}`
    )
    .version(meta.version)
    .arguments("[files-or-directories]")
    .parse(process.argv);

  if (Boolean(program.args[0]) || program.opts().info || program.opts().init) {
    process.exitCode = await cli(program.args, program.opts());
  } else {
    program.help();
  }
} catch (pError) {
  process.stderr.write(pError.message);
  process.exitCode = 1;
}
