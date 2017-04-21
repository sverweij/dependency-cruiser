# Dependency cruiser ![Dependency cruiser](https://raw.githubusercontent.com/sverweij/dependency-cruiser/master/doc/assets/ZKH-Dependency-recolored-160.png)

_Validate and visualize dependencies. With your rules._ JavaScript. TypeScript. CoffeeScript. ES6, CommonJS, AMD.

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
- `npm install --save-dev dependency-cruiser` to use it as a validator in your project or...
- `npm install --global dependency-cruiser` if you just want to to inspect multiple projects.

### Show stuff to your grandma
To create a graph of the dependencies in your src folder, you'd run dependency
cruiser with output type `dot` and run _GraphViz dot_ on the result. In
a one liner:

```shell
depcruise --exclude "^node_modules" --output-type dot src | dot -T svg > dependencygraph.svg
```

- You can read more about what you can do with `--exclude` and other command line
  options in the
  [command line interface](./doc/cli.md)
  documentation.
- _[Real world samples](./doc/real-world-samples.md)_
  contains dependency cruises of some of the most used projects on npm.

### Validate things
#### Declare some rules
The easy way to get you started:

```shell
depcruise --init-rules
```

This will create a `.dependency-cruiser.json` with some rules that make sense
in most projects (detecting **circular dependencies**, dependencies **missing**
in package.json, production code relying on dev- or optionalDependencies, ...).

Start adding your rules by tweaking that file.

Sample rule:
```json
{
    "forbidden": [{
        "name": "not-to-test",
        "comment": "don't allow dependencies from outside the test folder to test",
        "severity": "error",
        "from": { "pathNot": "^test" },
        "to": { "path": "^test" }
    }]
}
```

- To read more about writing rules check the
  [writing rules](./doc/rules-tutorial.md) tutorial
  or the [rules reference](./doc/rules-reference.md)
- You can find the `--init-rules` set   [here](./doc/rules.starter.json)

#### Report them
```sh
depcruise --validate .dependency-cruiser.json src
```

This will validate aginst your rules and shows any violations in an eslint-like format:

![sample err output](https://raw.githubusercontent.com/sverweij/dependency-cruiser/master/doc/assets/sample-err-output.png)

There's more ways to report validations; in a graph (like the one on top of this
readme) or in a table.

- Read more about the err, dot, csv and html reporters in the
  [command line interface](./doc/cli.md)
  documentation.
- dependency-cruiser uses itself to check on itself in its own build process;
  see the `dependency-cruise` target in the
  [Makefile](https://github.com/sverweij/dependency-cruiser/blob/master/Makefile#L95)

## I want to know more!
You've come to the right place :-) :

- Usage
    - [Command line reference](./doc/cli.md)
    - [Writing rules](./doc/rules-tutorial.md)
    - [Rules reference](./doc/rules-reference.md)
- Hacking on dependency-cruiser
    - [API](./doc/api.md)
    - [Output format](./doc/output-format.md)
    - [Adding support for other alt-js languages](./doc/faq.md#how-do-i-add-support-for-my-favorite-alt-js-language)
    - [Adding other output formats](./doc/faq.md#how-do-i-add-a-new-output-format)
- Other things
    - [Road map](https://github.com/sverweij/dependency-cruiser/projects/1)
    - [Real world show cases](./doc/real-world-samples.md)
    - [TypeScript, CoffeeScript and LiveScript support](./doc/faq.md)

## License
[MIT](LICENSE)

## Thanks
- [Marijn Haverbeke](http://marijnhaverbeke.nl) and other people who
  colaborated on [acorn](https://github.com/ternjs/acorn) -
  the excelent javascript parser dependency-cruiser uses to infer
  dependencies.

## Build status
[![build status](https://gitlab.com/sverweij/dependency-cruiser/badges/master/build.svg)](https://gitlab.com/sverweij/dependency-cruiser/builds)
[![coverage](https://gitlab.com/sverweij/dependency-cruiser/badges/master/coverage.svg)](https://gitlab.com/sverweij/dependency-cruiser/builds)
[![bitHound Overall Score](https://www.bithound.io/github/sverweij/dependency-cruiser/badges/score.svg)](https://www.bithound.io/github/sverweij/dependency-cruiser)
[![bitHound Dependencies](https://www.bithound.io/github/sverweij/dependency-cruiser/badges/dependencies.svg)](https://www.bithound.io/github/sverweij/dependency-cruiser/master/dependencies/npm)
[![bitHound Dev Dependencies](https://www.bithound.io/github/sverweij/dependency-cruiser/badges/devDependencies.svg)](https://www.bithound.io/github/sverweij/dependency-cruiser/master/dependencies/npm)
[![npm stable version](https://img.shields.io/npm/v/dependency-cruiser.svg)](https://npmjs.com/package/dependency-cruiser)
[![total downloads on npm](https://img.shields.io/npm/dt/dependency-cruiser.svg?maxAge=2591999)](https://npmjs.com/package/dependency-cruiser)

Made with <svg style="vertical-align:top;width:1.2em;height:1.2em;fill:#fb7;stroke:currentColor" alt="rock" viewBox="0 0 25 25"><rect x="8.9" y="10.5" rx="1.3" ry="1.5" width="3.2" height="6.7"/><rect x="12.2" y="10.5" rx="1.3" ry="1.5" width="3.1" height="6.7"/><path d="M13.4 19.2C13.2 17.2 15.2 16.5 16.2 16.5"/><rect x="15.5" y="2.5" rx="1.4" ry="1.5" width="3.1" height="13.7"/><path d="M17.1 17.1L11.3 17.1C10.6 17.1 10 16.3 10 15.6 10 14.8 10.6 14.1 11.3 14.1L18 14.1C18.8 14.1 19.5 14.7 19.5 15.5 19.5 16.3 19.5 16.8 19.5 18.9 19.5 20.9 18 22.5 16.2 22.5L8.8 22.5C7 22.5 5.5 20.9 5.5 18.9L5.5 18.1 5.5 6C5.5 5.2 6.1 4.6 6.9 4.6L7 4.6C7.8 4.6 8.5 5.2 8.5 6L8.5 15C8.5 16.2 9.9 15.9 9.9 15.9M14.6 20.1C14.4 18.7 15.2 17.1 16.8 17.1"/></svg> in Holland.
