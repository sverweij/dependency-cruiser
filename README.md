# Dependency cruiser ![Dependency cruiser](https://raw.githubusercontent.com/sverweij/dependency-cruiser/master/doc/assets/ZKH-Dependency-recolored-160.png)
_Visualize and validate javascript dependencies. With your rules._ ES6, CommonJS, AMD.

![Snazzy dot output to whet your appetite](https://raw.githubusercontent.com/sverweij/dependency-cruiser/master/doc/assets/sample-dot-output.png)

## Installation
Dependency cruiser works most comfortably when you install it globally.

```
npm install --global dependency-cruiser
```

## Daphne's dependencies - a gentle introduction
Head over to **[Daphne's
dependencies](https://github.com/sverweij/dependency-cruiser/blob/master/doc/sample-output.md)**
to get an overview of all the output formats. And how Daphne uses it all. And
how she uses the awesome _validation_ in her workflow. Go on. Read it. Or would
you rather prefer continue the boring recount of a README written with
_reference doc_ in mind?

## Basic usage
To dump all the dependencies in `src` to into a dependency matrix you can
open in your browser:

```shell
dependency-cruise -T html -f deps.html src
```

Running with no parameters gets you help:
```
Usage: dependency-cruise [options] <directory-or-file>

Options:

  -h, --help                output usage information
  -V, --version             output the version number
  -f, --output-to <file>    file to write output to; - for stdout (default: -)
  -x, --exclude <regex>     a regular expression for excluding modules
  -M, --system <items>      list of module systems (default: amd,cjs,es6)
  -T, --output-type <type>  output type - html|dot|csv|err|json (default:json)
  -v, --validate            validate against rules in .dependency-cruiser.json
  -r, --rules-file <file>   read rules from <file> (default: .dependency-cruiser.json)
```

## Output formats
### html
Write it to html with a dependency matrix instead:
```shell
dependency-cruise -T html -f dependencies.html src
```

### csv
If you supply `csv` it will write the dependency matrix to a comma
separated file - so you can import it into a spreadsheet program
and analyze from there.

### dot
Supplying `dot` as output type will make dependency-cruiser write
a GraphViz dot format directed graph. Typical use is in concert
with _GraphViz dot_:

```shell
dependency-cruise -x "^node_modules" -T dot src | dot -T svg > dependencygraph.svg
```

### err
For use in build scripts, in combination with `--validate` and/ or
`--rules-file` e.g.

```sh
dependency-cruise -T err --rules-file my-depcruise-rules.json src
```

This will:
- ... print nothing and exit with code 0 if dependency-cruiser didn't
  find any violations of the rules in .dependency-cruiser.json.
- ... print the violating dependencies if there is any. Moreover it
  will exit with exit code _number of violations found_ in the same fasion
  linters and test tools do.

See the _dependency-cruise_ target in the [Makefile](https://github.com/sverweij/dependency-cruiser/blob/master/Makefile#L78) for a real world
example.

## Excluding modules from being cruised: --exclude

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


## Validation
Validates against a list of rules in a rules file. This defaults to a file
called `.dependency-cruiser.json`, but you can specify your own rules file
with `--rules-file`.

```shell
dependency-cruise -T err -x node_modules -v --rules-file my.rules.json
```

The file specifies a bunch of regular expressions pairs your dependencies
should adhere to.

A simple validation configuration that forbids modules in `src` to use stuff
in the `test` folder and allows everything else:

```json
{
    "forbidden": [{
        "from": "^src",
        "to": "^test"
    }]
}
```

You can optionally specify a name and an error severity ('error',  'warning' (the
default) and 'information') with them that will appear in some reporters:

```json
{
    "forbidden": [{
        "name": "no-src-to-test",
        "severity": "error",
        "from": "^src",
        "to": "^test"
    }]
}
```

A more elaborate configuration:
- modules in `src` can get stuff from `src` and `node_modules`
- modules in `src` can not get stuff from test
- stuff in `node_modules` can call anything, except stuff
  we wrote ourselves (in `src`, `bin` and `lib`)
- modules with the pattern `no-deps-at-all-plz` in their name
  can't have dependencies to any module.
- modules with the pattern `externalDependencyLess\.js` can't have
  dependencies to stuff in `node_modules`.


```json
{
    "allowed": [{
            "from": "^src",
            "to": "^(src|node_modules)"
        },{
            "from": "^src",
            "to": "^(fs|path)$",
            "comment": "other core modules don't make sense for the current project"
        },{
            "from": "^node_modules",
            "to": ".+",
            "comment": "outside our circle of influence"
        }
    ],
    "forbidden": [{
            "from": "^src",
            "to": "^test",
            "name": "no-src-to-test",
            "severity": "error"
        },{
            "from": "dependencyless\\.js",
            "to": ".+",
            "comment": "severity & name default to 'severity' and 'unnamed'"
        },{
            "from": "externalDependencyLess\\.js",
            "to": "node_modules",
            "severity": "warning"
        },{
            "from": "node_modules",
            "to": "^(src|test|lib)",
            "name": "external-depends-on-you",
            "severity": "error",
            "comment": "well, you never know ..."
        }
    ]
}
```

### --rules-file implies --validate
Because if you supply a rules file, you probably intend them to
be used in validation, dependency-cruiser assumes `--validate`
to be passed even if it wasn't.

## License
[MIT](LICENSE)

## Thanks
- [Marijn Haverbeke](http://marijnhaverbeke.nl) and other people who
  colaborated on [acorn](https://github.com/ternjs/acorn) -
  the excelent javascript parser dependecy-cruiser uses to infer
  dependencies.

[![build status](https://gitlab.com/sverweij/dependency-cruiser/badges/develop/build.svg)](https://gitlab.com/sverweij/dependency-cruiser/commits/develop)
[![coverage report](https://gitlab.com/sverweij/dependency-cruiser/badges/develop/coverage.svg)](https://gitlab.com/sverweij/dependency-cruiser/commits/develop)
[![bitHound Overall Score](https://www.bithound.io/github/sverweij/dependency-cruiser/badges/score.svg)](https://www.bithound.io/github/sverweij/dependency-cruiser)
