# FAQ

- [Troubleshooting](#troubleshooting)
- [Features](#features)
- [Expanding dependency-cruiser](#expanding-dependency-cruiser)
- [Road map](#roadmap)
- [Contact](#contact)

## Troubleshooting

### Q: TypeScript, CoffeeScript, LiveScript or Vue Single File Component (SFC) dependencies don't show up. How can I fix that?

**A**: Install the compiler you use in the same spot dependency-cruiser is installed (or vv).

Dependency-cruiser doesn't come shipped with the necessary transpilers to
handle these languages. Instead, it uses what is already available in the
environment (see [below](#q-does-this-mean-dependency-cruiser-installs-transpilers-for-all-these-languages)).
You can check if the transpilers are available to dependency-cruiser by
running `depcruise --info`.

When it turns out they aren't yet:

- if you're running dependency-cruiser as a global install, install
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

By default, dependency-cruiser only takes post-compilation dependencies into
account; dependencies between TypeScript modules that exist after compilation
to JavaScript. Two types of dependencies do not fall into this category

- imports that aren't used (yet)
- imports of types only

If you _do_ want to see these dependencies, do one of these:

- if you have a dependency-cruiser configuration file, put `"tsPreCompilationDeps" : true`
  in the `options` section.
- pass `--ts-pre-compilation-deps` as a command line option

See [--ts-pre-compilation-deps](./cli.md#--ts-pre-compilation-deps-TypeScript-only)
for details and examples.

### Q: Some TypeScript dependencies _still_ don't show up (`/// tripple slash directives`)

**_A_**: You're using a version <9.0.0. From version 9.0.0 on tripple slash
directives are recognized without the need for additional configuration. Easiest
is to upgrade to version 9.0.0 or higher.

> In older versions you needed to add the "tsd" (_tripple slash directive_)
> module system to the `moduleSystems` array in your dependency-cruiser
> configuration - or pass it on the command line (with `--module-systems cjs,ejs,tsd`).

### Q: The graph dependency-cruiser generates is humongous, and I can't follow the lines very well what can I do?

**A**: Usually you don't need to see _all_ modules and dependencies that make up
your app at the same time - showing your monorepo with 5000 modules and 20000
dependencies in one picture will not give you much information. There's a few
strategies and options that can help

It can e.g. be helpful to make separate graphs for
each of the `packages` in your monorepo. That won't solve all readability issues,
though, so dependency-cruiser has a few options to get you sorted.

#### High level dependency graph ('archi' reporter)

If you just want to get an overview of how the main components of your application
are connected, you can aggregate dependencies to a higher level.

```sh
dependency-cruiser --config .dependency-cruiser.js --output-type archi -- src | dot -T svg > high-level-dependency-graph.svg
```

By default the _archi_ reporter aggregates to the level just below `packages` (for
mono repos), `src`, `lib` and a few other often occurring paths. You can tweak this
to your own app's structure with a [collapsePattern](options-reference.md#summarising-collapsepattern-dot-and-archi-reporters)).

An example of how this can look: [dependency-cruiser's high level dependency graph](https://sverweij.github.io/dependency-cruiser/dependency-cruiser-archi-graph.html)
Compare that to [dependency-cruiser's internal module graph](https://sverweij.github.io/dependency-cruiser/dependency-cruiser-dependency-graph.html)
with ~100 modules to appreciate the difference)

#### Folder level dependency graph ('ddot' reporter)

For a birds-eye view, you can use the `ddot` reporter that summarises dependencies
on a folder level:

```sh
dependency-cruiser --config .dependency-cruiser.js --output-type ddot -- src | dot -T svg > folder-level-dependency-graph.svg
```

See an example of how this can look: [dependency-cruiser's folder level dependency graph](https://sverweij.github.io/dependency-cruiser/dependency-cruiser-dir-graph.html)

#### Filtering

The `--include-only`, `exclude`, `--do-not-follow`, `--focus` (and for more
extreme measures `--max-depth`) command line options and their configuration
file equivalents provide various ways to reduce the number of modules and
dependencies in the dot output. E.g. to focus on stuff _within_ src only and not
show any test and mock files, you'd do something like this:

```sh
depcruise --include-only "^src/" --exclude "mocks\\.ts$|\\.spec\\.ts$" --output-type dot | dot -T svg > dependency-graph.svg
```

#### Bonus: report level filtering

If you want to apply a different filter for your graph as for your validations
(because the detail you need for your graph is lower, for instance), you have
two options:

1. Create a configuration separate from your validation configuration,
   dedicated to the generation of graphs.
2. In your overall configuration add filters at reporter level. Read more
   about that in [report level filtering](options-reference.md#filtering-dot-ddot-and-archi-reporters),
   which also explains how you can use depcruise-fmt to get a free performance
   level-up. Here's an example that only shows modules in the `src` tree:

```json5
{
  "options": {
    // global filtering: when encountering node_modules record it
    // but don't follow it any further
    "doNotFollow": "node_modules",
    "reporterOptions": {
      "dot": {
        // filtering specific for the dot (graphical) reporter:
        // only show modules in the src tree
        "filters": {
          "includeOnly": { "path": "^src" }
        }
    }
  }
}
```

You can do this with the _includeOnly_, _exclude_ and _focus_ filters

#### Make dot render orthogonal edges instead of splines

Some of the examples you see in the documentation have orthogonal edges, instead
of splines. Sometimes this will improve legibility quite a bit. To achieve that
either pass `-Gsplines=ortho` to dot, e.g. in a complete incantation:

```sh
depcruise --config .dependency-cruiser-graph.js --output-type dot -- src | dot -Gsplines=ortho -T svg > dependency-graph-with-orthogonal-edges.svg
```

... or put it permanently in your dependency-cruiser configuration in the dot
reporter options:

```js
module.exports = {
  // ... your rules and/ or the configuration it extends ...
  options: {
    // ... your other options ...
    reporterOptions: {
      dot: {
        theme: {
          graph: {
            splines: "ortho",
          },
        },
      },
    },
  },
};
```

The reason it's not the default for the dot reporter output is GraphViz won't
always be able to render a graph with orthogonal edges, so YMMV.

### Q: TypeScript dynamic imports show up as "✖" . What's up there?

**A**: You're using a version of dependency-cruiser < 4.17.0. Dynamic imports,
both in TypeScript and JavaScript are supported as of version 4.17.0 -
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

**A**: jsx and its TypeScript and CoffeeScript variants work
out of the box as well. For jsx there is a little caveat, though.

### Q: I hear there is a little caveat with jsx. What is that?

**A**: Under the hood dependency-cruiser currently uses `acorn` and `acorn-jsx`
which (for at least some time) have been the official jsx transpilers and are
still used by other tools (source: acorn-jsx github page). Some constructs in
jsx it does not support however. In the lion's share of the cases you will not
notice, and acorn will still pick out the correct dependencies (more nor
less than are in the source code) because it will fall back on the acorn-loose
parser, which will pick up the pieces. _except_, that is when you happen to use
_import_, _export_ or _require_ in jsx fragments in one special flavor of jsx

<details>
<summary>Sample of jsx the default parser doesn't parse</summary>

```jsx
import React from "react";

export class ReplicateIssueComponent extends React.Component {
  renderSomethingElse = () => {
    return (
      <>The word import here results is picked up as an import statement.</>
    );
  };

  render = () => (
    <>
      {this.renderSomethingElse()}
      Here import is confused with an import statement as well.
    </>
  );
}
```

</details>

In [this comment](https://github.com/sverweij/dependency-cruiser/issues/395#issuecomment-730295987)
on the orignal issue [@audunsol](https://github.com/audunsol) offers a few
ways to work around the issue you might find helpful when you have similar
jsx.

(As a future feature dependency-cruiser will include ways to handle even these
situations without workarounds).

### Q: Does this work with Vue as well?

**A**: Yes.

For `.vue` single file components it uses the `vue-template-compiler`

- which will be in your module dependencies if you're developing with Vue).

### Q: Does this work with Svelte as well?

**A**: Yes.

For `.svelte` single file components it uses the `svelte` (version 3.x)

- which will be in your module dependencies if you're developing with Svelte).
- by default, all `.svelte` file will depend on `"svelte/internal"`.
  If it turns out to be too noisy, you can configure Dependency-cruiser
  to ignore it (either in the config file or with a command-line param)

As of dependency-cruiser 9.21.0 any configuration generated with `depcruise --init`
includes this.

### Q: Does this mean dependency-cruiser installs transpilers for all these languages?

**A**: No.

For LiveScript, TypeScript, CoffeeScript and Vue Single File Components
dependency-cruiser will use the transpiler already in your project (or,
if you installed dependency-cruiser globally - the transpilers available
globally).

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

- nodejs parsable JavaScript only
- webpack 4 compatible and up (although earlier ones _might_ work
  there's no guarantee)
- exporting either:
  - an object literal
  - a function (webpack 4 style, taking up to two parameters)
  - an array of the above (where dependency-cruiser takes the
    first element in the array)

Support for other formats (promise exports, TypeScript, fancier
ECMAScript) might come later.

### Q: Does dependency-cruiser detect [dynamic imports](https://github.com/tc39/proposal-dynamic-import)?

**A**: Yes; in both TypeScript and JavaScript - but only with static string arguments
or template expressions that don't contain placeholders (see the next question).
This should cover most of the use cases for dynamic
imports that leverage asynchronous module loading (like
[webpack code splitting](https://webpack.js.org/guides/code-splitting/#dynamic-imports)),
though.

### Q: Does dependency-cruiser handle variable or expression requires and imports?

**A**: No.

If you have imports with variables (`require(someVariable)`,
`import(someOtherVariable).then((pMod) => {...})`) or expressions
(`require(funkyBoolean ? 'lodash' : 'underscore'))`
in your code dependency-cruiser won't be able to determine what dependencies
they're about. For now dependency-cruiser focuses on doing static analysis
only and doing that well.

### Q: Does dependency-cruiser support [webpack inline loaders](https://webpack.js.org/concepts/loaders/#inline)?

**A**: Yes, as of version 9.17.0 it does. No configuration necessary.

### Q: Does dependency-cruiser support [require.js plugin notation](https://requirejs.org/docs/plugins.html)?

**A**: Yes, as of version 9.17.0 it does. No configuration necessary.

### Q: Does it work with my monorepo?

**A**: Absolutely. For every cruised module the closest `package.json` file is
used to determine if a package was declared as dependency.

### Q: Does dependency-cruiser work with Yarn Plug'n'Play?

**A**: Yes.

From version 9.21.3 this works automatically. In earlier versions (from 4.14.0)
you only needed to `yarn-pnp` into _externalModuleResolutionStrategy_ key in
the config (--init took care of that), but that's not necessary anymore.

### Q: dependency-cruiser detected a circular dependency. How can I see (one of the) cycles that dependency-cruiser saw?

**A**: Upgrade to version 5.2.0 or higher - from that version on dependency-cruiser
emits the circular path in the _err_, _err-long_, _err-html_ and
_teamcity_ reporters (he _dot_ and _ddot_ reporters already did before).

### Q: I'm using window.require or a require wrapper - how do I make sure dependencies I declared like that are included?

**A**: From version 5.4.0 or higher you can add an _exoticRequireStrings_ key in
your configuration with the wrapper(s) and/ or re-definitions of require:

```json
"exoticRequireStrings": ["window.require", "need", "tryRequire"]
```

### Q: Can I get code completion for .dependency-cruiser.js?

**A**: Yes.

You can get code completion & suggestions in editors that support these things
by typing the module.exports with a comment like so:

```javascript
/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  // ... your rules & options
};
```

## Expanding dependency-cruiser

### Q: How do I add a new output format?

**A**: Like so:

- In `src/report`:
  - add a module that exports a default function that
    - takes a dependency cruiser output object
      ([json schema](../src/schema/cruise-result.schema.json))
    - returns an object with
      - output: the output you want the cli to emit
      - exitCode: the exit code you want the cli to return when
        the report is done
- In `report/index.js`
  - require that module and
  - add a key to the `TYPE2REPORTER` object with that module as value
- In `bin/dependency-cruise`
  - add it to the documentation of the -T option
- In `test/report` add unit tests that prove your reporter does what it
  intends.

### Q: How do I add support for my favourite alt-js language?

**A**: Ask me nicely or make a PR.

Dependency-cruiser already supports TypeScript, CoffeeScript and LiveScript. If
there's another language (that transpiles to JavaScript) you'd like to see
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
    your language into JavaScript (preferably ES6 or better, but lower versions
    should work as well). [`typeScriptWrap.js`](../src/extract/transpile/typeScriptWrap.js)
    as an example on how to do this.
  - in [`meta.js`](../src/extract/transpile/meta.js)
    - require `./yourLanguageWrap` and
    - add it to the `extension2wrapper` object with the extensions proper for your
      language.
- In `test/extract/transpile` add unit tests for `yourLanguageWrap`

## Road map

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
