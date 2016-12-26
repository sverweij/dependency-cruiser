# Writing dependency-cruiser rules

## Basics
### A simple rule - take 1

Let's say you want to prevent the use of the node core 'http' library for one
reason or other.

```json
{
    "forbidden": [{
        "from": {},
        "to": { "path": "http" }
    }]
}
```

This rule says it is `forbidden` to have a relation `from` anything `to` things
with a `path` that contains the string `http`.

You run a depcruise with these rules and lo and behold it comes up with
something:

*warn* unnamed: **src/secure/index.ts** → **node_modules/@supsec/http/index.js**    
*warn* unnamed: **src/secure/knappekop.ts** → **node_modules/@supsec/http/index.js**    
*warn* unnamed: **node_modules/yudelyo/index.js** → **http**    
*warn* unnamed: **src/secure/index.ts** → **http**    
*warn* unnamed: **src/secure/index.ts** → **https**    

There's a few things you notice:
- dependency-cruiser generates _warnings_. This is the default, but maybe you
  want to stop the build. You'd need _errors_.
- The rule has no name. For this one rule - no probs. If there's more rules it
  might be handy for your future self (and your co-workers) to reference the
  rule.
- The rule matches a little too much for your taste.

Let's see how we can fix that - name and severity first.

### A simple rule - take 2 - adding name and severity

```json
{
    "forbidden": [{
        "name": "not-to-core-http",
        "comment": "Don't rely on node's http module because of internal guideline BOYLE-839 - use https and the internal @supsec variant in stead",
        "severity": "error",
        "from": {},
        "to": { "path": "http" }
    }]
}
```

*error* not-to-core-http: **src/secure/index.ts** → **node_modules/@supsec/http/index.js**    
*error* not-to-core-http: **src/secure/knappekop.ts** → **node_modules/@supsec/http/index.js**    
*error* not-to-core-http: **node_modules/yudelyo/index.js** → **http**    
*error* not-to-core-http: **src/secure/index.ts** → **http**    
*error* not-to-core-http: **src/secure/index.ts** → **https**    

That's a lot easier to understand - *and* it will stop the build from happening.

### A simple rule - take 3 - tightening the rule down

The rule as it is matches not only the core module, but also `@supsec/http`
*which is module you should actually use* according to BOYLE-839.
Dependency-cruiser has a special attribute for core modules with the predictable
name `coreModule`. If we'd add that to the `to` rule
(`"to": { "coreModule": true, "path": "http" }`) we'd be partly covered:

*error* not-to-core-http: **node_modules/yudelyo/index.js** → **http**    
*error* not-to-core-http: **src/secure/index.ts** → **http**    
*error* not-to-core-http: **src/secure/index.ts** → **https**   

... it still matches the `https` package. Luckily the `path` is a regular
expresion, so you bang in a start (`^`) and an end symbol (`$`) and you're good
to go:

```json
{
    "forbidden": [{
        "name": "not-to-core-http",
        "comment": "Don't rely on node's http module because of internal guideline BOYLE-839 - use https and the internal @supsec variant in stead",
        "severity": "error",
        "from": {},
        "to": { "coreModule": true, "path": "^http$" }
    }]
}
```

The result:

*error* not-to-core-http: **node_modules/yudelyo/index.js** → **http**    
*error* not-to-core-http: **src/secure/index.ts** → **http**    

Now you can go about fixing so `src/secure/index.ts` relies on the internal
`@supsec/http` module, so you're all BOYLE-839 compliant.

### But that pesky node_module relies on a forbidden dependency as well? Watnu?
Yep. Don't you just *love* those 1500 npm packages you drag in and rely on for
your website to run :grimace: .

Luckily you know `kpttraag`, the author of `yudelyo` - you submit a PR and wait.
In the mean time you don't want to have the  build break until `kpttraag` has
found the time to merge your PR.

You realize there might be more npm packages using http too, so ...
- You change the `not-to-core-http` to only generate errors for paths *outside*
  node_modules.
- You add a new rule for node_modules, that just generate a warning. You'll
  still see it in the build logs, but you can go on developing for the time
  being.

```json
{
    "forbidden": [{
        "name": "not-to-core-http",
        "comment": "Don't rely on node's http module because of internal guideline BOYLE-839 - use https and the internal @supsec variant in stead",
        "severity": "error",
        "from": {"pathNot": "^node_modules"},
        "to": { "coreModule": true, "path": "^http$" }
    },{
        "name": "node_mods-not-to-http",
        "comment": "Some node_modules use http - warn about these so we can replace them/ make PR's so we're BOYLE compliant",
        "severity": "warn",
        "from": { "path": "^node_modules"},
        "to": { "coreModule": true, "path": "^http$" }
    }]
}
```

*warn* node_mods-not-to-http: **node_modules/yudelyo/index.js** → **http**    
*error* not-to-core-http: **src/secure/index.ts** → **http**    

## {} over { "path": ".+" }
Functionally, `"from": {}` and `"from": { "path": ".+" }` are the same. The way
depencency-cruiser is wired today, however, makes the former faster than the
latter. So - unless you have CPU cycles to spare - use the former one
(`"from": {}`).

## Reference

- Be advised there is a [json schema](../src/validate/jsonschema.json)  
  that describes the output format for your convenience. Dependency-cruiser
  checks rule sets against that schema
- Some examples:
  - a [starter rule set](./rules.starter.json)
  - dependency-cruiser's [own rule set](../.dependency-cruiser-custom.json)

### Forbidden
A list of rules that describe dependencies that are not allowed.
dependency-cruiser will emit a separate error (warning/ informational) messages
for each violated rule.

### Allowed
A list of rules that describe dependencies that are allowed. dependency-cruiser
will emit the warning message 'not-in-allowed' for each dependency that does not
at least one of them.

### Specifying and excluding paths
I chose _regular expressions_ for matching paths over the more traditional
_glob_ because they're more expressive - which makes it easier to specify
rules.

### Attributes
#### path
A regular expression an end of a dependency should match to be catched by this
rule.

#### pathNot
A regular expression an end of a dependency should NOT match to be catched by
this rule.

#### coreModule
> The coreModule attribute is **deprecated**. Use `dependencyTypes`
> in stead (like so: `"dependencyTypes" = ["core"]`)

Whether or not to match node.js core modules. Leave out if you don't care either
way.

#### couldNotResolve
Whether or not to match modules dependency-cruiser could not resolve (and
probably aren't on disk). For this one too: leave out if you don't care either
way.

#### ownFolder
Whether or not to match modules in the same folder as matched with 'from'. This
can be useful in e.g. the following situation:

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
        "from": {"path": "^src/business-components/.+"},
        "to": {
            "path": "^src/business-components/.+"
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

But that'll grow old quadratically fast. Especially when your business
components grow like a flock of rabbits. In stead, you can use

```json
{
    "forbidden": [{
        "name": "no-inter-ubc",
        "comment": "Don't allow relations between code in business components",
        "severity": "error",
        "from": {"path": "^src/business-components/.+"},
        "to": {
            "path": "^src/business-components/.+",
            "ownFolder": false
        }
    }]
}
```

... which makes sure depdendency-cruiser does not match stuff in the from folder
currently being matched.

### dependencyTypes
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

#### Ok - _unknown_, _npm-unknown_, _undetermined_ - I'm officially weirded out - what's that about?

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
type package works with both npm 2 and 3), but it can be


"description": "Whether or not to match modules of any of these types (leaving out matches any of them)",
"items": {
    "type": "string",
    "enum": [



## A starter rule set
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
    }]
}
```
