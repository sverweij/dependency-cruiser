# FAQ

- [Troubleshooting](#troubleshooting)
- [Features](#features)
- [Expanding dependency-cruiser](#expanding-dependency-cruiser)
- [Roadmap](#roadmap)
- [Contact](#contact)

## Troubleshooting

### Q: TypeScript, coffeescript or livescript dependencies don't show up. How can I fix that?

**A**: Install the compiler you use in the same spot dependency-cruiser is installed (or vv).

Dependency-cruiser doesn't come shipped with the necessary transpilers to
handle these languages. In stead it uses what is already available in the
environment (see [below](#q-does-this-mean-dependency-cruiser-installs-transpilers-for-all-these-languages)).
You can check if the transpilers are available to dependency-cruiser by
running `depcruise --info`.

When it turns out they aren't yet:

- if you're runnning dependency-cruiser as a global install, install
  the necessary transpilers globally as well.
- if you're running dependency-cruiser as a local (development-)
  dependency, install the necessary transpilers there.

For some types of TypeScript dependencies you need to flip a switch,
which is what the next question is about:

### Q: Some TypeScript dependencies I'd expect don't show up. What gives?

**A**: Put `"tsPreCompilationDeps" : true` in the `options` section of your
dependency-cruiser configuration (`.dependency-cruiser.json` or
`.dependency-cruiser.js`) or use `--ts-pre-compilation-deps` on the
command line.

By default dependency-cruiser only takes post-compilation dependencies into
account; dependencies between TypeScript modules that exist after compilation
to javascript. Two types of dependencies do not fall into this category

- imports that aren't used (yet)
- imports of types only

If you _do_ want to see these dependencies, do one of these:

- if you have a dependency-cruiser configuration file, put `"tsPreCompilationDeps" : true`
  in the `options` section.
- pass `--ts-pre-compilation-deps` as a command line option

See [--ts-pre-compilation-deps](./cli.md#--ts-pre-compilation-deps-TypeScript-only)
for details and examples.

### Q: Some TypeScript dependencies _still_ don't show up (`/// tripple slash directives`)

**_A_**: By default dependency-cruiser ignores TypeScript's tripple slash directives.
To ensure it _does_ detect them:

- Switch TypesScript pre-compilation dependencies on (see previous question)
- Do one of the following
  - if you have a dependency-cruiser configuration file, add the tripple slash directive
    module system to the array of module systems e.g.
    ```json
     "moduleSystems": ["amd", "cjs", "es6", "tsd"]
    ```
  - pass `tsd` with the `--module-systems` on the command line e.g.
    ```
    depcruise -T dot --module-systems amd,cjs,es6,tsd
    ```

> It might be more intuitive to do have these directives detected by default, so
> in a future (major) version of dependency-cruiser, this might be happening.
> It'd be a breaking change, though so for now you'll have to be
> explicit with these.

### Q: The graph dependency-cruiser generates is humoungous, and I can't follow the lines very well what can I do?

**A**: Usually you don't need to see _all_ modules and dependencies that make up
your app at the same time. It can e.g. be helpfull to make separate graphs for
each of the `packages` in your monorepo. That won't solve all readability issues,
though, so dependency-cruiser has a few options to get you sorted:

#### Filtering

The `--include-only`, `exclude`, `--do-not-follow` (and for more extreme measures
`--max-depth`) command line options and their configuration file equivalents
provide various ways to

#### Bonus: separate config for your graph

Instead of tweaking command line parameters each time with these filtering options,
you can make a seperate configuration file that extends the one you use for
validation, e.g. like so:

```js
module.exports = {
    // The 'extends' ensures things configured for your validation also apply
    // to the graph you generate as well.
    extends: "./.dependency-cruiser.js",
    options: {
        includeOnly: "^src/",
        exclude: "node_modules|\\.spec\\.ts$|\\.mock\\.ts$",
        doNotFollow: {
            "path": "^src/report"
            // these are the dependencyTypes dependency-cruiser's
            // generated config does not follow by default
            dependencyTypes: [
                "npm",
                "npm-dev",
                "npm-optional",
                "npm-peer",
                "npm-bundled",
                "npm-no-pkg"
            ]
        }
    }
}
```

Run with

```sh
dependency-cruiser --config .dependency-cruiser-graph.js --output-type dot src | dot -T svg >
```

#### Folder level dependency graph

For a birds-eye view, you can use the `ddot` reporter that summarizes dependencies
on a folder level:

```sh
dependency-cruiser --config .dependency-cruiser.js --output-type ddot -- src | dot -T svg > folder-level-dependency-graph.svg
```

#### Make dot render orthogonal edges instead of splines

Some of the examples you see in the documentation have orthogonal edges, instead
of splines. Sometimes this will improve legibility quite a bit. To achive that pass
`-Gsplines=ortho` to dot, e.g. in a complete incantation:

```sh
depcruise --config .dependency-cruiser-graph.js --output-type dot -- src | dot -Gsplines=ortho -T svg > dependency-graph-with-orthogonal-edges.svg
```

The reason it's not the default for the dot reporter output is that it isn't guaranteed
to render a graph, so YMMV.

### Q: TypeScript dynamic imports show up as "✖" . What's up there?

**A**: You're using a version of depedendency-cruiser < 4.17.0. Dynamic imports,
both in TypeScript and Javascript are supported as of version 4.17.0 -
and ✖'s in the output should be a thing of the past.

> Before dependency-cruiser@4.17.0 this instruction was in place:
>
> By default dependency-cruiser uses _ES2015_ as compilation target to figure out
> what your TypeScript sources look like. That does not play nice with dynamic
> imports. Chances are you already have a `tsconfig.json` with a configuration
> that makes your TypeScript compiler happy about compiling dynamic imports.
> If so: feed it to dependency-cruiser with the `--ts-config` command line
> parameter and dependency-cruiser will attempt to resolve the dynamic imports -
> which will work as long as you're not importing variables (or expressions).

## Features

### Q: How do I enable TypeScript, CoffeeScript or LiveScript in dependency-cruiser?

**A**: You don't. They work out of the box, as long as it has the
necessary compilers at its disposal.

### Q: I'm developing in React and use jsx/ tsx/ csx/ cjsx. How do I get that to work?

**A**: jsx and its TypeScript and coffeescript variants work
out of the box as well.

### Q: Does this work with vue as well?

**A**: Yes.

### Q: Does this mean dependency-cruiser installs transpilers for all these languages?

**A**: No.

For LiveScript, TypeScript and CoffeeScript dependency-cruiser will use the
transpiler already in your project (or, if you installed dependency-cruiser
globally - the transpilers available globally).

This has a few advantages over bundling the transpilers as dependencies:

- `npm i`-ing dependency-cruiser will be faster.
- Transpilers you don't need won't land on your disk.
- Dependency-cruiser will use the version of the transpiler you are using
  in your project (which might not be the most recent one for valid reasons).

### Q: Does this work with webpack configs (e.g. `alias` and `modules`)?

**A**: Yes.

You can feed dependency-cruiser a webpack configuration
([`--webpack-config`](./doc/cli.md#--webpack-config-use-the-resolution-options-of-a-webpack-configuration)
on the cli or `webpackConfig` in the dependency-cruiser config file
in the [`options`](./doc/rules.md#options) section) and it
will take the `resolve` part in there into account when cruising
your dependencies. This includes any `alias` you might have in there.

Currently dependency-cruiser supports a reasonable subset of webpack
config file formats:

- nodejs parsable javascript only
- webpack 4 compatible and up (although earlier ones _might_ work
  there's no guarantee)
- exporting either:
  - an object literal
  - a function (webpack 4 style, taking up to two parameters)
  - an array of the above (where dependency-cruiser takes the
    first element in the array)

Support for other formats (promise exports, TypeScript, fancier
ecmascript) might come later.

### Q: Does dependency-cruiser detect [dynamic imports](https://github.com/tc39/proposal-dynamic-import)?

**A**: Yes; in both TypeScript and javascript - but only with static string arguments
or template expressions that don't contain no placeholders (see the next question).
This should cover most of the use cases for dynamic
imports that leverage asynchronous module loading (like [webpack code splitting](https://webpack.js.org/guides/code-splitting/#dynamic-imports)), though.

### Q: Does dependency-cruiser handle variable or expression requires and imports?

**A**: No.

If you have imports with variables (`require(someVariable)`,
`import(someOtherVariable).then((pMod) => {...})`) or expressions
(`require(funkyBoolean ? 'lodash' : 'underscore'))`
in your code dependency-cruiser won't be able to determinewhat dependencies
they're about. For now dependency-cruiser focusses on doing static analysis
only and doing that well.

### Q: Does it work with my monorepo?

**A**: Absolutely. For every cruised module the closest `package.json` file is used to determine
if a package was declared as dependency.

### Q: Does dependency-cruiser work with Yarn Plug'n'Play?

**A**: Yes.

From version 4.14.0 dependency-cruiser supports yarn pnp out of the box -
just specify it in your dependency-cruiser configuration with the
_externalModuleResolutionStrategy_ key:

```json
"externalModuleResolutionStrategy": "yarn-pnp"
```

> For earlier versions (up to 4.6.1) you did have to pass a webpack config that
> that had the pnp resolver plugin configured.

### Q: dependency-cruiser detected a circular dependency. How can I see (one of the) cycles that dependency-cruiser saw?

**A**: Upgrade to version 5.2.0 or higher - from that version on dependency-cruiser
emits the circular path in the _err_, _err-long_, _err-html_ and
_teamcity_ reporters.

### Q: I'm using window.require or a require wrapper - how do I make sure dependencies I declared like that are included?

**A**: Add a _exoticRequireStrings_ key in your configuration with the 

```json
"exoticRequireStrings": ["window.require"]
```

## Expanding dependency-cruiser

### Q: How do I add a new output format?

**A**: Like so:

- In `src/report`:
  - add a module that exports a default function that
    - takes a dependency cruiser output object
      ([json schema](../src/extract/results-schema.json))
    - returns an object with
      - output: the output you want the cli to emit
      - exitCode: the exit code you want the cli to return when
        the report is done
- In `report/index.js`
  - require that module and
  - add a key to the to the `TYPE2REPORTER` object with that module as value
- In `bin/dependency-cruise`
  - add it to the documentation of the -T option
- In `test/report` add unit tests that prove your reporter does what it
  intends.

### Q: How do I add support for my favorite alt-js language?

**A**: Ask me nicely or make a PR.

Dependency-cruiser already supports TypeScript, CoffeeScript and LiveScript. If
there's another language (that transpiles to javascript) you'd like to see
support for, let me know.

Recipe for PR's to add an alt-js language:

- In `package.json`:
  - add your language (and supported version range) to the `supportedTranspilers`
    object.
  - Add your language's transpiler to `devDependencies` (you'll need that,
    because you are going to write tests that prove the addition works
    correctly later on).
- In `src/transpile`
  - add a `yourLanguageWrap.js` that invokes the transpiler transforming
    your language into javascript (preferably ES6 or better, but lower versions
    should work as well). [`typeScriptWrap.js`](../src/extract/transpile/typeScriptWrap.js)
    as an example on how to do this.
  - in [`meta.js`](../src/extract/transpile/meta.js)
    - require `./yourLanguageWrap` and
    - add it to the `extension2wrapper` object with the extensions proper for your
      language.
- In `test/extract/transpile` add unit tests for `yourLanguageWrap`

## Roadmap

[Here](https://github.com/sverweij/dependency-cruiser/projects/1)

## Contact

If you have an issue, suggestion - don't hesitate to create an
[issue](https://github.com/sverweij/dependency-cruiser/issues/new).

You're welcome to create a pull request - if it's something more complex it's
probably wise to first create an issue or hit
[@depcruise](https://twitter.com/depcruise) up on twitter.

For things that don't fit an issue or pull request you're welcome to
contact the [@depcruise](https://twitter.com/depcruise) twitter account as well
(checked at approximately daily intervals).
