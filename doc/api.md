# API

The typical use for dependency-cruiser is on the command line. However, you
might want to use it programmatically. For this, dependency-cruiser has an
API. While the engine behind the API and the command line interface are
stable *the API is under construction*.


### Basic use

```javascript
const depcruise = require('dependency-cruiser').cruise;

let dependencies = depcruise(["src"]).output;
```

This will return an object
```javascript
{
    dependencies: ... the dependencies
    summary: {}
}
```

See [dependency-cruiser's json output format](output-format.md) for details.

### Parameters

#### Files and or folders to cruise
The first parameter is an array of strings, each of which is a file, folder
and/ or glob pattern to start the cruise with.

#### Options
The second parameter of the depcruise function is an object influencing the
way the dependencies are cruised and how they're returned. For instance to
cruise the src folder, excluding all dependencies to node_modules from being
followed, and having a GraphViz dot script returned, you'd do this:

```javascript
const depcruise = require('dependency-cruiser');

const dependenciesInAGraphVizDotScript = depcruise(
    ["src"]
    {
        exclude       : "(node_modules)",
        moduleSystems : ["cjs"],
        outputType    : "dot"
    }
).output;
```

Apart from all the options mentioned in the [options section](rules-reference.md#the-options) of the [rules reference](rules-reference.md)

option| meaning
--- | ---
validate | if true, will attempt to validate with the rules in ruleSet - defaults to false.
ruleSet | An object containing the rules to validate against. The rules should adhere to the [ruleset schema](../src/main/ruleSet/config-schema.json)
outputType | One of the output types mentioned in the [--output-format](cli.md#--output-type-specify-the-output-format) command line options

### Return value
An object with two attributes:

attribute|content
---|---
output|the result of the cruise. The outputType you pass in the options determines how it will look. If you don't supply an outputType it will will contain a javascript object that adheres to dependency-cruiser's [results schema](../src/extract/results-schema.json).
exitCode|The exit code the command line (typically 0, but some reporters will return a non-zero value in here e.g. when errors were detected in the output)
