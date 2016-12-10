# API

The typical use for dependency-cruiser is on the command line. However, you
might want to use it programmatically. For this dependency-cruiser has an
an API. While the engine behind the API and the command line interface are
stable <span style="color: orange">the API is under construction</span>.


### Basic use

```javascript
const depcruise = require('dependency-cruiser');

let dependencies = depcruise(["src"]);
```

This will return an object
```
{
    dependencies: ... the dependencies
    meta: {}
}
```

### Options
The second parameter of the depcruise function is an object influencing the
way the dependencies are cruised and how they're returned. For instance to
cruise the src folder, excluding all dependencies to node_modules from being
followed, and having a GraphViz dot script returned, you'd do this:

```javascript
const depcruise = require('dependency-cruiser');

let dependenciesInAGraphVizDotScript = depcruise(
    ["src"]
    {
        exclude    : "(node_modules)",
        system     : ["cjs"],
        outputType : "dot"
    }
);
```

These are all the options:
```
{
 validate   : if true, will attempt to validate with the rules in ruleSet.
              Default false.
 ruleSet    : An object containing the rules to validate against. The rules
              should adhere to the [ruleset schema](../src/validate/jsonschema.json)
 exclude    : regular expression describing which dependencies the function
              should not cruise
 system     : an array of module systems to use for following dependencies;
              defaults to ["es6", "cjs", "amd"]
 outputType : one of "json", "html", "dot", "csv", "err" or "vis". When left
              out the function will return a javascript object as dependencies
}
```

### The return value
```
{
  dependencies : when outputType is defined: a string containing the dependencies
            in the format specified in outputType
            In all other cases: a javascript with the dependencies
  meta    : meta data with a summary of
           { error : the number of errors,
             warn  : the number of warnings,
             info  : the number of informational messages
           }
  (currently meta is filled for 'err' only - NOTE: we'll change this to
            always return this in the near future)
}
```
