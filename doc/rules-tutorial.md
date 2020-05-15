# Writing dependency-cruiser rules - a tutorial

## Introduction

This tutorial takes you step by step through writing a rule for
dependency-cruiser. If you're one of those 'quick-to-grasp' types, or you're
just looking for a reference there's a **[rules
reference](./rules-reference.md)** that might better suit your needs.

## Basics

### A simple rule - take 1

Let's say you want to prevent the use of the node core 'http' library for one
reason or other.

```json
{
  "forbidden": [
    {
      "from": {},
      "to": { "path": "http" }
    }
  ]
}
```

This rule says it is `forbidden` to have a relation `from` anything `to` things
with a `path` that contains the string `http`.

You run a depcruise with these rules and lo and behold it comes up with
something:

_warn_ unnamed: **src/secure/index.ts** → **node_modules/@supsec/http/index.js**  
_warn_ unnamed: **src/secure/knappekop.ts** → **node_modules/@supsec/http/index.js**  
_warn_ unnamed: **node_modules/yudelyo/index.js** → **http**  
_warn_ unnamed: **src/secure/index.ts** → **http**  
_warn_ unnamed: **src/secure/index.ts** → **https**

There's a few things you notice:

- dependency-cruiser generates _warnings_. This is the default, but maybe you
  want to stop the build. You'd need _errors_.
- The rule has no name. For this one rule - no problem. If there's more rules it
  might be handy for your future self (and your co-workers) to reference the
  rule.
- The rule matches a little too much for your taste.

Let's see how we can fix that - name and severity first.

### A simple rule - take 2 - adding name and severity

```json
{
  "forbidden": [
    {
      "name": "not-to-core-http",
      "comment": "Don't rely on node's http module because of internal guideline BOYLE-839 - use https and the internal @supsec variant in stead",
      "severity": "error",
      "from": {},
      "to": { "path": "http" }
    }
  ]
}
```

_error_ not-to-core-http: **src/secure/index.ts** → **node_modules/@supsec/http/index.js**  
_error_ not-to-core-http: **src/secure/knappekop.ts** → **node_modules/@supsec/http/index.js**  
_error_ not-to-core-http: **node_modules/yudelyo/index.js** → **http**  
_error_ not-to-core-http: **src/secure/index.ts** → **http**  
_error_ not-to-core-http: **src/secure/index.ts** → **https**

That's a lot easier to understand - _and_ it will stop the build from happening.

### A simple rule - take 3 - tightening the rule down

The rule as it is matches not only the core module, but also `@supsec/http`
_which is module you should actually use_ according to BOYLE-839.
So we should make sure we only match the core module. We can do that by
specifying we want to also match the _dependencyType_ `core`:

```json
{
  "forbidden": [
    {
      "name": "not-to-core-http",
      "comment": "Don't rely on node's http module because of internal guideline BOYLE-839 - use https and the internal @supsec variant in stead",
      "severity": "error",
      "from": {},
      "to": { "dependencyTypes": ["core"], "path": "http" }
    }
  ]
}
```

The result:

_error_ not-to-core-http: **node_modules/yudelyo/index.js** → **http**  
_error_ not-to-core-http: **src/secure/index.ts** → **http**

Now you can go about fixing so `src/secure/index.ts` relies on the internal
`@supsec/http` module, so you're all BOYLE-839 compliant.

### But that pesky node_module relies on a forbidden dependency as well? Watnu?

Yep. Don't you just _love_ those 1500 npm packages you drag in and rely on for
your website to run :grimace: .

Luckily you know `kpttraag`, the author of `yudelyo` - you submit a PR and wait.
In the meantime you don't want to have the build break until `kpttraag` has
found the time to merge your PR.

You realise there might be more npm packages using http too, so ...

- You change the `not-to-core-http` to only generate errors for paths _outside_
  node_modules.
- You add a new rule for node_modules, that just generate a warning. You'll
  still see it in the build logs, but you can go on developing for the time
  being.

```json
{
  "forbidden": [
    {
      "name": "not-to-core-http",
      "comment": "Don't rely on node's http module because of internal guideline BOYLE-839 - use https and the internal @supsec variant in stead",
      "severity": "error",
      "from": { "pathNot": "^node_modules" },
      "to": { "dependencyTypes": ["core"], "path": "^http$" }
    },
    {
      "name": "node_mods-not-to-http",
      "comment": "Some node_modules use http - warn about these so we can replace them/ make PR's so we're BOYLE compliant",
      "severity": "warn",
      "from": { "path": "^node_modules" },
      "to": { "dependencyTypes": ["core"], "path": "^http$" }
    }
  ]
}
```

_warn_ node_mods-not-to-http: **node_modules/yudelyo/index.js** → **http**    
_error_ not-to-core-http: **src/secure/index.ts** → **http**

## {} over { "path": ".+" }

Functionally, `"from": {}` and `"from": { "path": ".+" }` are the same. The way
dependency-cruiser is wired today, however, makes the former faster than the
latter. So - unless you have CPU cycles to spare - use the former one
(`"from": {}`).
