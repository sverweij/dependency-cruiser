
# dependency-cruiser command line interface

### Contents
1. [`--help`/ no parameters](#--help--no-parameters)
2. [`--output-type`: specify the output format](#--output-type-specify-the-output-format)
3. [`--do-not-follow`: don't cruise modules adhering to this pattern any further](#--do-not-follow-dont-cruise-modules-adhering-to-this-pattern-any-further)
4. [`--exclude`: exclude modules from being cruised](#--exclude-exclude-modules-from-being-cruised)
5. [`--max-depth`](#--max-depth)
6. [`--config`/ `--validate`](#--config---validate)
7. [`--init`](#--init)
8. [`--prefix` prefixing links](#--prefix-prefixing-links)
9. [`--info` showing what alt-js are supported](#--info-showing-what-alt-js-are-supported)
10. [`--module-systems`](#--module-systems)
11. [`--ts-pre-compilation-deps` (typescript only)](#--ts-pre-compilation-deps-typescript-only)
12. [`--ts-config`: use a typescript configuration file ('project')](#--ts-config-use-a-typescript-configuration-file-project)
13. [`--preserve-symlinks`](#--preserve-symlinks)
14. [`--webpack-config`: use (the resolution options of) a webpack configuration`](#--webpack-config-use-the-resolution-options-of-a-webpack-configuration)
15. [arguments](#arguments)


### `--help` / no parameters
Running with no parameters gets you help.


### `--output-type`: specify the output format

#### err
For use in build scripts, in combination with `--validate` e.g.

```sh
dependency-cruise --validate my-depcruise-rules.json src
```

This will:
- ... print nothing and exit with code 0 if dependency-cruiser didn't
  find any violations of the rules in .dependency-cruiser.json.
- ... print the violating dependencies if there is any. Moreover it
  will exit with exit code _number of violations found_ in the same fasion
  linters and test tools do.

See the _dependency-cruise_ target in the [Makefile](https://github.com/sverweij/dependency-cruiser/blob/master/Makefile#L95)
for a real world example.

#### dot
Supplying `dot` as output type will make dependency-cruiser write
a GraphViz dot format directed graph. Typical use is in concert
with _GraphViz dot_:

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

### `--do-not-follow`: don't cruise modules adhering to this pattern any further
If you _do_ want to see certain modules in your reports, but are not interested
in these modules' dependencies, you'd pass the regular expression for those
modules to the `--do-not-follow` (short: `-X`) option. A typical pattern you'd
use with this is "node_modules":

```sh
dependency-cruise -X "^node_modules" -T html -f deps-with-unfollowed-node_modules.html src
```

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

### `--max-depth`
Only cruise the specified depth, counting from the specified root-module(s). This
command is mostly useful in combination with visualisation output like _dot_ to
keep the generated output to a manageable size.

Although totally up to you I advise you to not use this with the `err` reporter;
you'll probably miss validating a dependency or two.

This will cruise the dependencies of each file directly in the src folder, up
to a depth of 1:
```sh
dependency-cruise --max-depth 1 -T dot bin/dependency-cruise | dot -T png > dependency-cruiser-max-depth-1.png
```

<img width="237" alt="max depth = 1" src="real-world-samples/dependency-cruiser-max-depth-1.png">

With `--max-depth 2` it'll look like this:

<img width="390" alt="max depth = 2" src="real-world-samples/dependency-cruiser-max-depth-2.png">

And with `--max-depth 3` like this:


<img width="623" alt="dependency-cruiser cruised with max depth 3" src="real-world-samples/dependency-cruiser-max-depth-3.png">


### `--config`/ `--validate`
Validates against a list of rules in a configuration file. This defaults to a file
called `.dependency-cruiser.json` (/ `.dependency-cruiser.js`), but you can
specify your own rules file, which can be in json format or a valid node
module returning a rules object literal.

```shell
dependency-cruise -x node_modules --validate my.rules.json src spec
```

> _Tip_: usually you don't need to specify the rules file. However if run
> `depcruise --validate src`, _src_ will be interpreted as the rules file.
> Which is probably is not what you want. To prevent this, place `--`
> after the last option, like so:
> ```
> dependency-cruise --validate -- src
> ```


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

For more information about writing rules see the [tutorial](rules-tutorial.md) and the
[rules-reference](rules-reference.md). For an easy set up use ...


### `--init`
This asks some questions and depending on the answers creates a dependency-cruiser
configuration with some useful rules in it to the current folder and exits.
use with `--validate`

Some of the rules that will be in the configuration (either directly or from a
preset):

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

### `--module-systems`
Here you can pass a list of module systems dependency-cruiser should use
to detect dependencies. It defaults to `amd, cjs, es6`.

### `--ts-pre-compilation-deps` (typescript only)
By default dependency-cruiser does not take dependencies between typescript
modules that don't exist after compilation to javascript. Pass this command
line switch to do take them into account.

#### Pre-compilation dependencies example: only importing a type
As the javascript doesn't really know about types, dependencies on
types only exist before, but not after compile time.

`a.ts` exports an interface ...
```typescript
import { B } from './b';
export interface A {
  foo: string;
}
const b = new B();
```
... and `b.ts` uses that interface:
```typescript
import { A } from './a';
export class B {};
const a: A = {foo: "foo"};
```

After compilation `b.js` looks like this:
```javascript
// import omitted as it only contained a reference to a type
export class B { };
const a = { foo: "foo" }; // no type refer
```

Normally, without `--ts-pre-compilation-deps` the output will
look like this:
<img alt="'no import use' with typescript pre-compilation dependencies" src="real-world-samples/only-types-without-pre-compilation-deps.png">

_With_ `--ts-pre-compilation-deps` the dependency graph _does_ include the
dependency-on-a-type-only from `b.ts` to `a.ts`:

<img alt="'no import use' with typescript pre-compilation dependencies" src="real-world-samples/only-types-with-pre-compilation-deps.png">

#### Pre-compilation dependencies example: import without use

Similarly, if you import something, but don't use it, the dependency
only exists before compilation. Take for example these two
typescript modules:

`a.ts`:
```typescript
import { B } from './b';
export class A {
}
```

`b.ts`:
```typescript
export class B {
}
```

As `a.ts` uses none of the imports from b, the typescript
compiler will omit them when compiling and yield this for `a.js`:
```javascript
// no imports here anymore...
export class A {
}
```
Hence, without `--ts-pre-compilation-deps` dependency-cruiser's
output will look like this:

<img alt="'no import use' without typescript pre-compilation dependencies" src="real-world-samples/no-use-without-pre-compilation-deps.png">

... and with `--ts-pre-compilation-deps` like this:

<img alt="'no import use' with typescript pre-compilation dependencies" src="real-world-samples/no-use-with-pre-compilation-deps.png">

### `--ts-config`: use a typescript configuration file ('project')
If dependency-cruiser encounters typescript, it compiles it to understand what it
is looking at. If you have `compilerOptions` in your `tsconfig.json` you think
it should take into account, you can use this option to make it do that.
You might want to do this e.g. if you have `baseDir`/ `paths` keys in your
`tsconfig`, are using
[dynamic imports](./faq.md#typescript-dynamic-imports-show-up-as-x--whats-up-there)
or jsx/ tsx outside of a react context.

Dependency-cruiser understands the `extends` configuration in tsconfig's so
if you have a hierarchy of configs, you just need to pass the relevant one.

```sh
### use the `tsconfig.json` in the current directory into account when looking
### at typescript sources:
depcruise --ts-config --validate src

### use `tsconfig.prod.json for the same purpose:
depcruise --ts-config tsconfig.prod.json --validate src
```

Useful things to know:
- The configuration file you can pass as an argument to this option is
  relative to the current working directory.
- As an alternative to this command line parameter you can pass the
  typescript project file name in in your .dependency-cruiser.json like this:
  ```json
  "options": {
    "tsConfig": {
      "fileName": "tsconfig.json"
    }
  }
  ```
  or even more minimalistically like so (in which case dependency-cruiser will
  assume the fileName to be `tsconfig.json`)
  ```json
  "options": {
    "tsConfig": {}
  }
  ```

> note: dependency-cruiser currently only looks at the `compilerOptions` key
> in the tsconfig.json and not at other keys (e.g. `files`, `include` and
> `exclude`).

### `--preserve-symlinks`
Whether to leave symlinks as is or resolve them to their realpath. This option defaults
to `false` (which is also nodejs' default behavior since release 6).

### `--webpack-config`: use (the resolution options of) a webpack configuration
Dependency-cruiser will pluck the `resolve` key from the configuration
use the information to resolve files on disk.

Useful things to know:
- The configuration file you can pass as an argument to this option is
  relative to the current working directory.
- As an alternative to this command line parameter you can pass the
  webpack config file name in in your .dependency-cruiser.json like this:
  ```json
  "options": {
    "webpackConfig": {
      "fileName": "webpack.config.js",
    }
  }
  ```
  This also allows you to pass additional parameters in case your
  webpack config exports a function instead of an object literal.
- If your webpack configuration exports a function, you can provide the
  parameters in .dependency-cruiser.json in the webpackConfig section
  ```json
  "options": {
    "webpackConfig": {
      "env": { "production": true },
      "arguments": { "mode": "production" }
    }
  }
  ```
- If your webpack config exports an array of configurations,
  dependency-cruiser will only use the resolve options of the first
  configuration in that array.

If you're a webpack user and you have a `resolve` key in your webpack
config you probably already know what happens with this. If not (or if
you're curious) see the [webpack resolve](https://webpack.js.org/configuration/resolve/)
documentation for details.

### arguments
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

## Daphne's dependencies - a gentle introduction
**[Daphne's
dependencies](sample-output.md)**
sport a visual overview of all the output formats. It also shows how Daphne and
her colleagues use them in their workflow.
