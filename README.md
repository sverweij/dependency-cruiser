# dependency cruiser
visualize javascript dependencies. ES6, CommonJS, AMD.

```
  Usage: dependency-cruise [options] <directory-or-file>

  Options:

    -h, --help               output usage information
    -V, --version            output the version number
    -f, --output-to <file>   Makefile to output to (default: Makefile)
    -x, --exclude <regex>    a regular expression for excluding modules
    -M, --system <items>     list of module systems (default: amd,cjs,es6)
    -T, --output-type <type> output type - html|dot|json (default:json)
```


[![build status](https://gitlab.com/sverweij/dependency-cruiser/badges/develop/build.svg)](https://gitlab.com/sverweij/dependency-cruiser/commits/develop)
[![coverage report](https://gitlab.com/sverweij/dependency-cruiser/badges/develop/coverage.svg)](https://gitlab.com/sverweij/dependency-cruiser/commits/develop)
