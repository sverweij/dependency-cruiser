# dependency-cruiser's validation format
- A [json schema](../src/validate/jsonschema.json) describes the output format.
- Examples:
  - a [starter rule set](./jsonschema.json)
  - dependency-cruiser's [own rule set](../.dependency-cruiser-custom.json)

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
        "comment": "Don't allow dependencies to (typescript or javascript) spec files",
        "severity": "error",
        "from": {},
        "to": { "path": "\\.spec\\.[jt]s$" }
    },{
        "name": "not-to-core-punycode",
        "comment": "Warn about dependencies on the (deprecated) 'punycode' core module (use the userland punycode module instead).",
        "severity": "warn",
        "from": {},
        "to": { "coreModule": true, "path": "^punycode$" }
    },{
        "name": "not-to-unresolvable",
        "comment": "Don't allow dependencies on modules dependency-cruiser can't resolve to files on disk (which probably means they don't exist)",
        "severity": "error",
        "from": {},
        "to": { "couldNotResolve": true }
    }]
}
```
