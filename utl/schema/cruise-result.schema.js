const ruleSet = require("./rule-set.schema-snippet");
const options = require("./options.schema-snippet");

module.exports = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "https://dependency-cruiser.js.org/results-schema",
  title: "dependency-cruiser output format",
  type: "object",
  required: ["summary", "modules"],
  additionalProperties: false,
  properties: {
    summary: {
      type: "object",
      required: [
        "violations",
        "error",
        "warn",
        "info",
        "totalCruised",
        "optionsUsed"
      ],
      additionalProperties: false,
      description: "Data summarizing the found dependencies",
      properties: {
        violations: {
          type: "array",
          description:
            "A list of violations found in the dependencies. The dependencies themselves also contain this information, this summary is here for convenience.",
          items: { $ref: "#/definitions/ViolationType" }
        },
        error: {
          type: "number",
          description: "the number of errors in the dependencies"
        },
        warn: {
          type: "number",
          description: "the number of warnings in the dependencies"
        },
        info: {
          type: "number",
          description:
            "the number of informational level notices in the dependencies"
        },
        totalCruised: {
          type: "number",
          description: "the number of modules cruised"
        },
        totalDependenciesCruised: {
          type: "number",
          description: "the number of dependencies cruised"
        },
        ruleSetUsed: {
          type: "object",
          additionalProperties: false,
          description: "rules used in the cruise",
          properties: { ...ruleSet.properties }
        },
        optionsUsed: { $ref: "#/definitions/OptionsType" }
      }
    },
    modules: {
      type: "array",
      description:
        "A list of modules, with for each module the modules it depends upon",
      items: {
        type: "object",
        required: ["source", "dependencies", "valid"],
        additionalProperties: false,
        properties: {
          source: {
            type: "string",
            description:
              "The (resolved) file name of the module, e.g. 'src/main/index.js'"
          },
          followable: {
            type: "boolean",
            description:
              "Whether or not this is a dependency that can be followed any further. This will be 'false' for for core modules, json, modules that could not be resolved to a file and modules that weren't followed because it matches the doNotFollow expression."
          },
          matchesDoNotFollow: {
            type: "boolean",
            description:
              "'true' if the file name of this module matches the doNotFollow regular expression"
          },
          coreModule: {
            type: "boolean",
            description: "Whether or not this is a node.js core module"
          },
          couldNotResolve: {
            type: "boolean",
            description:
              "'true' if dependency-cruiser could not resolve the module name in the source code to a file name or core module. 'false' in all other cases."
          },
          dependencyTypes: {
            type: "array",
            items: { $ref: "#/definitions/DependencyType" },
            description:
              "the type of inclusion - local, core, unknown (= we honestly don't know), undetermined (= we didn't bother determining it) or one of the npm dependencies defined in a package.jsom ('npm' for 'depenencies', 'npm-dev', 'npm-optional', 'npm-peer', 'npm-no-pkg' for development, optional, peer dependencies and dependencies in node_modules but not in package.json respectively)"
          },
          license: {
            type: "string",
            description:
              "the license, if known (usually known for modules pulled from npm, not for local ones)"
          },
          orphan: {
            type: "boolean",
            description:
              "'true' if this module does not have dependencies, and no module has it as a dependency"
          },
          reachable: {
            type: "array",
            items: { $ref: "#/definitions/ReachableType" },
            description:
              "An array of objects that tell whether this module is 'reachable', and according to rule in which this reachability was defined"
          },
          valid: {
            type: "boolean",
            description:
              "'true' if this module violated a rule; 'false' in all other cases. The violated rule will be in the 'rule' object at the same level."
          },
          rules: {
            type: "array",
            items: { $ref: "#/definitions/RuleSummaryType" },
            description:
              "an array of rules violated by this module - left out if the module is valid"
          },
          dependencies: {
            type: "array",
            items: {
              type: "object",
              required: [
                "module",
                "resolved",
                "coreModule",
                "dependencyTypes",
                "followable",
                "couldNotResolve",
                "moduleSystem",
                "valid",
                "dynamic"
              ],
              additionalProperties: false,
              properties: {
                module: {
                  type: "string",
                  description:
                    "The name of the module as it appeared in the source code, e.g. './main'"
                },
                resolved: {
                  type: "string",
                  description:
                    "The (resolved) file name of the module, e.g. 'src/main//index.js'"
                },
                coreModule: {
                  type: "boolean",
                  description:
                    "Whether or not this is a node.js core module - deprecated in favor of dependencyType === core"
                },
                dependencyTypes: {
                  type: "array",
                  items: { $ref: "#/definitions/DependencyType" },
                  description:
                    "the type of inclusion - local, core, unknown (= we honestly don't know), undetermined (= we didn't bother determining it) or one of the npm dependencies defined in a package.jsom ('npm' for 'depenencies', 'npm-dev', 'npm-optional', 'npm-peer', 'npm-no-pkg' for development, optional, peer dependencies and dependencies in node_modules but not in package.json respectively)"
                },
                license: {
                  type: "string",
                  description:
                    "the license, if known (usually known for modules pulled from npm, not for local ones)"
                },
                followable: {
                  type: "boolean",
                  description:
                    "Whether or not this is a dependency that can be followed any further. This will be 'false' for for core modules, json, modules that could not be resolved to a file and modules that weren't followed because it matches the doNotFollow expression."
                },
                dynamic: {
                  type: "boolean",
                  description:
                    "true if this dependency is dynamic, false in all other cases"
                },
                exoticRequire: {
                  type: "string",
                  description:
                    "If this dependency was defined by a require not named require (as defined in the exoticRequireStrings option): the string that was used"
                },
                matchesDoNotFollow: {
                  type: "boolean",
                  description:
                    "'true' if the file name of this module matches the doNotFollow regular expression"
                },
                couldNotResolve: {
                  type: "boolean",
                  description:
                    "'true' if dependency-cruiser could not resulve the module name in the source code to a file name or core module. 'false' in all other cases."
                },
                circular: {
                  type: "boolean",
                  description:
                    "'true' if following this dependency will ultimately return to the source, false in all other cases"
                },
                cycle: {
                  type: "array",
                  items: { type: "string" },
                  description:
                    "If following this dependency will ultimately return to the source (circular === true), this attribute will contain an (ordered) array of module names that shows (one of the) circular path(s)"
                },
                moduleSystem: { $ref: "#/definitions/ModuleSystemType" },
                valid: {
                  type: "boolean",
                  description:
                    "'true' if this dependency violated a rule; 'false' in all other cases. The violated rule will be in the 'rule' object at the same level."
                },
                rules: {
                  type: "array",
                  items: { $ref: "#/definitions/RuleSummaryType" },
                  description:
                    "an array of rules violated by this dependency - left out if the dependency is valid"
                }
              }
            }
          }
        }
      }
    }
  },
  definitions: {
    ...ruleSet.definitions,
    RuleSummaryType: {
      type: "object",
      description:
        "If there was a rule violation (valid === false), this object contains the name of the rule and severity of violating it.",
      required: ["name", "severity"],
      additionalProperties: false,
      properties: {
        name: {
          type: "string",
          description:
            "The (short, eslint style) name of the violated rule. Typically something like 'no-core-punycode' or 'no-outside-deps'."
        },
        severity: { $ref: "#/definitions/SeverityType" }
      }
    },
    ViolationType: {
      type: "object",
      required: ["from", "to", "rule"],
      additionalProperties: false,
      properties: {
        from: {
          type: "string"
        },
        to: {
          type: "string"
        },
        rule: { $ref: "#/definitions/RuleSummaryType" },
        cycle: {
          type: "array",
          items: { type: "string" },
          description:
            "The circular path if the violation was about circularity"
        }
      }
    },
    OutputType: {
      type: "string",
      enum: [
        "json",
        "html",
        "dot",
        "ddot",
        "csv",
        "err",
        "err-long",
        "err-html",
        "teamcity",
        "anon"
      ]
    },
    ReachableType: {
      type: "object",
      required: ["value", "asDefinedInRule"],
      additionalProperties: false,
      properties: {
        value: {
          type: "boolean",
          description:
            "'true' if this module is reachable from any of the modules matched by the from part of a reachability-rule in 'asDefinedInRule', 'false' if not."
        },
        asDefinedInRule: {
          type: "string",
          description: "The name of the rule where the reachability was defined"
        }
      }
    },
    OptionsType: {
      type: "object",
      description:
        "the (command line) options used to generate the dependency-tree",
      additionalProperties: false,
      properties: {
        ...options.options.properties,
        // does not occur in the input schema
        args: {
          type: "string",
          description: "arguments passed on the command line"
        },
        // does not occur in the input schema
        rulesFile: {
          type: "string",
          description:
            "The rules file used to validate the dependencies (if any)"
        },
        // does not occur in the input schema
        outputTo: {
          type: "string",
          description: "File the output was written to ('-' for stdout)"
        },
        outputType: { $ref: "#/definitions/OutputType" },
        // doNotFollow can be either a string or an object in the input options -
        // in the output it's always an object
        doNotFollow: {
          type: "object",
          description:
            "Criteria for modules to include, but not to follow further",
          additionalProperties: false,
          properties: {
            path: {
              type: "string",
              description:
                "a regular expression for modules to include, but not follow further"
            },
            dependencyTypes: {
              type: "array",
              description:
                "an array of dependency types to include, but not follow further",
              items: { $ref: "#/definitions/DependencyType" }
            }
          }
        },
        // exclude can be either a string or an object in the input options -
        // in the output it's always an object
        exclude: {
          type: "object",
          description: "Criteria for dependencies to exclude",
          additionalProperties: false,
          properties: {
            path: {
              type: "string",
              description:
                "a regular expression for modules to exclude from being cruised"
            },
            dynamic: {
              type: "boolean",
              description:
                "a boolean indicating whether or not to exclude dynamic dependencies"
            }
          }
        },
        // tsConfig can be either a string or an object in the input options -
        // in the output it's always an object
        tsConfig: {
          type: "object",
          additionalProperties: false,
          properties: {
            fileName: {
              type: "string"
            }
          }
        }
      }
    }
  }
};
