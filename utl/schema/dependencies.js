const dependencyType = require("./dependency-type");
const moduleSystemType = require("./module-system-type");
const ruleSummary = require("./rule-summary");

module.exports = {
  definitions: {
    DependenciesType: {
      type: "array",
      items: { $ref: "#/definitions/DependencyType" }
    },
    DependencyType: {
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
            "Whether or not this is a node.js core module - deprecated in favor " +
            "of dependencyType === core"
        },
        dependencyTypes: {
          type: "array",
          items: { $ref: "#/definitions/DependencyTypeType" },
          description:
            "the type of inclusion - local, core, unknown (= we honestly don't " +
            "know), undetermined (= we didn't bother determining it) or one of " +
            "the npm dependencies defined in a package.jsom ('npm' for 'depenencies', " +
            "'npm-dev', 'npm-optional', 'npm-peer', 'npm-no-pkg' for development, " +
            "optional, peer dependencies and dependencies in node_modules but not " +
            "in package.json respectively)"
        },
        license: {
          type: "string",
          description:
            "the license, if known (usually known for modules pulled from npm, " +
            "not for local ones)"
        },
        followable: {
          type: "boolean",
          description:
            "Whether or not this is a dependency that can be followed any further. " +
            "This will be 'false' for for core modules, json, modules that could " +
            "not be resolved to a file and modules that weren't followed because " +
            "it matches the doNotFollow expression."
        },
        dynamic: {
          type: "boolean",
          description:
            "true if this dependency is dynamic, false in all other cases"
        },
        exoticallyRequired: {
          type: "boolean",
          description:
            "true if the dependency was defined by a require function not named" +
            "'require' - false in all other cases"
        },
        exoticRequire: {
          type: "string",
          description:
            "If this dependency was defined by a require not named 'require' (as " +
            "defined in the exoticRequireStrings option): the string that was used"
        },
        matchesDoNotFollow: {
          type: "boolean",
          description:
            "'true' if the file name of this module matches the doNotFollow regular " +
            "expression"
        },
        couldNotResolve: {
          type: "boolean",
          description:
            "'true' if dependency-cruiser could not resulve the module name in " +
            "the source code to a file name or core module. 'false' in all other " +
            "cases."
        },
        circular: {
          type: "boolean",
          description:
            "'true' if following this dependency will ultimately return to the " +
            "source, false in all other cases"
        },
        cycle: {
          type: "array",
          items: { type: "string" },
          description:
            "If following this dependency will ultimately return to the source " +
            "(circular === true), this attribute will contain an (ordered) array " +
            "of module names that shows (one of the) circular path(s)"
        },
        moduleSystem: { $ref: "#/definitions/ModuleSystemType" },
        valid: {
          type: "boolean",
          description:
            "'true' if this dependency violated a rule; 'false' in all other cases. " +
            "The violated rule will be in the 'rule' object at the same level."
        },
        rules: {
          type: "array",
          items: { $ref: "#/definitions/RuleSummaryType" },
          description:
            "an array of rules violated by this dependency - left out if the dependency " +
            "is valid"
        }
      }
    },
    ...dependencyType.definitions,
    ...moduleSystemType.definitions,
    ...ruleSummary.definitions
  }
};
