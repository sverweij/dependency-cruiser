# FAQ

## How do I enable TypeScript, CoffeeScript or LiveScript in dependency-cruiser?
You don't. They work out of the box.

## Does this mean dependency-cruiser installs transpilers for all these languages?
For LiveScript, TypeScript and CoffeeScript dependency-cruiser will use the
transpiler already in your project (or, if you installed dependency-cruiser
globally - the transpilers available globally).

This has a few advantages over bundling the transpilers as dependencies:
- `npm i`-ing dependency-cruiser will be faster.
- Transpilers you don't need won't land on your disk.
- Dependency-cruiser will use the version of the transpiler you are using
  in your project (which might not be the most recent one for valid reasons).

## How do I add support for my favorite alt-js language?
Dependency-cruiser already supports TypeScript, CoffeeScript and LiveScript. If
there's another language (that transpiles to javascript) you'd like to see
support for, let me know.

If you want to add it yourself: a pull request is welcome. Recipe:
- In `package.json`:
  - add your language (and supported version range) to the `supportedTranspilers`
    object.
  - Add your language's transpiler to `devDependencies` (you'll need that,
    because you are going to write tests that proves the addition works
    correctly later on).
- In `src/transpile`
  - add a `yourLanguageWrap.js` that invokes the transpiler transforming
    your language into javascript (preferablye ES6 or better, but lower versions
    should work as well). (`liveScriptWrap.js`)[../src/transpile/liveScriptWrap.js]
    as an example on how to do this.
  - in [`meta.js`](../src/transpile/meta.js)
    - require `./yourLanguageWrap` and
    - add it to the `extension2wrapper` object with the extensions proper for your
    language.
- In `test/transpile` add unit tests for `yourLanguageWrap`
