# Dependency cruiser ![Dependency cruiser](https://raw.githubusercontent.com/sverweij/dependency-cruiser/master/doc/assets/ZKH-Dependency-recolored-160.png)

_Validate and visualise dependencies. With your rules._ JavaScript. TypeScript. CoffeeScript. ES6, CommonJS, AMD.

## What's this do?

![Snazzy dot output to whet your appetite](https://raw.githubusercontent.com/sverweij/dependency-cruiser/master/doc/assets/sample-dot-output.png)

This runs through the dependencies in any JavaScript, TypeScript, LiveScript or CoffeeScript project and ...

- ... **validates** them against (your own) [rules](./doc/rules-reference.md)
- ... **reports** violated rules
  - in text (for your builds)
  - in graphics (for your eyeballs)

As a side effect it can generate [**cool dependency graphs**](./doc/real-world-samples.md)
you can stick on the wall to impress your grandma.

## How do I use it?

### Install it

- `npm install --save-dev dependency-cruiser` to use it as a validator in your project (recommended) or...
- `npm install --global dependency-cruiser` if you just want to to inspect multiple projects.

### Show stuff to your grandma

To create a graph of the dependencies in your src folder, you'd run dependency
cruiser with output type `dot` and run _GraphViz dot_ on the result. In
a one liner:

```shell
depcruise --include-only "^src" --output-type dot src | dot -T svg > dependencygraph.svg
```

- You can read more about what you can do with `--include-only` and other command line
  options in the [command line interface](./doc/cli.md) documentation.
- _[Real world samples](./doc/real-world-samples.md)_
  contains dependency cruises of some of the most used projects on npm.

### Validate things

#### Declare some rules

The easy way to get you started:

```shell
depcruise --init
```

This will ask you some questions and create a `.dependency-cruiser.js` with some
rules that make sense in most projects (detecting **circular dependencies**,
dependencies **missing** in package.json, **orphans**, production code relying on
dev- or optionalDependencies, ...).

Start adding your rules by tweaking that file.

Sample rule:

```json
{
  "forbidden": [
    {
      "name": "not-to-test",
      "comment": "don't allow dependencies from outside the test folder to test",
      "severity": "error",
      "from": { "pathNot": "^test" },
      "to": { "path": "^test" }
    }
  ]
}
```

- To read more about writing rules check the
  [writing rules](./doc/rules-tutorial.md) tutorial
  or the [rules reference](./doc/rules-reference.md)
- You can find the `--init-rules` set [here](./doc/rules.starter.json)

#### Report them

```sh
depcruise --config .dependency-cruiser.js src
```

This will validate against your rules and shows any violations in an eslint-like format:

![sample err output](https://raw.githubusercontent.com/sverweij/dependency-cruiser/master/doc/assets/sample-err-output.png)

There's more ways to report validations; in a graph (like the one on top of this
readme) or in a table.

- Read more about the err, dot, csv and html reporters in the
  [command line interface](./doc/cli.md)
  documentation.
- dependency-cruiser uses itself to check on itself in its own build process;
  see the `depcruise` script in the
  [package.json](https://github.com/sverweij/dependency-cruiser/blob/master/package.json#L64)

## I want to know more!

You've come to the right place :-) :

- Usage
  - [Command line reference](./doc/cli.md)
  - [Writing rules](./doc/rules-tutorial.md)
  - [Rules reference](./doc/rules-reference.md)
  - [Options reference](./doc/options-reference.md)
  - [FAQ](./doc/faq.md)
- Hacking on dependency-cruiser
  - [API](./doc/api.md)
  - [Output format](./doc/output-format.md)
  - [Adding other output formats](./doc/faq.md#q-how-do-i-add-a-new-output-format)
  - [Adding support for other alt-js languages](./doc/faq.md#q-how-do-i-add-support-for-my-favorite-alt-js-language)
- Other things
  - [Road map](https://github.com/sverweij/dependency-cruiser/projects/1)
  - [Contact](./doc/faq.md#contact)
  - [Real world show cases](./doc/real-world-samples.md)
  - [TypeScript, CoffeeScript and LiveScript support](./doc/faq.md#features)
  - [Support for .jsx, .tsx, .csx/ .cjsx, .vue and .svelte](./doc/faq.md#q-im-developing-in-react-and-use-jsx-tsx-csx-cjsx-how-do-i-get-that-to-work)
  - [Webpack alias/ modules support](./doc/faq.md#q-does-this-work-with-webpack-configs-eg-alias-and-modules)

## License

[MIT](LICENSE)

## Thanks

- [Marijn Haverbeke](http://marijnhaverbeke.nl) and other people who
  collaborated on [acorn](https://github.com/ternjs/acorn) -
  the excellent JavaScript parser dependency-cruiser uses to infer
  dependencies.
- [Katerina Limpitsouni](https://twitter.com/ninaLimpi) of [unDraw](https://undraw.co/)
  for the ollie in dependency-cruiser's
  [social media image](https://repository-images.githubusercontent.com/74299372/239ed080-370b-11ea-8fe7-140cf7b90a33).
- All members of the open source community who have been kind enough to raise issues,
  ask questions and make pull requests to get dependency-cruiser to be a better
  tool.

## Build status

[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/sverweij/dependency-cruiser/linting%20%26%20test%20coverage%20-%20linux?label=actions&logo=github)](https://github.com/sverweij/dependency-cruiser/actions)
[![coverage](https://gitlab.com/sverweij/dependency-cruiser/badges/master/coverage.svg)](https://gitlab.com/sverweij/dependency-cruiser/builds)
[![Maintainability](https://api.codeclimate.com/v1/badges/93035ef5fba33901d479/maintainability)](https://codeclimate.com/github/sverweij/dependency-cruiser/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/93035ef5fba33901d479/test_coverage)](https://codeclimate.com/github/sverweij/dependency-cruiser/test_coverage)
[![total downloads on npm](https://img.shields.io/npm/dt/dependency-cruiser.svg?maxAge=2591999)](https://npmjs.com/package/dependency-cruiser)

Made with :metal: in Holland.
