# dependency-cruiser's json output format

The output format contains two sections:

- `modules` - an array of all sources dependency-cruiser visited, each with
  the sources they directly depend upon
- `summary` - a summary with meta information like how many sources got visited,
  how many violations it found, array of the actual violations and the rule set
  and other options used in the cruise.
- `folders` - optional, and only present when needed for validating folder
  specific rules. It's an array of all folders dependency-cruiser visited, their
  folder level depenedencies and some

A [json schema](../src/schema/cruise-result.schema.json) describes the output format
attributes in painstaking detail. The schema is accurate and actual - each build
unit tests assure the output format adheres to the schema. A more accessible version
of the schema is
[this high level graphical overview](https://sverweij.github.io/dependency-cruiser/schema-overview.html),
of the es6 modules the schema is generated from.

A sample output (for the popular [commander.js](https://github.com/tj/commander.js)
module):

```json
{
  "modules": [
    {
      "source": "commander/index.js",
      "dependencies": [
        {
          "resolved": "child_process",
          "coreModule": true,
          "followable": false,
          "couldNotResolve": false,
          "dependencyTypes": ["core"],
          "module": "child_process",
          "moduleSystem": "cjs",
          "valid": true,
          "circular": false
        },
        {
          "resolved": "events",
          "coreModule": true,
          "followable": false,
          "couldNotResolve": false,
          "dependencyTypes": ["core"],
          "module": "events",
          "moduleSystem": "cjs",
          "valid": true,
          "circular": false
        },
        {
          "resolved": "fs",
          "coreModule": true,
          "followable": false,
          "couldNotResolve": false,
          "dependencyTypes": ["core"],
          "module": "fs",
          "moduleSystem": "cjs",
          "valid": true,
          "circular": false
        },
        {
          "resolved": "graceful-readlink/index.js",
          "coreModule": false,
          "followable": true,
          "couldNotResolve": false,
          "dependencyTypes": ["npm"],
          "module": "graceful-readlink",
          "moduleSystem": "cjs",
          "valid": true,
          "circular": false
        },
        {
          "resolved": "path",
          "coreModule": true,
          "followable": false,
          "couldNotResolve": false,
          "dependencyTypes": ["core"],
          "module": "path",
          "moduleSystem": "cjs",
          "valid": true,
          "circular": false
        }
      ]
    },
    {
      "source": "child_process",
      "followable": false,
      "coreModule": true,
      "couldNotResolve": false,
      "dependencyTypes": ["npm"],
      "dependencies": []
    },
    {
      "source": "events",
      "followable": false,
      "coreModule": true,
      "couldNotResolve": false,
      "dependencyTypes": ["core"],
      "dependencies": []
    },
    {
      "source": "fs",
      "followable": false,
      "coreModule": true,
      "couldNotResolve": false,
      "dependencyTypes": ["core"],
      "dependencies": []
    },
    {
      "source": "path",
      "followable": false,
      "coreModule": true,
      "couldNotResolve": false,
      "dependencyTypes": ["core"],
      "dependencies": []
    },
    {
      "source": "graceful-readlink/index.js",
      "dependencies": [
        {
          "resolved": "fs",
          "coreModule": true,
          "followable": false,
          "couldNotResolve": false,
          "dependencyTypes": ["core"],
          "module": "fs",
          "moduleSystem": "cjs",
          "valid": true,
          "circular": false
        }
      ]
    }
  ],
  "summary": {
    "violations": [],
    "error": 0,
    "warn": 0,
    "info": 0,
    "totalCruised": 6,
    "optionsUsed": {
      "outputType": "json"
    }
  }
}
```
