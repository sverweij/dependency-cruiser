# Dependency cruiser rules - reference

## Introduction

- This is a small reference guide to the elements you can use to write rules
  for dependency-cruiser. If you want a step-by-step introduction check the
  [rules _tutorial_](./rules-tutorial.md).
- There is a [json schema](../src/main/ruleSet/config-schema.json)
  that describes the output format. Dependency-cruiser
  checks rule sets against it.
- Some examples:
  - dependency-cruiser's [own configuration](../.dependency-cruiser.json)
  - the configuration [State Machine cat](https://state-machine-cat.js.org) uses [for validation](https://github.com/sverweij/state-machine-cat/blob/develop/config/dependency-cruiser.js) and the one it uses [for generating a visual graph](https://github.com/sverweij/state-machine-cat/blob/develop/config/dependency-cruiser-graph.js).
  - [mscgen.js](https://mscgen.js.org)'s [.dependency-cruiser.json](https://github.com/mscgenjs/mscgenjs-core/blob/develop/.dependency-cruiser.json)
- Tip: run `depcruise --init` to create a .dependency-cruiser.json (or .js) with
  some rules that make sense in most projects.

## Contents
1. [The structure of a dependency-cruiser configuration](#the-structure-of-a-dependency-cruiser-configuration)
    - [`forbidden`](#forbidden)
    - [`allowed`](#allowed)
    - [`allowedSeverity`](#allowedSeverity)
    - [`extends`](#extends)
    - [`options`](#options)
2. [The structure of an individual rule](#the-structure-of-an-individual-rule)
3. [Conditions](#conditions)
    - [`path`](#path)
    - [`pathNot`](#pathnot)
    - [path specials](#path-specials)
    - [`orphan`](#orphans)
    - [`reachable`](#reachable---detecting-dead-wood)
    - [`couldNotResolve`](#couldnotresolve)
    - [`circular`](#circular)
    - [`license` and `licenseNot`](#license-and-licensenot)
    - [`dependencyTypes`](#dependencytypes)
    - [`dynamic`](#dynamic)
    - [`moreThanOneDependencyType`](#more-than-one-dependencytype-per-dependency-morethanonedependencytype)
4. [The `options`](#the-options)
    - [`doNotFollow`: don't cruise modules adhering to this pattern any further](#donotfollow-dont-cruise-modules-adhering-to-this-pattern-any-further)
    - [`exclude`: exclude modules from being cruised](#exclude-exclude-modules-from-being-cruised)
    - [`includeOnly`: only include modules satisfying a pattern](#includeonly-only-include-modules-satisfying-a-pattern)
    - [`maxDepth`](#maxdepth)
    - [`prefix`: prefix links in reports](#prefix-prefix-links-in-reports)
    - [`moduleSystems`](#modulesystems)
    - [`tsPreCompilationDeps`](#tsprecompilationdeps)
    - [`tsConfig`: use a typscript configuration file ('project')](#tsconfig-use-a-typescript-configuration-file-project)
    - [Yarn Plug'n'Play support - `externalModuleResolutionStrategy`](#yarn-plugnplay-support---externalmoduleresolutionstrategy)
    - [`webackConfig`: use (the resolution options of) a webpack configuration](#webpackconfig-use-the-resolution-options-of-a-webpack-configuration)
    - [Some more esoteric options](#some-more-esoteric-options)
5. [Configurations in javascript](#configurations-in-javascript)

## The structure of a dependency cruiser configuration
The typical dependency-cruiser config is json file (although you can use javascript -
see [below](#configurations-in-javascript))). The three most important sections
are `forbidden`, `allowed` and `options`, so a skeleton config could look something like this:

```json
{
    "forbidden": [],
    "allowed": [],
    "options": {}
}
```

The following paragraphs explain these three and the other sections.

### `forbidden`
A list of rules that describe dependencies that are not allowed.
dependency-cruiser will emit a separate error (warning/ informational) message
for each violated rule.

### `allowed`
A list of rules that describe dependencies that are _allowed_. dependency-cruiser
will emit a 'not-in-allowed' message for each dependency that does not
satisfy at least one of them. The severity of the message is _warn_ by
default, but you can override it with `allowedSeverity`

### `allowedSeverity`
The severity to use in reports when a dependency is not in the `allowed`
list of rules. It takes the same values as other `severity` fields and
also defaults to `warn`.

### `extends`
This takes one or more file path to other dependency-cruiser-configs. When
dependency-cruiser reads your config, it takes the contents of the
`extends` and merges them with the contents of your config.

#### File resolution
dependency-cruiser resolves the `extends` relative to the file name with the
  same algorithm node uses, which means a.o.
- names starting with `./` are local
- you can use external node_modules to reference rule sets (e.g. `dependency-cruiser/configs/recommended`)
- there's no need to specify the extension for javascript files, but for json it's mandatory.

#### How rules are merged
- `allowed` rules    
  Dependency-cruiser concats `allowed` rules from the extends, and de-duplicates
  them.
- `forbidden` rules    
  For `forbidden` rules it uses the same approach, except when the rules
  have a name, in which case the rule with the same name in the current file
  gets merged into the one from extends, where attributes from the current file
  win.
  This allows you to override only one attribute, e.g. the severity
- `allowedSeverity`    
  If there's an `allowedSeverity` in the current file, it wins. If neither file
  has an `allowedSeverity` dependency-cruiser uses _warn_ as a default
- `options`     
  `options` get the Object.assign treatment - where the option in the current
  file wins.
- If there's more than one path in extends, they get merged into the current file
  one by one, running through the array left to right.

#### Examples
To use a local base config:
```json
{
    "extends": "./configs/dependency-cruiser-base.json"
}
```

To use a base config from an npm package:
```json
{
    "extends": "@ourcompany/dependency-cruiser-configs/frontend-rules-base.json"
}
```

```js
module.exports = {
    extends: "dependency-cruiser/configs/recommended",
    forbidden: [{
        // because we still use a deprecated core module, still let
        // the no-deprecated-core rule from recommended fire,
        // but at least temporarily don't let it break our build
        // by setting the severity to "warn" here
        name: "no-deprecated-core",
        severity: "warn"
        // no need to specify the from and to, because they're already
        // defined in 'recommended'
    }]
}
```

### `options`
Options that influence what is cruised, and how it is cruised. See 
[The options](#the-options) below for an exhaustive list.

## The structure of an individual rule
An individual rule consists at least of a `from` and a `to`
attribute that contain one or more conditions that trigger the rule, so
a minimal rule will look like this:

```json
{
    "from"    : {},
    "to"      : {}
}
```

A rule within the 'allowed' section can also have a `comment` attribute
which you can use to describe the rule.

Rules within the 'forbidden' section can have a `name` and a `severity`.

```json
{
    "name"    : "kebab-cased-name",
    "comment" : "(optional) description of the rule",
    "severity": "warn",
    "from"    : {},
    "to"      : {}
}
```

### `from` and `to`
Conditions an end of a dependency should match to be caught by this
rule. Leave it empty if you want any module to be matched.

The [conditions](#conditions) section below describes them all.

### `comment`
You can use this field to document why the rule is there. It's not
used in any rule logic.

### `name`
> (only available in the `forbidden` section )

A short name for the rule - will appear in reporters to enable
customers to quickly identify a violated rule. Try to keep them
short, eslint style. E.g. 'not-to-core' for a rule forbidding
dependencies on core modules, or 'not-to-unresolvable' for one
that prevents dependencies on modules that probably don't exist.

If you do not provide a name, dependency-cruiser will default it
to `unnamed`.

### `severity`
> (only available in the `forbidden` section )

How severe a violation of a rule is. The 'error' severity will make
some reporters (at least the `err` one) return a non-zero exit
code, so if you want e.g. a build to stop when there's a rule
violated: use that.

The other values you can use are `info`, `warn` and `ignore`. If you
leave it out dependency-cruiser will assume it to be `warn`.

With the severity set to `ignore` dependency-cruiser will not check
the rule at all. This can be useful if you want to temporarily
disable a rule or disable a rule you inherited from a rule set you
extended.

## Conditions
### `path`
A regular expression an end of a dependency should match to be catched by this
rule.

In `from`, this is the path from the current working directory (typically your
project root) to the file containing a dependency. In `to`, this is the path from
the current working directory to the file the dependency resolves to.

When path is in a `to` part of a rule it accepts the regular expression
'group matching' special variables `$0`, `$1`, `$2`, ...  as well. See
'group matching' below for an explanation & example.

### `pathNot`
A regular expression an end of a dependency should NOT match to be catched by
this rule.

When pathNot is in a `to` part of a rule it accepts the regular expression
'group matching' special variables `$0`, `$1`, `$2`, ...  just like the path
attribute. See 'group matching' below for an explanation & example.


### path specials

#### regular expressions - not globs
I chose _regular expressions_ for matching paths over the more traditional
_glob_ because they're more expressive - which makes it easier to specify
rules. Some common patterns

glob | regular expression | this expresses:
 --- | --- | ---
`*.js`     | `[^/]+\.js$` | files in the current folder with the extension _.js_
`src/**/*` | `^src` | all files in the _src_ folder
_not possible_ | `^src/([^/]+)/.+` | everything in the src tree - remember the matched folder name directly under src for later reference.

#### forward slashes
To make sure rules you specify run on all platforms, dependency-cruiser
internally represents paths with forward slashes as path separators
(`src/alez/houpe`).

#### 'group matching'
Sometimes you'll want to use a part of the path the 'from' part of your rule
matched and use it in the 'to' part. E.g. when you want to prevent stuff in
the same folder to be matched.

To achieve this you'll need to do two things:
- In the `from` of your rule:    
  Make sure the part of the `path` you want to be matched is between brackets.
  Like so: `"^src/([^/]+)/.+"`
- In the `to` part of your rule:    
  You can reference the part matched between brackets by using `$1` in `path`
  and `pathNot` rules. Like so: `"pathNot": "^src/$1/.+".`
- It is possible to use more than one group per rule as well. E.g. this
  expression `"^src/([^/]+)/[^\.]\.(.+)$"` has two groups; one
  for the folder directly under src, and one for the extension. The first is
  available in the `to` part of your rule with `$1`, the second with `$2`.
- The special variable `$0` contains the _whole_ matched string. I haven't
  seen a practical use for it in the context of depedendency-cruiser, but
  I'll be glad to be surprised.

#### 'group matching' - an example: matching peer folders

Say you have the following folder structure
```
src
└── business-components
    ├── search
    ├── upsell
    ├── check-out
    ├── view-trip
    └── check-in
```

Business components should be completely independent of each other. So typically
you'd specify a rule like this to prevent accidents in the "forbidden" section:

```json
{
    "name": "no-inter-ubc",
    "comment": "Don't allow relations between code in business components",
    "severity": "error",
    "from": {"path": "^src/business-components/([^/]+)/.+"},
    "to": {
        "path": "^src/business-components/([^/]+)/.+"
    }
}
```

This will correctly flag relations from one folder to another, but also
relations _within_ folders. It's possible to get around that by specifying it
for each folder explicitly, leaving the current 'from' folder from the to
list e.g.    
_from: search, to: upsell|check-out|view-trip|check-in,_    
_from: upsell, to: search|check-out|view-trip|check-in,_    
 _..._

That'll be heavy maintenance though; especially when your
business components breed like a litter of rabbits. In stead, you can use
group matching:

```json
{
    "name": "no-inter-ubc",
    "comment": "Don't allow relations between business components",
    "severity": "error",
    "from": {"path": "^src/business-components/([^/]+)/.+"},
    "to": {
        "path": "^src/business-components/([^/]+)/.+",
        "pathNot": "^src/business-components/$1/.+"
    }
}
```
... which makes sure dependency-cruiser does not match stuff in the from folder
currently being matched.

### orphans

A boolean indicating whether or not to match modules that have no incoming
or outgoing dependencies. Orphans might need special attention because
they're unused leftovers from a refactoring. Or the start of some feature
that never got finished but which was merged anyway. Leaving the `orphan`
attribute out means you don't care about orphans in your code.

Detecting orphans will have an impact on performance. You will probably
only notice it when you have a larger code base (thousands of modules
in your dependency graph), but it is something to
keep in mind.

To detect orphans guys you can add e.g. this snippet to your
.dependency-cruiser.json's `forbidden` section:

```json
{
    "name": "no-orphans",
    "severity": "warn",
    "from": {"orphan": true},
    "to": {}
}
```

#### Usage notes
- dependency-cruiser will typically not find orphans when you give it
  only one  module to start with. Any module it finds, it finds by
  following its dependencies, so each module will have at least one
  dependency incoming or outgoing. Specify one or more folder, several
  files or a glob. E.g.    
  ```
  depcruise -v -- src lib test
  ```    
  will find orphans if they exist,
  whereas    
  ```sh
  depcruise -v -- src/index.ts
  ```    
  probably won't (unless index.ts is an orphan itself).
- by definition orphan modules have no dependencies. So when `orphan` is
  part of a rule, the `to` part won't make sense. This is why
  dependency-cruiser will ignore the `to` part of these rules.
- For similar reasons `orphan` is not allowed in the `to` part of rules.
- (_for API users only_) to prevent dependency-cruiser from
  needlessly running the orphan detection algorithm, it only runs it
  when there's an orphan rule in the rule set. If you want to have
  the detection in without a rule set or without an orphan rule,
  pass `forceOrphanCheck: true` as part of the `pOptions` parameter.

### `reachable` - detecting dead wood

`reachable` is a boolean indicating whether or not modules matching the `to` part
of the rule are _reachable_ (either directly or via other moduels) from modules
matching the `from` part of the rule. This can be useful for detecting dead wood.

For instance, in this dependency-graph several modules are not reachable from
the root `index.js`. If `index.js` is the only (legal) entry to this package,
those unreachable modules are likely candidates for removal:

<img width="533" alt="dependencies unreachable from src/index.js - reachable rule off" src="assets/reachable-deps-rule-off.png">


Here's a rule snippet that will detect these for you:

```javascript
{
    "forbidden": [
        {
            "name": "no-unreachable-from-root",
            "severity": "error",
            "from": {
                "path": "src/index\\.js$"
            },
            "to": {
                "path": "src",
                
                /*
                  spec files shouldn't be reachable from regular code anyway, so you
                  might typically want to exclude these from reachability rules.
                  The same goes for typescript definition files:
                 */
                "pathNot": "\\.spec\\.(js|ts)$|\\.d\\.ts$"
                
                /* 
                  for each file matching path and pathNot, check if it's reachable from the
                  modules matching the criteria mentioned in "from"
                 */
                "reachable": false 
            }
        }
    ]
}

```
With this rule enabled, the unreachable rules jump out immediately. Both in the output of the `err` reporter

```sh
  error no-unreachable-from-root: src/other-stuff/index.js
  error no-unreachable-from-root: src/other-stuff/untouched-one.js
  error no-unreachable-from-root: src/other-stuff/untouched-two.js
  error no-unreachable-from-root: src/relevant/to-untouched.js

✖ 4 dependency violations (4 errors, 0 warnings). 8 modules cruised.
```
... and in the output of the `dot` one:

<img width="533" alt="dependencies unreachable from src/index.js - reachable rule on" src="assets/reachable-deps-rule-on.png">

#### Usage notes
- You can set up multiple rules with a `reachable` attribute in the `to` section. If you do so,
  make sure you give a `name` to each rule. It's not only the only way dependency-cruiser can keep
  reachable rules apart - it will be for you as well :-).
- The operation to calculate the reachability of modules can be quite resource intensive, especially
  if you dependency-graph is wide and deep.
- Different from other rules, rules with a `reachable` attribute can only have
  - `path` and `pathNot` in the `from` part of the rule
  - `path` and `pathNot` alongside the `reachable` in the `to` part of the rule    
  (these limitations might get lifted somewhere in the future)

### `couldNotResolve`
Whether or not to match modules dependency-cruiser could not resolve (and
probably aren't on disk). For this one too: leave out if you don't care either
way.

To get an error for each unresolvable dependency, put this in your "forbidden"
section:
```json
{
    "name": "not-to-unresolvable",
    "severity": "error",
    "from": {},
    "to": { "couldNotResolve": true }
}
```

### `circular`
A boolean indicating whether or not to match module dependencies that end up
where you started (a.k.a. circular dependencies). Leaving this out => you don't
care either way.

Detecting circular dependencies is heavy work. Especially on larger code bases
(thousands of files in one dependency graph) you might notice an impact on
the performance when you add a rule that checks for circular dependencies.

For example, adding this rule to the "forbiddden" section in your
.dependency-cruiser.json will issue a warning for each dependency that ends
up at itself.

```json
{
    "name": "no-circular",
    "severity": "warn",
    "from": { "pathNot": "^(node_modules)"},
    "to": { "circular": true }
}
```

### `license` and `licenseNot`
You can flag dependent modules that have licenses that are e.g. not
compatible with your own license or with the policies within your company with
`license` and `licenseNot`. Both take a regular expression that matches
against the license string that goes with the dependency.

E.g. to forbid GPL and APL licenses (which require you to publish your source
code - which will not always be what you want):

```json
{
    "name": "no-gpl-apl-licenses",
    "severity": "error",
    "from": {},
    "to": { "license": "GPL|APL" }
}
```
This raise an error when you use a dependency that has a string with GPL or
APL in the "license" attribute of its package.json (e.g.
[SPDX](https://spdx.org) compatible expressions like `GPL-3.0`, `APL-1.0` and
`MIT OR GPL-3.0` but also on non SPDX compatible)

To only allow licenses from an approved list (e.g. a whitelist provided by your
legal department):
```json
{
    "name": "only-licenses-approved-by-legal",
    "severity": "warn",
    "from": {},
    "to": { "licenseNot": "MIT|ISC" }
}
```

Note: dependency-cruiser can help out a bit here, but you remain responsible
for managing your own legal stuff. To re-iterate what is in the
 [LICENSE](../LICENSE) to dependency-cruiser:
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

### `dependencyTypes`
You might have spent some time wondering why something works on your machine,
but not on other's. Only to discover you _did_ install a dependency, but
_did not_ save it to package.json. Or you already had it in your devDependencies
and started using it in a production source.

To save you from embarassing moments like this, you can make rules with the
`dependencyTypes` verb. E.g. to prevent you accidentally depend on a
`devDependency` from anything in `src` add this to your
.dependency-cruiser.json's "forbidden" section:

```json
{
    "name": "not-to-dev-dep",
    "severity": "error",
    "comment": "because an npm i --production will otherwise deliver an unreliably running package",
    "from": { "path": "^src" },
    "to": { "dependencyTypes": ["npm-dev"] }
}
```

Or to detect stuff you npm i'd without putting it in your package.json:

```json
{
    "name": "no-non-package-json",
    "severity": "error",
    "comment": "because an npm i --production will otherwise deliver an unreliably running package",
    "from": { "pathNot": "^(node_modules)"},
    "to": { "dependencyTypes": ["unknown", "undetermined", "npm-no-pkg", "npm-unknown"] }
}
```

If you don't specify dependencyTypes in a rule, dependency-cruiser will ignore
them in the evaluation of that rule.

#### Ok - `unknown`, `npm-unknown`, `undetermined` - I'm officially weirded out - what's that about?

This is a list of dependency types dependency-cruiser currently detects.

 dependency type | meaning | example
 ---             | ---| ---
 local           | a module in your own ('local') package            | "./klont"
 localmodule     | a module in your own ('local') package, but which was in the `resolve.modules` attribute of the webpack config you passed| "shared/stuff.ts"
 npm             | it's a module in package.json's `dependencies`    | "lodash"
 npm-dev         | it's a module in package.json's `devDependencies`      | "chai"
 npm-optional    | it's a module in package.json's `optionalDependencies` | "livescript"
 npm-peer        | it's a module in package.json's `peerDependencies` - note: deprecated in npm 3 | "thing-i-am-a-plugin-for"
 npm-bundled     | it's a module that occurs in package.json's `bundle(d)Dependencies` array | "iwillgetbundled"
 npm-no-pkg      | it's an npm module - but it's nowhere in your package.json | "forgetmenot"
 npm-unknown     | it's an npm module - but there is no (parseable/ valid) package.json in your package |
 deprecated      | it's an npm module, but the version you're using or the module itself is officially deprecated                                | "some-deprecated-package"
 core            | it's a core module                                | "fs"
 aliased         | it's a module that's linked through an aliased (webpack)| "~/hello.ts"
 unknown         | it's unknown what kind of dependency type this is - probably because the module could not be resolved in the first place | "loodash"
 undetermined    | the dependency fell through all detection holes. This could happen with amd dependencies - which have a whole jurasic park of ways to define where to resolve modules to | "veloci!./raptor"


#### `dynamic`
A boolean that tells you whether the dependency is a dynamic one (i.e. 
it uses the async ES import statement a la `import('othermodule').then(pMod => pMod.doStuff())`).

You can use this e.g. to restrict the usage of dynamic dependencies:

```json
{
    "forbidden":[
        {
            "name": "no-non-dynamic-dependencies",
            "severity": "error",
            "from": {},
            "to": { "dynamic": "true" }
        }
    ]
}
```

... or to enforce the use of dynamic dependencies for certain dependencies
```json
{
    "forbidden":[
        {
            "name": "only-dyn-deps-to-otherside",
            "comment": "only dynamically depend on 'otherside' modules",
            "severity": "error",
            "from": {},
            "to": { "path": "@theotherside/", "dynamic": "false" }
        }
    ]
}
```

#### More than one dependencyType per dependency? `moreThanOneDependencyType`
With the flexible character of package.json it's totally possible to specify
a package more than once - e.g. both in the `peerDependencies` and in the
`dependencies`. Sometimes this is intentional (e.g. to make sure a plugin
type package works with both npm 2 and 3), but it can be a typo as well.

Anyway, it's useful to be conscious about it. You can check
for it with a `moreThanOneDependencyType` attribute - which matches these
when set to true:

```json
{
    "name": "no-duplicate-dep-types",
    "severity": "warn",
    "from": {},
    "to": { "moreThanOneDependencyType": true }
}
```

When left out it doesn't matter how many dependency types a dependency has.

(If you're more of an 'allowed' user: it matches the 0 and 1 cases when set to
false).


## The `options`

### `doNotFollow`: don't cruise modules adhering to this pattern any further
> command line option equivalent: `--do-not-follow` (string values only)

If you _do_ want to see certain modules in your reports, but are not interested
in these modules' dependencies, you'd pass the regular expression for those
modules to the `--do-not-follow` (short: `-X`) option. A typical pattern you'd
use with this is "node_modules":

#### Specifying dependency types in `doNotFollow`
> It's not possible to use this on the command line

On the command line you can use `--do-not-follow` to specify a regular expression
for files that dependency-cruiser should cruise, but not follow any further.
In the options section you can restrict what gets cruised by specifying
[dependency types](#dependencytypes). So if e.g. you don't want dependency-cruiser 
to follow external dependencies, in stead of specifying the "node_modules" path:

```json
    "options": {
        "doNotFollow": {
            // "path": "node_modules",
            dependencyTypes: [
                "npm",
                "npm-dev",
                "npm-optional",
                "npm-peer",
                "npm-bundled"
            ]
        }
    }
```

### `exclude`: exclude modules from being cruised
> command line option equivalent: `--exclude`

If you don't want to see certain modules in your report (or not have them
validated), you can exclude them by passing a regular expression to the
`exclude`. E.g. to exclude `node_modules` from being scanned altogether:

```json
"options": {
    "exclude": "node_modules"
}
```

Because it's regular expressions, you can do more interesting stuff here as well. To exclude
all modules with a file path starting with coverage, test or node_modules, you could do this:

```sh
"options": {
    "exclude": "^(coverage|test|node_modules)"
}
```

### `includeOnly`: only include modules satisfying a pattern
> command line option equivalent: `--include-only`

In the `includeOnly` option you can pass a regular expression of all file paths
dependency-cruiser should include in a cruise. It will discard all files
not matching the `includeOnly` pattern.

E.g. to only take modules into account that are in the `src` tree (and exclude all
node_modules, core modules and modules otherwise outside it):

```sh
"options": {
    "includeOnly": "^src/"
}
```

If you specify both an exclude and an include, dependency-cruiser takes them
_both_ into account.


### `maxDepth`
> command line option equivalent: `--max-depth`

Only cruise the specified depth, counting from the specified root-module(s). This
command is mostly useful in combination with visualisation output like _dot_ to
keep the generated output to a manageable size.

This will cruise the dependencies of each file directly in the src folder, up
to a depth of 1:
```javascript
...
  "maxDepth": 1
...
```

<img width="237" alt="max depth = 1" src="real-world-samples/dependency-cruiser-max-depth-1.png">

With `"maxDepth": 2` it'll look like this:

<img width="390" alt="max depth = 2" src="real-world-samples/dependency-cruiser-max-depth-2.png">

And with `"maxDepth": 3` like this:

<img width="623" alt="dependency-cruiser cruised with max depth 3" src="real-world-samples/dependency-cruiser-max-depth-3.png">

#### Usage note
The `maxDepth` option is there to help with visualizing. If your goal is to _validate_
this option is best left alone as you'll miss a dependency or two otherwise.

### `prefix`: prefix links in reports
> command line option equivalent: `--prefix`

If you want the links in the svg output to have a prefix (say,
`https://github.com/you/yourrepo/tree/master/`) so when you click them you'll
open the link on github instead of the local file - pass that in the
`prefix` option, e.g.:

```javascript
...
  "prefix": "https://github.com/sverweij/dependency-cruiser/tree/develop/"
...
```

#### Usage note
Typically you want the prefix to end on a `/`.

### `moduleSystems`
> command line option equivalent: `--module-systems`

Here you can pass a list of module systems dependency-cruiser should use
to detect dependencies. It defaults to `["amd", "cjs", "es6"]`

### `tsPreCompilationDeps`
> command line option equivalent: `--ts-pre-compilation-deps`

By default dependency-cruiser does not take dependencies between typescript
modules that don't exist after compilation to javascript. Pass this command
line switch to _do_ take them into account.

<details>
<summary><b>Pre-compilation dependencies example: only importing a type</b></summary>
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

Normally, without `tsPreCompilationDeps` the output will
look like this:
<img alt="'no import use' with typescript pre-compilation dependencies" src="real-world-samples/only-types-without-pre-compilation-deps.png">

_With_ `tsPreCompilationDeps` the dependency graph _does_ include the
dependency-on-a-type-only from `b.ts` to `a.ts`:

<img alt="'no import use' with typescript pre-compilation dependencies" src="real-world-samples/only-types-with-pre-compilation-deps.png">
</details>

<details>
<summary><b>Pre-compilation dependencies example: import without use</b></summary>

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
Hence, without `tsPreCompilationDeps` dependency-cruiser's
output will look like this:

<img alt="'no import use' without typescript pre-compilation dependencies" src="real-world-samples/no-use-without-pre-compilation-deps.png">

... and with `tsPreCompilationDeps` like this:

<img alt="'no import use' with typescript pre-compilation dependencies" src="real-world-samples/no-use-with-pre-compilation-deps.png">
</details>


### `tsConfig`: use a typescript configuration file ('project')
> command line option equivalent: --ts-config

If dependency-cruiser encounters typescript, it compiles it to understand what it
is looking at. If you have `compilerOptions` in your `tsconfig.json` you think
it should take into account, you can use this option to make it do that.
You might want to do this e.g. if you have `baseDir`/ `paths` keys in your
`tsconfig`, or are using jsx/ tsx outside of a react context.

Dependency-cruiser understands the `extends` configuration in tsconfig's so
if you have a hierarchy of configs, you just need to pass the relevant one.

Sample
```json
  "options": {
  "tsConfig": {
    "fileName": "tsconfig.json"
  }
}
```

You can do it even more minimalistically like so (in which case dependency-cruiser will
assume the fileName to be `tsconfig.json`)
```json
"options": {
  "tsConfig": {}
}
```

#### On the command line
```sh
### use the `tsconfig.json` in the current directory into account when looking
### at typescript sources:
depcruise --ts-config --validate -- src

### use `tsconfig.prod.json for the same purpose:
depcruise --ts-config tsconfig.prod.json --validate -- src
```

#### Usage notes
- The configuration file you can pass as an argument to this option is
  relative to the current working directory.
-  dependency-cruiser currently only looks at the `compilerOptions` key
  in the tsconfig.json and not at other keys (e.g. `files`, `include` and
  `exclude`).


### Yarn Plug'n'Play support - `externalModuleResolutionStrategy`
> there is no command line equivalent for this

If you're using yarn's Plug'n'Play to have external modules resolved and want 
dependency-cruiser to take that into account, set the 
`externalModuleResolutionStrategy` attribute to `yarn-pnp`. The default for this 
attribute is `node_modules` which is the default strategy in the node ecosystem
as well.


### `webpackConfig`: use (the resolution options of) a webpack configuration
> command line option equivalent: `--webpack-config`    
> passing `env` and `arguments` is only available in the configuration file's
> options

Dependency-cruiser will pluck the `resolve` key from the webpack configuration
you pass here and will use that information to resolve files on disk.

```json
"options": {
  "webpackConfig": {
    "fileName": "webpack.config.js"
  }
}
```

Or, shorter, to let dependency-cruiser pick the default webpack.config.js all by
itself:
```json
"options": {
  "webpackConfig": {}
}
```

If your webpack configuration exports a function that takes parameters,
you can provide the parameters like so:
  ```json
  "options": {
    "webpackConfig": {
      "fileName": "webpack.config.js",
      "env": { "production": true },
      "arguments": { "mode": "production" }
    }
  }
  ```

#### Usage notes
- The configuration file you can pass as an argument to this option is
  relative to the current working directory.
- If your webpack config exports an array of configurations,
  dependency-cruiser will only use the resolve options of the first
  configuration in that array.
- For more information check out the the [webpack resolve](https://webpack.js.org/configuration/resolve/)
  documentation.


### Some more esoteric options
#### preserveSymlinks
> command line option equivalent: `--preserve-symlinks`

Whether to leave symlinks as is or resolve them to their realpath. This option defaults
to `false` (which is also nodejs' default behavior since release 6).

#### mono repo behavior - combinedDependencies
If `combinedDependencies` is on `false` (the default) dependency-cruiser will
search for a `package.json` closest up from the source file it investigates.
This is the behavior you expect in a regular repo and in mono repos with
independent packages. When in doubt keep this switch out of your config or
set it to `false`.

<details>
<summary>Example</summary>

- monodash/    
  - package.json    
  - packages/    
     - begindash/    
        - **package.json** <- _only look in this one_    
        - src/    
           - index.ts

With `combinedDependencies` on `true` dependency-cruiser will merge dependencies
from `package.json`s from closest up from the source file until the place you
started the cruise (typically the root of your monorepo). It 'll give
precedence to the dependencies declared in the package.json closest to
the file it investigates:

- monodash/    
 - **package.json** _<- look in this one as well; merge it into the one down the tree_    
 - packages/    
    - begindash/    
       - **package.json** _<- look in this one_    
       - src/    
          - index.ts
</details>

## Configurations in javascript
From version 4.7.0 you can pass a javascript module to `--validate`.
It'll work as long as it exports a valid configuration object
and node can understand it.

This allows you to do all sorts of nifty stuff, like composing
rule sets or using function predicates in rules. For example:

```javascript
const subNotAllowed     = require('rules/sub-not-allowed.json')
const noInterComponents = require('rules/sub-no-inter-components.json')

module.exports = {
    forbidden: [
        subNotAllowed,
        noInterComponents
    ],
    options: {
        tsConfig: {
            fileName: './tsconfig.json'
        }
    }
};
```
