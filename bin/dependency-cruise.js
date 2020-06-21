#!/usr/bin/env node
const validateNodeEnvironment = require("../src/cli/validate-node-environment");

try {
  validateNodeEnvironment();

  // importing things only after the validateNodeEnv check so we can show an understandable
  // error. Otherwise, on unsupported platforms we would show a stack trace, which is
  // not so nice
  /* eslint-disable node/global-require */
  const program = require("commander");
  const $package = require("../package.json");
  const cli = require("../src/cli");

  program
    .description(
      "Validate and visualize dependencies.\nDetails: https://github.com/sverweij/dependency-cruiser"
    )
    .option(
      "--init [oneshot]",
      "set up dependency-cruiser for use in your environment (<<< recommended!)"
    )
    .option(
      "-c, --config [file]",
      "read rules and options from [file] (e.g. .dependency-cruiser.js)"
    )
    .option(
      "-T, --output-type <type>",
      "output type; e.g. err, err-html, dot, ddot, archi or json\n(default: err)"
    )
    .option(
      "-f, --output-to <file>",
      "file to write output to; - for stdout",
      "-"
    )
    .option("--include-only <regex>", "only include modules matching the regex")
    .option(
      "--focus <regex>",
      "only include modules matching the regex + their direct neighbours"
    )
    .option("-x, --exclude <regex>", "exclude all modules matching the regex")
    .option(
      "-X, --do-not-follow <regex>",
      "include modules matching the regex, but don't follow their dependencies"
    )
    .option(
      "--ts-config [file]",
      "use a typescript configuration (e.g. tsconfig.json)"
    )
    .option(
      "--webpack-config [file]",
      "use a webpack configuration (e.g. webpack.config.js)"
    )
    .option(
      "--ts-pre-compilation-deps",
      "detect dependencies that only exist before typescript-to-javascript " +
        "compilation (off by default)"
    )
    .option(
      "-d, --max-depth <n>",
      "limit cruise depth; 0 <= n <= 99 (default: 0 - no limit)"
    )
    .option(
      "-M, --module-systems <items>",
      "list of module systems (default: amd, cjs, es6, tsd)"
    )
    .option(
      "-P, --prefix <prefix>",
      "prefix to use for links in the dot and err-html reporters"
    )
    .option("--preserve-symlinks", `leave symlinks unchanged (off by default)`)
    .option("-v, --validate [file]", `alias for --config`)
    .option(
      "-i, --info",
      "shows what languages and extensions dependency-cruiser supports"
    )
    .version($package.version)
    .arguments("<files-or-directories>")
    .parse(process.argv);

  if (Boolean(program.args[0]) || program.info || program.init) {
    process.exitCode = cli(program.args, program);
  } else {
    program.help();
  }
} catch (pError) {
  process.stderr.write(pError.message);
  process.exitCode = 1;
}
