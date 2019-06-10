 # dependency-cruiser command line interface
The command line interface is a straightforward affair - you pass it a bunch of
files, and dependency-cruiser will start cruising them: 

```sh
depcruise [options] <files-or-directories>
```

Below you'll find a list of command line options you can use, divided into ones that
are only available as options on the command line and into those also
available in dependency-cruiser configurations.

## Contents

### [Command line only options](#command-line-only-options)
1. [arguments - files and/ or directories](#arguments---files-and-or-directories)
1. [`--output-type`: specify the output format](#--output-type-specify-the-output-format)
1. [`--config`/ `--validate`: use a configuration with rules and/or options](#--config---validate) 
1. [`--init`](#--init)
1. [`--info`: show what alt-js are supported](#--info-showing-what-alt-js-are-supported)
1. [`--help`/ no parameters: get help](#--help--no-parameters)

### [Options also available in dependency-cruiser configurations](#options-also-available-in-dependency-cruiser-configurations)
1. [`--do-not-follow`: don't cruise modules adhering to this pattern any further](#--do-not-follow-dont-cruise-modules-adhering-to-this-pattern-any-further)
1. [`--exclude`: exclude modules from being cruised](#--exclude-exclude-modules-from-being-cruised)
1. [`--include-only`: only include modules satisfying a pattern](#--include-only-only-include-modules-satisfying-a-pattern)
1. [`--max-depth`](#--max-depth)
1. [`--prefix` prefixing links](#--prefix-prefixing-links)
1. [`--module-systems`](#--module-systems)
1. [`--ts-pre-compilation-deps` (typescript only)](#--ts-pre-compilation-deps-typescript-only)
1. [`--ts-config`: use a typescript configuration file ('project')](#--ts-config-use-a-typescript-configuration-file-project)
1. [`--webpack-config`: use (the resolution options of) a webpack configuration`](#--webpack-config-use-the-resolution-options-of-a-webpack-configuration)
1. [`--preserve-symlinks`](#--preserve-symlinks)


## Command line only options

### arguments - files and/ or directories
You can pass a bunch of files, directories and 'glob' patterns.
dependency-cruiser will
- resolve the glob patterns (if any) to files and directories
- scan directories (if any) for files with supported extensions
- add the passed files to that
... and start the cruise with the files thus found.

#### Cruising multiple files and directories in one go
Just pass them as arguments. This, e.g. will cruise every file in the folders
src, test and lib (recursively) + the file called index.ts in the root.

```sh
depcruise --output-type dot src test lib index.ts
```

#### passing globs as parameters
dependency-cruiser uses [node-glob](https://github.com/isaacs/node-glob) to
make sure globs work the same accross platforms. It cannot prevent the
environment from expanding globs before it can process it, however.

As each environment interprets globs slightly differently, a pattern
like `packages/**/src/**/*.js` will yield different results.

To make sure glob expansion works _exactly_ the same accross
platforms slap some quotes around them, so it's not the environment
(/ shell) expanding the glob, but dependency-cruiser itself:

```sh
depcruise "packages/**/src/**/*.js"
```

### `--output-type`: specify the output format

#### err
For use in build scripts, in combination with `--config` e.g.

```sh
dependency-cruise --config my-depcruise-rules.json src
```

This will:
- ... print nothing and exit with code 0 if dependency-cruiser didn't
  find any violations of the rules in .dependency-cruiser.json.
- ... print the violating dependencies if there is any. Moreover it
  will exit with exit code _number of violations with severity `error` found_ 
  in the same fashion linters and test tools do.

See the _depcruise_ target in the [package.json](https://github.com/sverweij/dependency-cruiser/blob/master/package.json#L55)
for a real world example.

#### dot
Supplying `dot` as output type will make dependency-cruiser write
a GraphViz dot format directed graph. Typical use is in concert
with _GraphViz dot_ (`-T` is the short form of `--output-type`:)

```shell
dependency-cruise -x "^node_modules" -T dot src | dot -T svg > dependencygraph.svg
```

> ##### ddot - summarize on folder level
> Since version 4.13.0 there's an _experimental_ `ddot` reporter that summarizes
> modules on folder level. It works fine, but its output is a tad more ugly
> than I'd like so there'll be tweaks to spruce it up in the future.

> ##### rcdot
> The `rcdot` reporter is deprecated.    
> Since version 4.12.0 `rcdot` reporter's
> coloring has become the default for the `dot` reporter, so `dot` and `rcdot`
> will yield the same results.

#### html
Write it to html with a dependency matrix instead:
```shell
dependency-cruise -T html -f dependencies.html src
```

#### csv
If you supply `csv` it will write the dependency matrix to a comma
separated file - so you can import it into a spreadsheet program
and analyze from there.

#### teamcity
Write the output in [TeamCity service message format](https://www.jetbrains.com/help/teamcity/build-script-interaction-with-teamcity.html).

E.g. to cruise src (using the .dependency-cruiser config) and emit TeamCity messages to stdout:

```shell
dependency-cruise -v -T teamcity  -- src
```

<details>
<summary>Sample output</summary>

```
##teamcity[inspectionType id='not-to-dev-dep' name='not-to-dev-dep' description='Don|'t allow dependencies from src/app/lib to a development only package' category='dependency-cruiser' flowId='8970869134' timestamp='2019-06-02T10:37:56.812']
##teamcity[inspectionType id='no-orphans' name='no-orphans' description='Modules without any incoming or outgoing dependencies are might indicate unused code.' category='dependency-cruiser' flowId='8970869134' timestamp='2019-06-02T10:37:56.812']
##teamcity[inspectionType id='not-to-unresolvable' name='not-to-unresolvable' description='' category='dependency-cruiser' flowId='8970869134' timestamp='2019-06-02T10:37:56.812']
##teamcity[inspection typeId='not-to-dev-dep' message='src/asneeze.js -> node_modules/eslint/lib/api.js' file='src/asneeze.js' SEVERITY='ERROR' flowId='8970869134' timestamp='2019-06-02T10:37:56.812']
##teamcity[inspection typeId='not-to-unresolvable' message='src/index.js -> ./medontexist.json' file='src/index.js' SEVERITY='ERROR' flowId='8970869134' timestamp='2019-06-02T10:37:56.812']
##teamcity[inspection typeId='not-to-dev-dep' message='src/index.js -> node_modules/dependency-cruiser/src/main/index.js' file='src/index.js' SEVERITY='ERROR' flowId='8970869134' timestamp='2019-06-02T10:37:56.812']
##teamcity[inspection typeId='not-to-dev-dep' message='src/index.js -> node_modules/eslint/lib/api.js' file='src/index.js' SEVERITY='ERROR' flowId='8970869134' timestamp='2019-06-02T10:37:56.812']
##teamcity[inspection typeId='no-orphans' message='src/orphan.js -> src/orphan.js' file='src/orphan.js' SEVERITY='ERROR' flowId='8970869134' timestamp='2019-06-02T10:37:56.812']
```

</details>

Just like the `err` reporter the teamcity reporter has an empty output when there's
no violations - and a non-zero exit code when there's errors.

### `--config`/ `--validate`
Validates against a list of rules in a configuration file. This defaults to a file
called `.dependency-cruiser.json` (/ `.dependency-cruiser.js`), but you can
specify your own rules file, which can be in json format or a valid node
module returning a rules object literal.

```shell
dependency-cruise -x node_modules --config my.rules.json src spec
```

> _Tip_: usually you don't need to specify the rules file. However if run
> `depcruise --config src`, _src_ will be interpreted as the rules file.
> Which is probably is not what you want. To prevent this, place `--`
> after the last option, like so:
> ```
> dependency-cruise --config -- src
> ```

The configuration specifies a bunch of regular expressions pairs your dependencies
should adhere tom as well as configuration options that tweak what is cruised and
how.

A simple validation configuration that forbids modules in `src` to use stuff
in the `test` folder and allows everything else:

```json
{
    "forbidden": [{
        "from": {"path": "^src"},
        "to": {"path": "^test"}
    }]
}
```

You can optionally specify a name and an error severity ('error',  'warn' (the
default) and 'info') with them that will appear in some reporters:

```json
{
    "forbidden": [{
        "name": "no-src-to-test",
        "severity": "error",
        "from": {"path": "^src"},
        "to": {"path": "^test"}
    }]
}
```

For more information about writing rules see the [tutorial](rules-tutorial.md) and the
[rules-reference](rules-reference.md). The rules-reference also describes all the
[options](rules-reference.md#the-options).

For an easy set up of both use [--init](#--init)

### `--init`
This asks some questions and depending on the answers creates a dependency-cruiser
configuration with some useful rules in it to the current folder and exits.
use with `--config`

<details>
<summary>Some of the rules that will be in the configuration (either directly or from a
preset):</summary>


Rule                     | Description
---                      |---
`no-circular`            | flags all circular dependencies
`no-orphans`             | flags orphan modules (except typescript `.d.ts` files)
`no-deprecated-core`     | flags dependencies on deprecated node 'core' modules
`no-deprecated-npm`      | flags dependencies on deprecated npm modules
`no-non-package-json`    | flags (npm) dependencies that don't occur in package.json
`not-to-unresolvable`    | flags dependencies that can't be resolved
`no-duplicate-dep-types` | flags dependencies that occur more than once in package.json
`not-to-test`            | Don't allow dependencies from outside test folders to test folders
`not-to-spec`            | Don't allow dependencies to (typescript/ javascript/ coffeescript) spec files
`not-to-dev-dep`         | Don't allow dependencies from src/app/lib to a development only package
`optional-deps-used`     | Inform about the use of 'optional' dependencies (so you can ensure their imports a are sufficiently managed)
`peer-deps-used`         | Warn about the use of a peer dependency (they might be OK for you, but it's not typical you have them).
`no-duplicate-dep-types` | Warn if a dependency occurs in your package.json more than once (technically: has more than one dependency type)


</details>

### `--info` showing what alt-js are supported

Which alt-js languages dependency-cruiser supports depends on the availability
it has to them. To see how dependency-cruiser perceives its environment use
`depcruise --info` (any arguments are ignored). 

<details>
<summary>Typical output</summary>

```
Supported:

  If you need a supported, but not enabled transpiler ('✖' below), just install
  it in the same folder dependency-cruiser is installed. E.g. 'npm i livescript'
  will enable livescript support if it's installed in your project folder.

Transpilers:

  ✔ javascript (>es1)
  ✔ coffee-script (>=1.0.0 <2.0.0)
  ✔ coffeescript (>=1.0.0 <3.0.0)
  ✖ livescript (>=1.0.0 <2.0.0)
  ✔ typescript (>=2.0.0 <4.0.0)

Extensions:

  ✔ .js
  ✔ .mjs
  ✔ .jsx
  ✔ .vue
  ✔ .ts
  ✔ .tsx
  ✔ .d.ts
  ✖ .ls
  ✔ .coffee
  ✔ .litcoffee
  ✔ .coffee.md
  ✔ .csx
  ✔ .cjsx
```
</details>

### `--help` / no parameters
Running with no parameters gets you help.


## Options also available in dependency-cruiser configurations
Some of the `options` in dependency-cruiser configurations are also available as
command line options. They _override_ what's in the configuration, so they're great
if you need to quickly experiment with an option, or when you want to use one
configuration for multiple purposes.

### `--do-not-follow`: don't cruise modules adhering to this pattern any further
If you _do_ want to see certain modules in your reports, but are not interested
in these modules' dependencies, you'd pass the regular expression for those
modules to the `--do-not-follow` (short: `-X`) option. A typical pattern you'd
use with this is "node_modules" (but be sure to check out the possibilities you
have with the [`doNotFollow` option](#donotfollow-dont-cruise-modules-adhering-to-this-pattern-any-further))

```sh
dependency-cruise -X "^node_modules" -T html -f deps-with-unfollowed-node_modules.html src
```

Details and more ways to limit dependency-cruiser from following things: check out
the [doNotFollow](./rules-reference.md#donotfollow-dont-cruise-modules-adhering-to-this-pattern-any-further) 
option in the rules reference.

### `--exclude`: exclude modules from being cruised
If you don't want to see certain modules in your report (or not have them
validated), you can exclude them by passing a regular expression to the
`--exclude` (short: `-x`) option. E.g. to exclude `node_modules` from being
scanned altogether:

```sh
dependency-cruise -x "node_modules" -T html -f deps-without-node_modules.html src
```

Because it's regular expressions, you can do more interesting stuff here as well. To exclude
all modules with a file path starting with coverage, test or node_modules, you could do this:

```sh
dependency-cruise -x "^(coverage|test|node_modules)" -T html -f deps-without-stuffs.html src
```

### `--include-only`: only include modules satisfying a pattern
E.g. to only take modules into account that are in the `src` tree (and exclude all
node_modules, core modules and modules otherwise outside it):

```sh
dependency-cruise --include-only "^src" -T dot src | dot -T svg > internal-dependency-graph.svg
```

See [includeOnly](./rules-reference.md#includeonly-only-include-modules-satisfying-a-pattern) in the rules reference
for more details.

### `--max-depth`
Only cruise the specified depth, counting from the specified root-module(s). This
command is mostly useful in combination with visualisation output like _dot_ to
keep the generated output to a manageable size.

See [maxDepth](./rules-reference.md#maxdepth)

### `--prefix` prefixing links
If you want the links in the svg output to have a prefix (say,
`https://github.com/you/yourrepo/tree/master/`) so when you click them you'll
open the link on github instead of the local file - pass that after the
`--prefix` option. 

Typically you want the prefix to end on a `/`.

```sh
depcruise --prefix https://github.com/sverweij/dependency-cruiser/tree/develop/ -T dot -x node_modules src | dot -T svg > dependencies.svg
```

### `--module-systems`
Here you can pass a list of module systems dependency-cruiser should use
to detect dependencies. It defaults to `amd, cjs, es6`.

### `--ts-pre-compilation-deps` (typescript only)
By default dependency-cruiser does not take dependencies between typescript
modules that don't exist after compilation to javascript. Pass this command
line switch to do take them into account.

For details see [tsPreCompilationDeps](./rules-reference#tsprecompilationdeps) in the
rules reference.

### `--ts-config`: use a typescript configuration file ('project')
If dependency-cruiser encounters typescript, it compiles it to understand what it
is looking at. If you have `compilerOptions` in your `tsconfig.json` you think
it should take into account, you can use this option to make it do that.
You might want to do this e.g. if you have `baseDir`/ `paths` keys in your
`tsconfig`, are using
[dynamic imports](./faq.md#typescript-dynamic-imports-show-up-as-x--whats-up-there)
or jsx/ tsx outside of a react context.

For details see [tsConfig](./rules-reference#tsconfig-use-a-typescript-configuration-file-project)
section in the rules reference.

### `--preserve-symlinks`
Equivalent of the [preserveSymlinks](#preservesymlinks) configuration option.

### `--webpack-config`: use (the resolution options of) a webpack configuration
Dependency-cruiser will pluck the `resolve` key from the configuration
use the information to resolve files on disk.

For details see the [webpackConfig](./rules-reference#webpackconfig-use-the-resolution-options-of-a-webpack-configuration)
section in the rules reference.

## Daphne's dependencies - a gentle introduction
**[Daphne's dependencies](sample-output.md)**
sport a visual overview of all the output formats. It also shows how Daphne and
her colleagues use them in their workflow.
