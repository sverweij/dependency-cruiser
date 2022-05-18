export default {
  "modules": [
    {
      "source": "src/entrypoint.js",
      "dependencies": [
        {
          "resolved": "src/yo.js",
          "coreModule": false,
          "followable": true,
          "couldNotResolve": false,
          "dependencyTypes": ["local"],
          "module": "./yo",
          "moduleSystem": "cjs",
          "dynamic": false,
          "matchesDoNotFollow": false,
          "circular": true,
          "cycle": ["src/yo.js", "src/entrypoint.js"],
          "exoticallyRequired": false,
          "valid": false,
          "rules": [
            {
              "severity": "warn",
              "name": "no-circular"
            }
          ]
        }
      ],
      "orphan": false,
      "valid": true
    },
    {
      "source": "src/yo.js",
      "dependencies": [
        {
          "resolved": "src/entrypoint.js",
          "coreModule": false,
          "followable": true,
          "couldNotResolve": false,
          "dependencyTypes": ["local"],
          "module": "./entrypoint",
          "moduleSystem": "cjs",
          "dynamic": false,
          "matchesDoNotFollow": false,
          "circular": true,
          "cycle": ["src/entrypoint.js", "src/yo.js"],
          "exoticallyRequired": false,
          "valid": false,
          "rules": [
            {
              "severity": "warn",
              "name": "no-circular"
            }
          ]
        }
      ],
      "orphan": false,
      "valid": true
    },
    {
      "source": "src/remi.js",
      "dependencies": [],
      "orphan": true,
      "valid": false,
      "rules": [
        {
          "severity": "warn",
          "name": "no-orphans"
        }
      ]
    }
  ],
  "summary": {
    "violations": [
      {
        "from": "src/entrypoint.js",
        "to": "src/yo.js",
        "rule": {
          "severity": "warn",
          "name": "no-circular"
        },
        "cycle": ["src/yo.js", "src/entrypoint.js"]
      },
      {
        "from": "src/yo.js",
        "to": "src/entrypoint.js",
        "rule": {
          "severity": "warn",
          "name": "no-circular"
        },
        "cycle": ["src/entrypoint.js", "src/yo.js"]
      },
      {
        "from": "src/remi.js",
        "to": "src/remi.js",
        "rule": {
          "severity": "warn",
          "name": "no-orphans"
        }
      }
    ],
    "error": 0,
    "warn": 3,
    "info": 0,
    "totalCruised": 3,
    "totalDependenciesCruised": 2,
    "optionsUsed": {
      "combinedDependencies": false,
      "doNotFollow": {
        "dependencyTypes": [
          "npm",
          "npm-dev",
          "npm-optional",
          "npm-peer",
          "npm-bundled",
          "npm-no-pkg"
        ]
      },
      "externalModuleResolutionStrategy": "node_modules",
      "moduleSystems": ["amd", "cjs", "es6"],
      "outputTo": "-",
      "outputType": "json",
      "preserveSymlinks": false,
      "rulesFile": ".dependency-cruiser.js",
      "tsPreCompilationDeps": false,
      "args": "src"
    },
    "ruleSetUsed": {
      "forbidden": [
        {
          "name": "no-circular",
          "severity": "warn",
          "comment": "This dependency is part of a circular relationship. You might want to revise your solution (i.e. use dependency inversion, make sure the modules have a single responsibility) ",
          "from": {},
          "to": {
            "circular": true
          }
        },
        {
          "name": "no-orphans",
          "severity": "warn",
          "comment": "This dependency is part of a circular relationship. You might want to revise your solution (i.e. use dependency inversion, make sure the modules have a single responsibility) ",
          "from": {
            "orphan": true
          },
          "to": {}
        }
      ]
    }
  }
}
