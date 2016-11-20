# dependency cruiser
visualize javascript dependencies. ES6, CommonJS, AMD.

```
Usage: dependency-cruise [options] <directory-or-file>

Options:

  -h, --help                output usage information
  -V, --version             output the version number
  -f, --output-to <file>    file to write output to; - for stdout (default: -)
  -x, --exclude <regex>     a regular expression for excluding modules
  -M, --system <items>      list of module systems (default: amd,cjs,es6)
  -T, --output-type <type>  output type - html|dot|csv|json (default:json)
  -v, --validate            validate against rules in .dependency-cruiser.json
  -r, --rules-file <file>   read rules from <file> (default: .dependency-cruiser.json)
```

## Installation
Dependency cruiser works most comfortably if you install it globally

```
npm install --global dependency-cruiser
```

## Basic usage
To dump all the dependencies in `src` to stdout in json format:

```shell
dependency-cruise src
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
a GraphViz dot format directed graph.

### json
The default.

## Validation
Validates against a list of rules in a rules file. This defaults to a file
called `.dependency-cruiser.json`, but you can specify your own rules file
with `--rules-file`.

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

A more elaborate configuration:
- modules in `src` can get stuff from `src` and `node_modules`
- modules in `src` can not get stuff from test
- stuff in `node_modules` can call anything, except stuff
  we wrote ourselves (in `src`, `bin` and `lib`)
- modules with the pattern `no-deps-at-all-plz` in their name
  can't have dependencies to any module.
- modules with the pattern `no-external-deps-plz` can't have
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
            "to": "^test"
        },{
            "from": "no-deps-at-all-plz",
            "to": ".+"
        },{
            "from": "no-external-deps-plz",
            "to": "node_modules"
        },{
            "from": "node_modules",
            "to": "^(src|test|lib)",
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
