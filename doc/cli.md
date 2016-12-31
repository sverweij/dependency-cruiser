# dependency-cruiser command line interface

Running with no parameters gets you help:
```

  Usage: dependency-cruise [options] <files-or-directories>

  Options:

    -h, --help                output usage information
    -V, --version             output the version number
    -i, --info                shows what languages and extensions
                              dependency-cruiser supports
    -v, --validate [file]     validate with rules in [file]
                              (default: .dependency-cruiser.json)
    -f, --output-to <file>    file to write output to; - for stdout
                              (default: -)
    -x, --exclude <regex>     a regular expression for excluding modules
    -M, --system <items>      list of module systems (default: amd,cjs,es6)
    -T, --output-type <type>  output type - html|dot|err|json
                              (default:json)
    -P --prefix <prefix>      prefix to prepend links with (e.g. in the
                              svg output type)
    --init-rules              create a .dependency-cruiser.json with basic
                              validations in the current folder.

```

## Output formats

### err
For use in build scripts, in combination with `--validate` e.g.

```sh
dependency-cruise -T err --validate my-depcruise-rules.json src
```

This will:
- ... print nothing and exit with code 0 if dependency-cruiser didn't
  find any violations of the rules in .dependency-cruiser.json.
- ... print the violating dependencies if there is any. Moreover it
  will exit with exit code _number of violations found_ in the same fasion
  linters and test tools do.

See the _dependency-cruise_ target in the [Makefile](https://github.com/sverweij/dependency-cruiser/blob/master/Makefile#L95)
for a real world example.

### dot
Supplying `dot` as output type will make dependency-cruiser write
a GraphViz dot format directed graph. Typical use is in concert
with _GraphViz dot_:

```shell
dependency-cruise -x "^node_modules" -T dot src | dot -T svg > dependencygraph.svg
```

### html
Write it to html with a dependency matrix instead:
```shell
dependency-cruise -T html -f dependencies.html src
```

### csv
If you supply `csv` it will write the dependency matrix to a comma
separated file - so you can import it into a spreadsheet program
and analyze from there.


## `--exclude`: exclude modules from being cruised

If you don't want to see certain modules in your report (or not have them
validated), you can exclude them by passing a regular expression to the
`--exclude` (short: `-x`) option. E.g. to exclude `node_modules` from being
scanned:

```sh
dependency-cruise -x "node_modules" -T html -f deps-without-node_modules.html src
```

Beacuse it's regular expressions, you can do more interesting stuff here as well. To exclude
all modules with a file path starting with coverage, test or node_modules, you could do this:

```sh
dependency-cruise -x "^(coverage|test|node_modules)" -T html -f deps-without-stuffs.html src
```

## `--validate`
Validates against a list of rules in a rules file. This defaults to a file
called `.dependency-cruiser.json`, but you can specify your own rules file.

```shell
dependency-cruise -T err -x node_modules --validate my.rules.json
```

The file specifies a bunch of regular expressions pairs your dependencies
should adhere to.

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

### `--prefix` prefixing links
If you want the links in the svg output to have a prefix (say,
`https://github.com/you/yourrepo/tree/master/`) so when you click them you'll
open the link on github instead of the local file - pass that after the
`--prefix` option.

```sh
depcruise --prefix https://github.com/sverweij/dependency-cruiser/tree/develop/ -T dot -x node_modules src | dot -T svg > dependencies.svg
```

### `--info` showing what alt-js are supported

Which alt-js languages dependency-cruiser supports depends on the availability
it has to them. To see how dependency-cruiser perceives its environment use
`depcruise --info` (any arguments are ignored). A typical output will look
like this:

```
Supported:

  If you need a supported, but not enabled transpiler ('✖' below) just install
  it in the same folder dependency-cruiser is installed. E.g. 'npm i livescript'
  will enable livescript support if it's installed in your project folder.

Transpilers:

  ✔ javascript (>es1)
  ✔ coffee-script (>=1.0.0 <2.0.0)
  ✖ livescript (>=1.0.0 <2.0.0)
  ✔ typescript (>=2.0.0 <3.0.0)

Extensions:

  ✔ .js
  ✔ .ts
  ✔ .d.ts
  ✖ .ls
  ✔ .coffee
  ✔ .litcoffee
  ✔ .coffee.md
```

### Cruising multiple files and directories in one go
Just pass them as arguments. This, e.g. will cruise every file in the folders
src, test and lib (recursively)+ the file called index.ts in the root.

```sh
depcruise --output-type dot src test lib index.ts
```

## Daphne's dependencies - a gentle introduction
**[Daphne's
dependencies](sample-output.md)**
sport a visual overview of all the output formats. It also shows how Daphne and
her colleagues use them in their workflow.
