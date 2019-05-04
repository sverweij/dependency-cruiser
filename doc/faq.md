# FAQ

## Features
### How do I enable TypeScript, CoffeeScript or LiveScript in dependency-cruiser?
You don't. They work out of the box, as long as it has the
necessary compilers at its disposal.

### I'm developing in React and use jsx/ tsx/ csx/ cjsx. How do I get that to work?
jsx and its typescript and coffeescript variants work
out of the box as well.

### Does this work with vue as well?
Yes.

### Does this mean dependency-cruiser installs transpilers for all these languages?
No.

For LiveScript, TypeScript and CoffeeScript dependency-cruiser will use the
transpiler already in your project (or, if you installed dependency-cruiser
globally - the transpilers available globally).

This has a few advantages over bundling the transpilers as dependencies:
- `npm i`-ing dependency-cruiser will be faster.
- Transpilers you don't need won't land on your disk.
- Dependency-cruiser will use the version of the transpiler you are using
  in your project (which might not be the most recent one for valid reasons).

### Does this work with webpack configs (e.g. `alias` and `modules`)?
Yes.

You can feed dependency-cruiser a webpack configuration 
([`--webpack-config`](./doc/cli.md#--webpack-config-use-the-resolution-options-of-a-webpack-configuration)
on the cli or `webpackConfig` .dependency-cruiser.json's 
[`options`](./doc/rules.md#options) section) and it
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

Support for other formats (promise exports, typescript, fancier
ecmascript) might come later.

### Does it work with my monorepo?

Absolutely. For every cruised module the closest `package.json` file is used to determine
if a package was declared as dependency.

### You ever heard of Yarn Plug'n'Play? When are you going to support it?
Yarn Plug'n'Play (_pnp_) works since version 4.6.1, but you did have to
pass a webpack config that had the pnp resolver plugin configured.

From version 4.14.0 dependency-cruiser supports yarn pnp out of the box -
just specify it in your dependency-cruiser configuration with the 
_externalModuleResolutionStrategy_ key:
```json
"externalModuleResolutionStrategy": "yarn-pnp"
```

## Troubleshooting
### Typescript, coffeescript or livescript dependencies don't show up. How can I fix that?

Dependency-cruiser doesn't come shipped with the necessary transpilers to
handle these languages. In stead it uses what is already available in the 
environment (see above). You can check if the transpilers 
are available to dependency-cruiser by running `depcruise --info`.

When it turns out they aren't yet:

- if you're runnning dependency-cruiser as a global install, install
  the necessary transpilers globally as well.
- if you're running dependency-cruiser as a local (development-)
  dependency, install the necessary transpilers there.

For some types of typescript dependencies you need to flip a switch,
which is what the next question is about:

### Some Typescript dependencies I'd expect don't show up. What gives?
#### TL;DR
Use `--ts-pre-compilation-deps` or put `"tsPreCompilationDeps" : true` in
the `options` section of your `.dependency-cruiser.json`

#### Longer
By default dependency-cruiser only takes post-compilation dependencies into
account; dependencies between typescript modules that exist after compilation
to javascript. Two types of dependencies do not fall into this category
- imports that aren't used (yet)
- imports of types only

If you _do_ want to see these dependencies, do one of these:
- pass `--ts-pre-compilation-deps` as a command line option
- if you have a `.dependency-cruiser.json`, put `"tsPreCompilationDeps" : true` in
the `options` section.

See [--ts-pre-compilation-deps](./cli.md#--ts-pre-compilation-deps-typescript-only)
for details and examples.

### Typescript dynamic imports show up as "✖" . What's up there?
You're using a version of depedendency-cruiser < 4.17.0. Dynamic imports,
both in Typescript and Javascript are supported as of version 4.17.0 -
and ✖'s in the output should be a thing of the past.

> Before dependency-cruiser@4.17.0 this instruction was in place:
>
> By default dependency-cruiser uses _ES2015_ as compilation target to figure out
> what your typescript sources look like. That does not play nice with dynamic
> imports. Chances are you already have a `tsconfig.json` with a configuration
> that makes your typescript compiler happy about compiling dynamic imports.
> If so: feed it to dependency-cruiser with the `--ts-config` command line 
> parameter and dependency-cruiser will attempt to resolve the dynamic imports -
> which will work as long as you're not importing variables (or expressions).

### Does dependency-cruiser handle variable or expression requires and imports?
If you have imports with variables (`require(someVariable)`,
`import(someOtherVariable).then((pMod) => {...})`) or expressions 
(`require(funkyBoolean ? 'lodash' : 'underscore'))`
in your code dependency-cruiser won't be able to determinewhat dependencies
they're about. For now dependency-cruiser focusses on doing static analysis
only and doing that well. Dynamic/ runtime analysis is fun, but also a whole
different ball game.

## Expanding dependency-cruiser
### How do I add support for my favorite alt-js language?
Ask me nicely.

Dependency-cruiser already supports TypeScript, CoffeeScript and LiveScript. If
there's another language (that transpiles to javascript) you'd like to see
support for, let me know.

... or add it yourself: your pull request is welcome. Recipe:
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

### How do I add a new output format?

Like so:
- In `src/report`:
  - add a module that exports a default function that
    - takes a dependency cruiser output object
      ([json schema](../src/extract/jsonschema.json))
    - returns that same object with the values of the 'dependencies' attribute
      replaced by the string containing the output you want.
- In `main/index.js`
    - require that module and
    - add a key to the to the `TYPE2REPORTER` object with that module as value
- In `bin/dependency-cruise`
    - add it to the documentation of the -T option
- In `test/report` add unit tests that prove your reporter does what it
    intends.

## Contact
If you have an issue, suggestion - don't hesitate to create an
[issue](https://github.com/sverweij/dependency-cruiser/issues/new). 

You're welcome to create a pull request - if it's something more complex it's
probably wise to first create an issue or hit 
[@depcruise](https://twitter.com/depcruise) up on twitter.

For things that don't fit an issue or pull request you're welcome to 
contact the [@depcruise](https://twitter.com/depcruise) twitter account as well.
