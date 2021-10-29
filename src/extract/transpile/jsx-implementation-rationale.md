# JSX in dependency-cruiser: implementation rationale

I've tried three options to implement cruising jsx. I've chosen to go with acorn_loose (the third option) - here's the rationale, so those who want to make another implementation for it don't have to do the same digging.

## Alternative: babel (not chosen - possibility for later)

- For this I introduced jsx as a new alt-js language - with babel-core as the transpiler.
- babel-core needs plugins to be able to do anything. For react there is:
  - `babel-plugin-transform-react-jsx` - this should suffice for purely jsx additions to no-frills javascript (sorta es3). Most react projects uses fancier javascript (es6 or better, with classes, proper module support etc), so without the plugins supporting those the transpilation would fail.
  - `babel-preset-react` - this is a collection of plugins. It contains transform-react-jsx, and some nice stuff for typical react projects (a.o. es6+ support).
- The philosophy of dependency-cruiser is to use the already available transpiler. While babel-core is likely to be part of the project, neither `babel-preset-react` nor `babel-plugin-transform-react-jsx` are guaranteed to be available _or even used_:
  - react-native projects typically use a different set of plugins
  - projects have complete liberty to use whatever plugins they want and there's no fixed set that's going to work for all projects.
- Alternatively I could _damn the philosophy_ and package a superset of babel plugins with dependency-cruiser. But even that won't cover all cases - and the cost (in download size) is not small- (7.2Mb for the core-js library, 1.1Mb for babel-core and a few bits and bobs for plugins & other deps).

**=> not a viable option for the short term**

More react research:

- `babel` and `babel-preset-react` seem to be the prevalent way to get from jsx to something digestible, but...
  - is it the only one (probably not)?
    - nope: `https://github.com/facebookincubator/create-react-app` uses its own `babel-preset-react-app`. But this also installs `babel-preset-react` as a dependency => we're good on this one.
    - nope: https://www.npmjs.com/package/node-jsx Deprecated. points to babel => good on this one as well.
    - nope: react native uses `babel-preset-react-native`; https://github.com/facebook/react-native/tree/master/babel-preset is used => :heavy_multiplication_x:
  - if not: is it worth while supporting other options?
    - react native seems useful
    - do the various options have a common denominator (e.g. `babel-plugin-jsx` - maybe another one?)
  - `babel-plugin-transform-react-jsx` seems to be a reasonable common denominator. It just doesn't work on its own in most react project I've used it on.

## Alternative: acorn with acorn-jsx (chosen)

- For this I introduced acorn-jsx in the extraction step. It's a relatively elegant solution; .js is correctly parsed without hitches, as is .jsx. In the latter case abstract syntax tree contains JSXxxx nodes. Also acorn-jsx is the 'official' jsx parser used by facebook. And babel. However ...
- ... for extracting dependencies from the syntax tree I use the tree-walker included in acorn. This - understandably - chokes on the new-fangled JSXxxx nodes acorn-jsx uses. There's some solutions available for this

  - use the `acorn-jsx-walk` package. ~~It isn't updated for quite a long time, and doesn't seem to have a lot of traction (in downloads, stars or otherwise). It also uses quite a lot of dependencies (biggish) and the code base didn't seem as one I'd like to adopt.~~ _update 2020-11-16_: acorn-jsx-walk is dependency-less (now - or was it always?), and super straightforward, small piece code to boot, so it makes sense that it doesn't need a whole lot of updates => totally legit to pull in.
  - filter/ transform the parsed tree so it doesn't contain JSXxxx nodes anymore - I'm not interested in those anyway. My estimation is that this will be non-trivial to do right.

## Alternative: acorn_loose (not chosen)

Observing

- ... in jsx dependencies typically (and sometimes from language/ listing rules) occur on the top.
- ... I'm not interested in jsx expressions - only imports, exports & requires and their ilk
- ... acorn_loose will in most sane cases pluck out the correct dependencies - especially when they occur at the top (and likely also when they occur below jsx statements)
- ... acorn_loose is
  - already part of acorn, and an existing dependency of dependency-cruiser
  - fast & stable
- ... implementing & testing this is a doddle ...

**this was used until dependency-cruiser 9.17.0** when it started using acorn-jsx + acorn-jsx-walk

# Vue

## Templates/ jsx

For vue templates I've followed a similar process of elimination. I found several ways
to transform vue templates to javascript but didn't find a satisfying one that would work in
all cases. So I ended up using the acorn_loose route for vue templates as well. It
seems to perform pretty ok, but a more elegant solution is welcome.

## Single File Components (SFC)

For these we can use the vue-template-compiler (Vue2) or @vue/compiler-sfc (Vue3) - which seems to do a clean and consistent job -
it splits the _template_, _script_, _style_ etc parts in an object, and these can be parsed
individually. Implementation in `vue-template-wrap.js`
