# Dependency cruiser rules - reference

## Introduction

- This is a small reference guide to the elements you can use to write rules
  for dependency-cruiser. If you want a step-by-step introduction check the
  [rules _tutorial_](./rules-tutorial.md).
- Be advised there is a [json schema](../src/validate/jsonschema.json)  
  that describes the output format for your convenience. Dependency-cruiser
  checks rule sets against that schema.
- Some examples:
  - a [starter rule set](../src/cli/rules.starter.json) - duplicated for
    perusal on the bottom of this file.
  - dependency-cruiser's [own rule set](../.dependency-cruiser-custom.json)

## The structure of a dependency cruiser rules file
The rules file is in json format. It can contain two sections - `forbidden` and
`allowed`:

```json
{
    "forbidden": [],
    "allowed": []
}
```

### Forbidden
A list of rules that describe dependencies that are not allowed.
dependency-cruiser will emit a separate error (warning/ informational) messages
for each violated rule.

### Allowed
A list of rules that describe dependencies that are allowed. dependency-cruiser
will emit the warning message 'not-in-allowed' for each dependency that does not
at least one of them.

## The structure of an individual rule

An individual rule consists of a 'from' and a 'to' attribute. Each of these
can contain multiple attributes - which are described in the next section.
```json
{
    "from": {},
    "to": {}
}
```

## Attributes
### path
A regular expression an end of a dependency should match to be catched by this
rule.

When path is in a `to` part of a rule it accepts the regular expression
'group matching' special variables `$0`, `$1`, `$2`, ...  as well. See
'group matching' below for an explanation & example.

### pathNot
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


#### 'group matching'
Sometimes you'll want to use a part of the path the 'from' part of your rule
matched and use it in the 'to' part. E.g. when you want to prevent stuff in
the same folder to be matched.

To achieve this you'll need to do two things:
- In the `to` of your rule:    
  Make sure the part of the `path` you want to be matched is between brackets.
  Like so: `"^src/([^/]+)/.+"`
- In the `from` part of your rule:    
  You can reference the part matched between brackets by using `$1` in `path`
  and `pathNot` rules. Like so: `"pathNot": "^src/$1/.+".`
- It is possible to use more than one group per rule as well. E.g. this
  expression `"^src/([^/]+)/[^\.]\.(.+)$"` has two groups; one
  for the folder directly under src, and one for the extension. The first is
  available in the `to` part of your rule with `$1`, the second with `$2`.
- The special variable `$0` contains the _whole_ matched string. I haven't
  seen a practical use for it in the context of depedendency-cruiser, but I'll
  glad to be surprised.

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
you'd specify a rule like this to prevent accidents:

```json
{
    "forbidden": [{
        "name": "no-inter-ubc",
        "comment": "Don't allow relations between code in business components",
        "severity": "error",
        "from": {"path": "^src/business-components/([^/]+)/.+"},
        "to": {
            "path": "^src/business-components/([^/]+)/.+"
        }
    }]
}
```

This will correctly flag relations from one folder to another, but also
relations _within_ folders. It's possible to get around that by specifying it
for each folder explicitly, leaving the current 'from' folder from the to
list e.g.
    from: search, to: upsell|check-out|view-trip|check-in,    
    from: upsell, to: search|check-out|view-trip|check-in,    
    ...

But that'll grow old fast. Quadratically, to be precise. Especially when your
business components breeds like a flock of rabbits. In stead, you can use

```json
{
    "forbidden": [{
        "name": "no-inter-ubc",
        "comment": "Don't allow relations between code in business components",
        "severity": "error",
        "from": {"path": "^src/business-components/([^/]+)/.+"},
        "to": {
            "path": "^src/business-components/([^/]+)/.+",
            "pathNot": "^src/business-components/$1/.+"
        }
    }]
}
```
... which makes sure depdendency-cruiser does not match stuff in the from folder
currently being matched.

### coreModule
> The coreModule attribute is **deprecated**. Use `dependencyTypes`
> in stead (like so: `"dependencyTypes" = ["core"]`)

Whether or not to match node.js core modules. Leave out if you don't care either
way.

### couldNotResolve
Whether or not to match modules dependency-cruiser could not resolve (and
probably aren't on disk). For this one too: leave out if you don't care either
way.

### ownFolder
> The ownFolder attribute is **deprecated**. Use the much more group flexible
> (and straightforward) regular expression grouping feature in stead - see
> 'group matching' below for an explanation.


Whether or not to match modules in the same folder as matched with 'from'.

## dependencyTypes
You might have spent some time wondering why something works on your machine,
but not on other's. Only to discover you _did_ install a dependency, but
_did not_ save it to package.json. Or you already had it in your devDependencies
and started using it in a production source.

To save you from embarassing moments like this, you can make rules with the
`dependencyTypes` verb. E.g. to prevent you accidentally depend on a
`devDependency` from anything in `src`:

```json
{
    "forbidden": [{
        "name": "not-to-dev-dep",
        "severity": "error",
        "comment": "because an npm i --production will otherwise deliver an unreliably running package",
        "from": { "path": "^src" },
        "to": { "dependencyTypes": ["npm-dev"] }
    }]
}
```

Or to detect stuff you npm i'd without putting it in your package.json:

```json
{
    "forbidden": [{
        "name": "no-non-package-json",
        "severity": "error",
        "comment": "because an npm i --production will otherwise deliver an unreliably running package",
        "from": { "pathNot": "^(node_modules)"},
        "to": { "dependencyTypes": ["unknown", "undetermined", "npm-no-pkg", "npm-unknown"] }
    }]
}
```

If you don't specify dependencyTypes in a rule, dependency-cruiser will ignore
them in the evaluation of that rule.

### Ok - _unknown_, _npm-unknown_, _undetermined_ - I'm officially weirded out - what's that about?

This is a list of dependency types dependency-cruiser currently detects.

 dependency type | meaning | example
 ---             | ---| ---
 local           | a module in your own ('local') package            | "./klont"
 npm             | it's a module in package.json's `dependencies`    | "lodash"
 npm-dev         | it's a module in package.json's `devDependencies`      | "chai"
 npm-optional    | it's a module in package.json's `optionalDependencies` | "livescript"
 npm-peer        | it's a module in package.json's `peerDependencies` - note: deprecated in npm 3 | "thing-i-am-a-plugin-for"
 npm-no-pkg      | it's an npm module - but it's nowhere in your package.json | "forgetmenot"
 npm-unknown     | it's an npm module - but there is no (parseable/ valid) package.json in your package |
 core            | it's a core module                                | "fs"
 unknown         | it's unknown what kind of dependency type this is - probably because the module could not be resolved in the first place | "loodash"
 undetermined    | the dependency fell through all detection holes. This could happen with amd dependencies - which have a whole jurasic park of ways to define where to resolve modules to | "veloci!./raptor"

#### More than one dependencyType per dependency?
With the flexible character of package.json it's totally possible to specify
a package more than once - e.g. both in the `peerDependencies` and in the
`dependencies`. Sometimes this is intentional (e.g. to make sure a plugin
type package works with both npm 2 and 3), but it can be a typo as well.

Anyway, it's useful to be conscious about it - you can b.t.w simply check
for it with a `moreThanOneDependencyType` attribute - which matches these
when set to true:

```json
{
    "forbidden": [
        {
            "name": "no-duplicate-dep-types",
            "severity": "warn",
            "from": {},
            "to": { "moreThanOneDependencyType": true }
        }
    ]
}
```

When left out it doesn't matter how many dependency types a dependency has.

(If you're more of an 'allowed' user: it matches the 0 and 1 cases when set to
false).


# A starter rule set
```json
{
    "forbidden": [{
        "name": "not-to-test",
        "comment": "Don't allow dependencies from outside the test folder to test",
        "severity": "error",
        "from": { "pathNot": "^test" },
        "to": { "path": "^test" }
    },{
        "name": "not-to-spec",
        "comment": "Don't allow dependencies to (typescript/ javascript/ coffeescript) spec files",
        "severity": "error",
        "from": {},
        "to": { "path": "\\.spec\\.[js|ts|coffee|litcoffee|coffee\\.md]$" }
    },{
        "name": "not-to-core-punycode",
        "comment": "Warn about dependencies on the (deprecated) 'punycode' core module (use the userland punycode module instead).",
        "severity": "warn",
        "from": {},
        "to": { "moduleTypes": ["core"], "path": "^punycode$" }
    },{
        "name": "not-to-unresolvable",
        "comment": "Don't allow dependencies on modules dependency-cruiser can't resolve to files on disk (which probably means they don't exist)",
        "severity": "error",
        "from": {},
        "to": { "couldNotResolve": true }
    },{
        "name": "not-to-dev-dep",
        "severity": "error",
        "comment": "because an npm i --production will otherwise deliver an unreliably running package",
        "from": { "path": "^src" },
        "to": { "dependencyTypes": ["npm-dev"] }
    },{
        "name": "no-non-package-json",
        "severity": "error",
        "comment": "because an npm i --production will otherwise deliver an unreliably running package",
        "from": { "pathNot": "^node_modules"},
        "to": { "dependencyTypes": ["unknown", "undetermined", "npm-no-pkg", "npm-unknown"] }
    },{
        "name": "optional-deps-used",
        "severity": "info",
        "comment": "nothing serious - but just check you have some serious try/ catches around the import/ requires of these",
        "from": {},
        "to": { "dependencyTypes": ["npm-optional"] }
    },{
        "name": "peer-deps-used",
        "comment": "peer dependencies are deprecated with the advent of npm 3 - and probably gone with version 4. Or with yarn.",
        "severity": "warn",
        "from": {},
        "to": { "dependencyTypes": ["npm-peer"] }
    },{
        "name": "no-duplicate-dep-types",
        "severity": "warn",
        "from": {},
        "to": { "moreThanOneDependencyType": true }
    }]
}
```
