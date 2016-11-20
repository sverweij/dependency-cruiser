const program  = require("commander");
const cli      = require("./cli");
const $package = require("../package.json");
const semver   = require("semver");

/* istanbul ignore if  */
if (!semver.satisfies(process.versions.node, $package.engines.node)) {
    process.stderr.write(`\nERROR: your node version (${process.versions.node}) is not recent enough.\n`);
    process.stderr.write(`       dependency-cruiser needs a version of node ${$package.engines.node}\n\n`);

    /* eslint no-process-exit: 0 */
    process.exit(-1);
}

program
    .version($package.version)
    .option("-f, --output-to <file>", "file to write output to; - for stdout (default: -)")
    .option("-x, --exclude <regex>", "a regular expression for excluding modules")
    .option("-M, --system <items>", "list of module systems (default: amd,cjs,es6)")
    .option("-T, --output-type <type>", "output type - html|dot|json (default:json)")
    .arguments("<directory-or-file>")
    .parse(process.argv);

if (Boolean(program.args[0])) {
    cli.main(
        program.args[0],
        program
    );
} else {
    program.help();
}
