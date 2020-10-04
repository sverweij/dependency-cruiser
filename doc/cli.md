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

### Command line only options

1. [arguments - files and/ or directories](#arguments---files-and-or-directories)
1. [`--output-type`: specify the output format](#--output-type-specify-the-output-format)
1. [`--config`/ `--validate`: use a configuration with rules and/or options](#--config---validate)
1. [`--init`](#--init)
1. [`--info`: show what alt-js are supported](#--info-showing-what-alt-js-are-supported)
1. [`--help`/ no parameters: get help](#--help--no-parameters)

### Options also available in dependency-cruiser configurations

1. [`--do-not-follow`: don't cruise modules adhering to this pattern any further](#--do-not-follow-dont-cruise-modules-adhering-to-this-pattern-any-further)
1. [`--include-only`: only include modules satisfying a pattern](#--include-only-only-include-modules-satisfying-a-pattern)
1. [`--focus`: show modules and their direct neighbours](#--focus-show-modules-and-their-direct-neighbours)
1. [`--collapse`: summarize to folder depth or pattern](#--collapse-summarize-to-folder-depth-or-pattern)
1. [`--exclude`: exclude dependencies from being cruised](#--exclude-exclude-dependencies-from-being-cruised)
1. [`--max-depth`](#--max-depth)
1. [`--progress`: get feedback on what dependency-cruiser is doing while it's running](#--progress-get-feedbakc-on-what-dependency-cruiser-is-doing-while-its-running)
1. [`--prefix` prefixing links](#--prefix-prefixing-links)
1. [`--module-systems`](#--module-systems)
1. [`--ts-pre-compilation-deps` (typescript only)](#--ts-pre-compilation-deps-typescript-only)
1. [`--ts-config`: use a typescript configuration file ('project')](#--ts-config-use-a-typescript-configuration-file-project)
1. [`--webpack-config`: use (the resolution options of) a webpack configuration`](#--webpack-config-use-the-resolution-options-of-a-webpack-configuration)
1. [`--preserve-symlinks`](#--preserve-symlinks)

### Standalone formatting of dependency graphs: [depcruise-fmt](#depcruise-fmt)

### Make GraphViz output more interactive: [depcruise-wrap-stream-in-html](#depcruise-wrap-stream-in-html)

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
make sure globs work the same across platforms. It cannot prevent the
environment from expanding globs before it can process it, however.

As each environment interprets globs slightly differently, a pattern
like `packages/**/src/**/*.js` will yield different results.

To make sure glob expansion works _exactly_ the same across
platforms slap some quotes around them, so it's not the environment
(/ shell) expanding the glob, but dependency-cruiser itself:

```sh
depcruise "packages/**/src/**/*.js"
```

### `--output-type`: specify the output format

#### err

For use in build scripts, in combination with `--config`. It's also
the default reporter. Sample use:

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

#### err-long

Similar to `err`, but in addition for each violation it emits the _comment_
that went with the violated rule, so it's easier to put the rule into context
(and if the comment contains that information: why the rule is there, and
how to fix it). If you use dependency-cruiser in a lint-staged like setup, this
might be a useful format,

```sh
dependency-cruise --output-type err-long --config my-depcruise-rules.json src
```

#### dot

Supplying `dot` as output type will make dependency-cruiser write
a GraphViz dot format directed graph. Typical use is in concert
with _GraphViz dot_ (`-T` is the short form of `--output-type`:)

```shell
dependency-cruise -x "^node_modules" -T dot src | dot -T svg > dependencygraph.svg
```

You can customise the look of these graphs. See the
[theming](./options-reference.md#theme-dot-ddot-and-archi-reporters) and
[summarising](./options-reference.md#summarising-collapsepattern-dot-and-archi-reporters)
sections in the options reference for details. You can also use
[`depcruise-wrap-stream-in-html`](#depcruise-wrap-stream-in-html) to
make the graphs more interactive.

#### ddot - summarise on folder level

> This reporter is _experimental_. It's likely to stay, but the way you configure
> it or how its output looks might change without major version bumping.

The `ddot` reporter is a variant on the `dot` output. It summarises modules on
folder level. You can customise it with [themes](./options-reference.md#theme-dot-ddot-and-archi-reporters)
and [filters](./options-reference.md#filtering-dot-ddot-and-archi-reporters)
just like you can the dot reporter output.

#### archi/ cdot

> This reporter is _experimental_. It's likely to stay, but the way you configure
> it or how its output looks might change without major version bumping.

The archi is a variant on the `dot` output. The archi reporter
can summarise (or 'collapse') dependencies to folders of your own choosing.
Great if you want to have a high level overview of your app's dependencies.

By default it collapses to one folder below folders named _node_modules_, _packages_,
_src_, _lib_ and _test_, but you can pass your own patterns as well in the
`options.reporterOptions.archi` section of your dependency-cruiser configuration.

See the [summarising section in the options reference](./options-reference.md#summarising-collapsepattern-dot-and-archi-reporters)
for details.

<details>
<summary>Sample output</summary>

![high level dependency graph of react](./real-world-samples/react-high-level-dependencies.svg)

</details>

#### err-html

Generates a stand-alone html report with:

- a summary with files & dependencies cruised and the number of errors and warnings found
- all rules, ordered by the number of violations (unviolated ones are hidden by default)
- a list of all dependency and module violations, ordered by severity, rule name, from module, to module.

```shell
dependency-cruise --validate --output-type err-html -f dependency-report.html src test configs
```

<img width="722" alt="screen shot of an err-html report - the real one is accessible" src="assets/sample-err-html-output.png">

#### html

Write it to html with a dependency matrix instead:

```shell
dependency-cruise -T html -f dependencies.html src
```

#### csv

If you supply `csv` it will write the dependency matrix to a comma
separated file - so you can import it into a spreadsheet program
and analyse from there.

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

Just like the `err` reporter the TeamCity reporter has an empty output when there's
no violations - and a non-zero exit code when there's errors.

#### text

This reporter makes a straight, flat dump of all dependencies found in a cruise.
Useful for grepping.

```sh
dependency-cruise -T text --include-only src/report src/report
```

<details>
<summary>output</summary>

```
src/report/anon/anonymize-path-element.js → src/report/anon/random-string.js
src/report/anon/anonymize-path.js → src/report/anon/anonymize-path-element.js
src/report/anon/index.js → src/report/anon/anonymize-path.js
src/report/csv/index.js → src/report/utl/dependency-to-incidence-transformer.js
src/report/dot/index.js → src/report/dot/dot.template.js
src/report/dot/index.js → src/report/dot/module-utl.js
src/report/dot/index.js → src/report/dot/prepare-custom-level.js
src/report/dot/index.js → src/report/dot/prepare-folder-level.js
src/report/dot/index.js → src/report/dot/theming.js
src/report/dot/module-utl.js → src/report/dot/theming.js
src/report/dot/theming.js → src/report/dot/default-theme.json
src/report/dot/prepare-custom-level.js → src/report/utl/consolidate-to-pattern.js
src/report/dot/prepare-custom-level.js → src/report/dot/module-utl.js
src/report/utl/consolidate-to-pattern.js → src/report/utl/consolidate-module-dependencies.js
src/report/utl/consolidate-to-pattern.js → src/report/utl/consolidate-modules.js
src/report/utl/consolidate-module-dependencies.js → src/report/utl/compare-rules.js
src/report/utl/consolidate-modules.js → src/report/utl/compare-rules.js
src/report/dot/prepare-folder-level.js → src/report/utl/consolidate-to-folder.js
src/report/dot/prepare-folder-level.js → src/report/dot/module-utl.js
src/report/utl/consolidate-to-folder.js → src/report/utl/consolidate-module-dependencies.js
src/report/utl/consolidate-to-folder.js → src/report/utl/consolidate-modules.js
src/report/error-html/index.js → src/report/error-html/error-html.template.js
src/report/error-html/index.js → src/report/error-html/utl.js
src/report/html/index.js → src/report/utl/dependency-to-incidence-transformer.js
src/report/html/index.js → src/report/html/html.template.js
src/report/index.js → src/report/anon/index.js
src/report/index.js → src/report/csv/index.js
src/report/index.js → src/report/dot/index.js
src/report/index.js → src/report/error.js
src/report/index.js → src/report/error-html/index.js
src/report/index.js → src/report/html/index.js
src/report/index.js → src/report/identity.js
src/report/index.js → src/report/json.js
src/report/index.js → src/report/teamcity.js
src/report/index.js → src/report/text.js
```

</details>

... or to find everything connected to the `meta` module, in combination with
`grep`:

```sh
dependency-cruise -v -T text src | grep transpile/meta.js
```

<details>
<summary>output</summary>

```
src/main/resolve-options/normalize.js → src/extract/transpile/meta.js
src/extract/transpile/meta.js → package.json
src/extract/transpile/meta.js → src/extract/transpile/coffeescript-wrap.js
src/extract/transpile/meta.js → src/extract/transpile/javascript-wrap.js
src/extract/transpile/meta.js → src/extract/transpile/livescript-wrap.js
src/extract/transpile/meta.js → src/extract/transpile/typescript-wrap.js
src/extract/transpile/meta.js → src/extract/transpile/vue-template-wrap.js
src/main/index.js → src/extract/transpile/meta.js
src/extract/transpile/index.js → src/extract/transpile/meta.js
src/extract/gather-initial-sources.js → src/extract/transpile/meta.js
```

</details>

#### json

This emits the internal representation of a cruise as json. It's the input format for
[depcruise-fmt](#depcruise-fmt), and is useful for debugging.

See [output-format](output-format.md) for more information

#### anon - obfuscated json

The same as json - but with all paths obfuscated. This enables you to share the result
of a cruise for troubleshooting purposes without showing what the source code is
about.

To save an anonymized dependency graph to `anonymized-result.json` do this:

```sh
depcruise --validate --output-type anon --output-to anonymized-result.json bin src
```

e.g. to save an anonymized graph into and svg:

```sh
depcruise --validate --output-type anon bin src | depcruise-fmt --output-type dot - | dot -T svg > anonymized_graph.svg
```

<details>
<summary>Sample output</summary>

Here's a part of dependency-cruiser's own dependency graph both original
and obfuscated (after converting it to a graph via depcruise-fmt and dot -
so it's easier to compare than the two json's):

##### Original

<img width="616" alt="original" src="assets/original.png">

##### Obfuscated

<img width="425" alt="obfuscated" src="assets/obfuscated.png">

</details>

<details>
<summary>How does the obfuscation work?</summary>

- It uses the list of words you pass in `options.reporterOptions.anon.wordlist`
  to replace non-common path elements
  with (`src/search/dragonfly-algorithm.js` -> `src/animal/announce.js`,
  `src/search/dragonfly-algorithm.spec.js` -> `src/animal/announce.spec.js`).
- (You can use any array of strings here - a good one is Sindre Sorhus'
  [mnemonic-words](https://www.npmjs.com/package/mnemonic-words), which
  you can simply require into the option if you're using JavaScript as
  the config file format):
  ```javascript
  ...
  options: {
    reporterOptions:
      anon: {
        wordlist: require('mnemonic-words')
      }
  }
  ...
  ```
- It will retain name similarities (like the `announce.js`/ `announce.spec.js` above).
- When there's more path elements in your dependency graph than in the corpus
  the algorithm falls back to random strings that have the same length and pattern
  as the original one (`secretService-record.ts` -> `fnwarqVboiuvq-pugnmh.ts`).
- The algorithm considers some patterns to be 'common'. It leaves those
  alone to retain some readability. 'Common' patterns include `src`, `test`,
  `node_modules`, `.`, `index` etc. You can find the full regexp in
  [anonymize-path.js](../src/report/anon/anonymize-path.js#3).
- The algorithm obfuscates _within_ node_modules is obfuscated as well, so
  it won't become apparent from the dependency graph which ones your app
  uses either.

</details>

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
>
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
  "forbidden": [
    {
      "from": { "path": "^src" },
      "to": { "path": "^test" }
    }
  ]
}
```

You can optionally specify a name and an error severity ('error', 'warn' (the
default) and 'info') with them that will appear in some reporters:

```json
{
  "forbidden": [
    {
      "name": "no-src-to-test",
      "severity": "error",
      "from": { "path": "^src" },
      "to": { "path": "^test" }
    }
  ]
}
```

For more information about writing rules see the [tutorial](rules-tutorial.md) and the
[rules-reference](rules-reference.md). For options check out the
[options reference](options-reference.md).

For an easy set up of both use [--init](#--init)

### `--init`

This asks some questions and - depending on the answers - creates a dependency-cruiser
configuration with some useful rules to the current folder and exits.

The configuration file is larded with documentation to make it easy to tweak.

Use `--config` to have dependency-cruiser take the configuration file into account.

<details>
<summary>Some of the rules that will be in the configuration (either directly or from a
preset):</summary>

| Rule                     | Description                                                                                                      |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `no-circular`            | flags all circular dependencies                                                                                  |
| `no-orphans`             | flags orphan modules (except typescript `.d.ts` files)                                                           |
| `no-deprecated-core`     | flags dependencies on deprecated node 'core' modules                                                             |
| `no-deprecated-npm`      | flags dependencies on deprecated npm modules                                                                     |
| `no-non-package-json`    | flags (npm) dependencies that don't occur in package.json                                                        |
| `not-to-unresolvable`    | flags dependencies that can't be resolved                                                                        |
| `no-duplicate-dep-types` | flags dependencies that occur more than once in package.json                                                     |
| `not-to-test`            | Don't allow dependencies from outside test folders to test folders                                               |
| `not-to-spec`            | Don't allow dependencies to (typescript/ JavaScript/ CoffeeScript) spec files                                    |
| `not-to-dev-dep`         | Don't allow dependencies from src/app/lib to a development only package                                          |
| `optional-deps-used`     | Inform about the use of 'optional' dependencies (so you can ensure their imports a are sufficiently managed)     |
| `peer-deps-used`         | Warn about the use of a peer dependency (they might be OK for you, but it's not typical you have them).          |
| `no-duplicate-dep-types` | Warn if a dependency occurs in your package.json more than once (technically: has more than one dependency type) |

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

The first four options below will be of use when you want to tame the size of
the visual representation of a big dependency graph. For the rest of the options
you're typically best off setting in a configuration file (generate one with
`depcruise --init`).

### `--do-not-follow`: don't cruise modules adhering to this pattern any further

If you _do_ want to see certain modules in your reports, but are not interested
in these modules' dependencies, you'd pass the regular expression for those
modules to the `--do-not-follow` (short: `-X`) option. A typical pattern you'd
use with this is "node_modules" (but be sure to check out the possibilities you
have with the [`doNotFollow` option](#./options-reference.md#donotfollow-dont-cruise-modules-any-further))

```sh
dependency-cruise -X "^node_modules" -T html -f deps-with-unfollowed-node_modules.html src
```

Details and more ways to limit dependency-cruiser from following things: check out
the [doNotFollow](./options-reference.md#donotfollow-dont-cruise-modules-any-further)
option in the options reference.

### `--include-only`: only include modules satisfying a pattern

E.g. to only take modules into account that are in the `src` tree (and exclude all
node_modules, core modules and modules otherwise outside it):

```sh
dependency-cruise --include-only "^src" -T dot src | dot -T svg > internal-dependency-graph.svg
```

See [includeOnly](./options-reference.md#includeonly-only-include-modules-satisfying-a-pattern)
in the options reference for more details.

### `--focus`: show modules and their direct neighbours

You can use this e.g. to inspect one module or folder and see what the direct
dependencies are and which modules are direct dependents.

Takes a regular expression in the same fashion `--include-only`, `--exclude` and
`--do-not-follow` do.

```sh
dependency-cruise --include-only "^src" --focus "^src/main" -T dot src | dot -T svg > focus-on-main-dir-graph.svg
```

See [focus](./options-reference.md#show-modules-matching-a-pattern---with-their-direct-neighbours)
in the options reference for more details.

### `--collapse`: summarize to folder depth or pattern

If you feel the need for reporting on a higher level (e.g. on packages in a
mono repo, or the main folders in `src`) you can use the `--collapse` option. It
takes either a single digit or a regular expression.

#### --collapse: single digit

The most typical use for collapsing is to limit the folder depth. It is possible
to do this with regular expressions (see below, and in the
[options reference](./options-reference.md#reporteroptions)). As this case occurs
a lot you can pass

```sh
depcruise src --include-only ^src --collapse 2 -T dot | dot -T svg > collapsed.svg
```

> Under water dependency-cruiser translates the single digit into a regular
> expression again. For `2` e.g. it generates `/node_modules/[^/]+|^[^/]+\/[^/]+\//`

### --collapse: regular expression

If you need more flexibility, you can also pass a regular expression to --collapse.
E.g. to only collapse stuff under `node_modules` and `lib` (but not under e.g.
`test` and `src`) you can pass this:

```sh
depcruise src --do-not-follow node_modules --collapse "^(node_modules|lib)/[^/]+" -T dot | dot -T svg > collapsed.svg
```

`--collapse` works the same as the [dot/ archi specific collapsePattern option](#summarising-collapsepattern-dot-and-archi-reporters),
except it works for all reports instead of for only the dot and archi reporters.
This means you can not only use it to make graphical output look better, but also
to show simple textual output of relations between high level components e.g.

```sh
depcruise packages --include-only ^packages --collapse "^packages/[^/]+" -T text
```

### `--exclude`: exclude dependencies from being cruised

If you don't want to see certain modules in your report (or not have them
validated), you can exclude them by passing a regular expression to the
`--exclude` (short: `-x`) option. Two examples:

```sh
dependency-cruise -x "node_modules" -T html -f deps-without-node_modules.html src
```

```sh
dependency-cruise -x "^(coverage|test|node_modules)" -T html -f deps-without-stuffs.html src
```

See the [exclude](./options-reference.md#exclude-exclude-dependencies-from-being-cruised) option
in the options reference for details.

### `--max-depth`

Only cruise the specified depth, counting from the specified root-module(s). This
command was mostly useful in combination with visualisation output like _dot_ to
keep the generated output to a manageable size.

You probably don't want to use these as today better options exist that serve the
same goal and give better looking and more accurate results. E.g.:

- use the [`--collapse`](#--collapse-summarize-to-folder-depth-or-pattern) option
- use a [collapsePattern](./options-reference#summarising-collapsepattern-dot-and-archi-reporters)
  in conjunction with your dot reporter to hide details you don't want to see
  right now
- use filters like --include-only and --focus to only show a relevant part of your graph
- use the `archi` reporter that produces a high level dependency-graph based on
  heuristics.

```sh
dependency-cruise --max-depth 2 -T dot src/main/index.ts | dot -T svg > depth-limited-dependency-graph.svg
```

See [maxDepth](./options-reference.md#maxdepth)

> This will only be effective when you pass one file as an argument.

### `--progress`: get feedback on what dependency-cruiser is doing while it's running

If the number of files dependency-cruiser needs to analyse is large, it can be
busy for awhile. To get an impression of what dependency-cruiser is doing you
can pass the `--progress` option.

#### cli-feedback (the default when you pass --progress without an option)

Gives a one-line summary of what dependency-cruiser is currently doing
(e.g. parsing input, reading files, analyzing them, making a report about them).
When dependency-cruiser is done it erases that feedback again so it doesn't
clutter your logs. It also writes to stderr, so you can still safely redirect
without the progress messages ending up in your output.

<details>
<summary>Typical output</summary>

```
▶ reading files ...
```

</details>

#### performance-log

Writes a detailed overview of the time and memory each step in dependency-cruiser's
processing takes to stderr. The main purpose is to get a quick high-level overview
of what dependency-cruiser is spending its time (and memory) on, so the results
stay in view when dependency-cruiser is done.

<details>
<summary>Typical output</summary>

```
  elapsed heapTotal  heapUsed after step...
    712ms      72Mb      46Mb start of node process
      2ms      72Mb      46Mb parsing options
    100ms      73Mb      56Mb parsing rule set
      0ms      73Mb      56Mb making sense of files and directories
      0ms      73Mb      56Mb determining how to resolve
   1874ms     158Mb     138Mb reading files
      0ms     158Mb     138Mb analyzing
     17ms     161Mb     131Mb analyzing: cycles
      3ms     161Mb     132Mb analyzing: orphans
    161ms     163Mb     140Mb analyzing: reachables
      0ms     163Mb     140Mb analyzing: add focus (if any)
     51ms     163Mb     135Mb analyzing: validations
      2ms     163Mb     135Mb reporting
      0ms     163Mb     135Mb really done (2924ms)
```

</details>

#### none (the default when you don't pass --progress )

Make sure dependency-cruiser doesn't print any feedback. Usefull if you want to
override the progress option configured in a configuration file (currently
an undocumented feature that is subject to change).

### `--prefix` prefixing links

In the dot output prefix links to the source files with a string - useful to link to
e.g. an on line repository.

```sh
dependency-cruise --prefix "https://github.com/you/yourrepo/tree/master/" -T dot src | dot -T svg > dependency-graph-with-links-to-gh.svg
```

See [prefix](./options-reference.md#prefix-prefix-links-in-reports) in the options
reference for details.

### `--module-systems`

Here you can pass a list of module systems dependency-cruiser should use
to detect dependencies. It defaults to `amd, cjs, es6`.

See [moduleSystems](./options-reference.md#modulesystems) in the options reference.

### `--ts-pre-compilation-deps` (typescript only)

By default dependency-cruiser does not take dependencies between typescript
modules that don't exist after compilation to JavaScript. Pass this command
line switch to do take them into account.

For details see [tsPreCompilationDeps](./options-reference.md#tsprecompilationdeps) in the
options reference.

### `--ts-config`: use a typescript configuration file ('project')

If you use typescript and want dependency-cruiser to take the `baseDir`'s and/ or `paths`
in your tsconfig.json into account- can pass it with this option.

Although it's possible to pass it as a command line option, you typically
want to do this in a configuration file - see
[tsConfig](./options-reference.md#tsconfig-use-a-typescript-configuration-file-project)
section in the options reference for details.

> If you happen to use a [`jsconfig.json`](https://code.visualstudio.com/docs/languages/jsconfig)
> you can pass that as well - the syntax for tsconfig.json and jsconfig.json
> is identical for all practical purposes.

### `--webpack-config`: use (the resolution options of) a webpack configuration

With a webpack config you can drastically alter how module names resolve to
files on disk, a.o. with aliases. If you want dependency-cruiser to take that
into account (you probably do), you can pass the webpack config here.

However, just like with tsconfigs, you probably want to put this in a configuration
file - see the [webpackConfig](./options-reference.md#webpackconfig-use-the-resolution-options-of-a-webpack-configuration)
section in the options reference.

### `--preserve-symlinks`

Whether to leave symlinks as is or resolve them to their realpath. This option defaults
to `false` (which is also nodejs' default behavior since release 6).

You'll typically want to set this in the configuration file with the [preserveSymlinks](./options-reference.md#preservesymlinks)
option.

## depcruise-fmt

`depcruise-fmt` is a separate command line program, that takes the (json)
output of a dependency-cruise and runs one of the reporters over it. This
could be useful if you want to display the results of the same cruise in
different ways, without having to run the cruise repeatedly. Especially on
bigger code bases this can save time. Cruising all code can sometimes take
more than a minute, while formatting usually takes well below a second.

For instance, to report any violations to console, create a distributable
report _and_ generate a dependency graph. With just the `depcruise` command
this would look like

```sh
depcruise -v -T err-long src
depcruise -v -T err-html src -f violation-report.html
depcruise -v -T dot src | dot -T svg > dependency-graph.svg
```

With depcruise-fmt there's just one cruise and three quick depcruise-fmt commands

```sh
depcruise -v -T json src -f cruise_result.json
depcruise-fmt -T err-long cruise_result.json
depcruise-fmt -T err-html -f violation-report.html cruise_result.json
depcruise-fmt -T dot cruise_result.json | dot -T svg > dependency-graph.svg
```

### filters

You can also use the filters `--focus`, `--include-only` and `--exclude` to peruse
parts of the dependency-graph. This could be useful for chopping up humoungous
graphs efficiently, or to quickly find the uses of a module:

```sh
depcruise -v -T json src -f cruise_result.json
depcruise-fmt -T dot --focus "^src/main" cruise_result.json | dot -T svg > main.svg
depcruise-fmt -T dot --focus "^src/juggle" cruise_result.json | dot -T svg > juggle.svg
depcruise-fmt -T dot --include-only "^src/the-law" cruise_result.json | dot -T svg > the-law.svg

## or to find dependencies going into or departing from the spelunkme module
## and emitting them to stdout:
depcruise-fmt -T text --focus "^src/main/spelunkme\\.ts$" cruise_result.json
```

### collapse/ summarize

Summarize or collapse to either a folder depth or (if you're feeling fancy) a regular
expression. It works the same as the regular depcruise command's [`--collapse`](#--collapse-summarize-to-folder-depth-or-pattern) option.

### getting non-zero exit codes

If you want to see non-zero exit codes when there's error level dependency
violations, you can use the `--exit-code` (short: `-e`). This only works for
the output types that support non-zero exit codes (_err_, _err-long_ and
_TeamCity_). Example for the default output type (_err_):

```sh
depcruise-fmt -e cruise_result.json
```

### What --help will tell you

```
Usage: depcruise-fmt [options] <dependency-cruiser-json>

Format dependency-cruiser output json.
Details: https://github.com/sverweij/dependency-cruiser

Options:
  -f, --output-to <file>      file to write output to; - for stdout (default:
                              "-")
  -T, --output-type <type>    output type; e.g. err, err-html, dot, ddot, archi
                              or json (default: "err")
  -I, --include-only <regex>  only include modules matching the regex
  -F, --focus <regex>         only include modules matching the regex + their
                              direct neighbours
  -x, --exclude <regex>       exclude all modules matching the regex
  -S, --collapse <regex>      collapse the modules to the regex pattern E.g.
                              ^packages/[^/]+/ collapses to modules/ folders
                              directly under your packages folder. Or pass a
                              single digit (e.g. 2) to collapse to a folder
                              depth.
  -e, --exit-code             exit with a non-zero exit code when the input
                              json contains error level dependency violations.
                              Works for err, err-long and teamcity output types
  -V, --version               output the version number
  -h, --help                  display help for command
```

## depcruise-wrap-stream-in-html

With `depcruise-wrap-stream-in-html` you can wrap the graphical output of
GraphViz dot into html that is geared to make the graph easier to use. It a.o.
adds highlight-on-hover.

<img width="799" alt="highlight on hover" src="assets/highlight-on-hover.png">

Typical use:

```sh
depcruise -v -T dot src | dot -T svg | depcruise-wrap-stream-in-html > dependency-graph.html
```

This works for all dot-based reporters, including `archi` and `ddot`

Some examples:

- [Dependency-cruiser's own dependency graph](https://sverweij.github.io/dependency-cruiser/dependency-cruiser-dependency-graph.html)
- [yarn v2's high level dependency graph](https://sverweij.github.io/dependency-cruiser/assets/berry-high-level-dependencies.html)
  (`archi` reporter)
- [state-machine-cat's dependency graph](https://state-machine-cat.js.org/dependency-cruiser-graph.html)

## Daphne's dependencies - a gentle introduction

**[Daphne's dependencies](sample-output.md)**
sport a visual overview of all the output formats. It also shows how Daphne and
her colleagues use them in their workflow.
