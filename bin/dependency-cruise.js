#!/usr/bin/env node
const validateNodeEnv = require("../src/cli/validateNodeEnv");

try {
  validateNodeEnv();

  // importing things only after the validateNodeEnv check so we can show an understandable
  // error. Otherwise, on unsupported platforms we would show a stack trace, which is
  // not so nice
  /* eslint-disable global-require */
  const program = require("commander");
  const $package = require("../package.json");
  const cli = require("../src/cli");

  program
    .version($package.version)
    .description(
      "Validate and visualize dependencies.\nDetails: https://github.com/sverweij/dependency-cruiser"
    )
    .option(
      "-i, --info",
      `shows what languages and extensions
                              dependency-cruiser supports`
    )
    .option(
      "-c, --config [file]",
      `read rules and options from [file]
                              (default: .dependency-cruiser.json)`
    )
    .option("-v, --validate [file]", `alias for --config`)
    .option(
      "-f, --output-to <file>",
      `file to write output to; - for stdout
                             `,
      "-"
    )
    .option(
      "-X, --do-not-follow <regex>",
      `include modules matching the regex,
                              but don't follow them any further`
    )
    .option("-x, --exclude <regex>", "exclude all modules matching the regex")
    .option("--include-only <regex>", "only include modules matching the regex")
    .option(
      "-d, --max-depth <n>",
      `the maximum depth to cruise; 0 <= n <= 99
                              (default: 0, which means 'infinite depth')`
    )
    .option(
      "-M, --module-systems <items>",
      `list of module systems (default: amd,cjs,es6)`
    )
    .option(
      "-T, --output-type <type>",
      `output type - err|err-long|err-html|dot|json
                              (default: err)`
    )
    .option(
      "-P, --prefix <prefix>",
      `prefix to use for links in the dot, err and
                              err-html reporters`
    )
    .option("--preserve-symlinks", `leave symlinks unchanged (off by default)`)
    .option(
      "--ts-pre-compilation-deps",
      `detect dependencies that only exist before
                              typescript-to-javascript compilation
                              (off by default)`
    )
    .option(
      "--ts-config [file]",
      `use a typescript configuration ('project')
                              (default: tsconfig.json)`
    )
    .option(
      "--webpack-config [file]",
      `use a webpack configuration
                              (default: webpack.config.js)`
    )
    .option(
      "--init [oneshot]",
      `write a .dependency-cruiser config with basic
                              validations to the current folder.`
    )
    .arguments("<files-or-directories>")
    .parse(process.argv);

  if (Boolean(program.args[0]) || program.info || program.init) {
    process.exitCode = cli(program.args, program);
  } else {
    program.help();
  }
} catch (e) {
  process.stderr.write(e.message);
  process.exitCode = 1;
}
