import dependencies from "./dependencies.mjs";
import dependencyType from "./dependency-type.mjs";
import ruleSummary from "./rule-summary.mjs";

export default {
  definitions: {
    ModulesType: {
      type: "array",
      description:
        "A list of modules, with for each module the modules it depends upon",
      items: { $ref: "#/definitions/ModuleType" },
    },
    ModuleType: {
      type: "object",
      required: ["source", "dependencies", "valid"],
      additionalProperties: false,
      properties: {
        source: {
          type: "string",
          description:
            "The (resolved) file name of the module, e.g. 'src/main/index.js'",
        },
        unresolved: {
          type: "array",
          description:
            "the unresolved name(s) & types this module is also known as",
          items: {
            type: "object",
            required: ["name", "types"],
            properties: {
              name: { type: "string" },
              types: {
                type: "array",
                items: { $ref: "#/definitions/DependencyTypeType" },
              },
            },
          },
        },
        valid: {
          type: "boolean",
          description:
            "'true' if this module violated a rule; 'false' in all other cases. " +
            "The violated rule will be in the 'rule' object at the same level.",
        },
        dependencies: { $ref: "#/definitions/DependenciesType" },
        dependents: {
          type: "array",
          description: "list of modules depending on this module",
          items: {
            type: "string",
            description: "the (resolved) name of the dependent",
          },
        },
        followable: {
          type: "boolean",
          description:
            "Whether or not this is a dependency that can be followed any further. " +
            "This will be 'false' for for core modules, json, modules that could " +
            "not be resolved to a file and modules that weren't followed because " +
            "it matches the doNotFollow expression.",
        },
        matchesDoNotFollow: {
          type: "boolean",
          description:
            "'true' if the file name of this module matches the doNotFollow filter regular " +
            "expression",
        },
        matchesFocus: {
          type: "boolean",
          description:
            "'true' if the file name of this module matches the focus filter regular expression",
        },
        matchesReaches: {
          type: "boolean",
          description:
            "'true' if the file name of this module matches the 'reaches' filter regular expression",
        },
        matchesHighlight: {
          type: "boolean",
          description:
            "'true' if the file name of this module matches the 'highlight' regular expression",
        },
        coreModule: {
          type: "boolean",
          description: "Whether or not this is a node.js core module",
        },
        couldNotResolve: {
          type: "boolean",
          description:
            "'true' if dependency-cruiser could not resolve the module name in " +
            "the source code to a file name or core module. 'false' in all other " +
            "cases.",
        },
        dependencyTypes: {
          type: "array",
          items: { $ref: "#/definitions/DependencyTypeType" },
          description:
            "the type of inclusion - local, core, unknown (= we honestly don't " +
            "know), undetermined (= we didn't bother determining it) or one of " +
            "the npm dependencies defined in a package.json ('npm' for 'dependencies', " +
            "'npm-dev', 'npm-optional', 'npm-peer', 'npm-no-pkg' for development, " +
            "optional, peer dependencies and dependencies in node_modules but not " +
            "in package.json respectively)",
        },
        license: {
          type: "string",
          description:
            "the license, if known (usually known for modules pulled from npm, " +
            "not for local ones)",
        },
        orphan: {
          type: "boolean",
          description:
            "'true' if this module does not have dependencies, and no module has " +
            "it as a dependency",
        },
        reachable: {
          type: "array",
          items: { $ref: "#/definitions/ReachableType" },
          description:
            "An array of objects that tell whether this module is 'reachable', " +
            "and according to rule in which this reachability was defined",
        },
        reaches: {
          type: "array",
          items: { $ref: "#/definitions/ReachesType" },
          description:
            "An array of objects that tell which other modules it reaches, " +
            "and that falls within the definition of the passed rule.",
        },
        rules: {
          type: "array",
          items: { $ref: "#/definitions/RuleSummaryType" },
          description:
            "an array of rules violated by this module - left out if the module " +
            "is valid",
        },
        consolidated: {
          type: "boolean",
          description:
            "true if the module was 'consolidated'. Consolidating implies the " +
            "entity a Module represents might be several modules at the same time. " +
            "This attribute is set by tools that consolidate modules for reporting " +
            "purposes - it will not be present after a regular cruise.",
        },
        instability: {
          type: "number",
          description:
            "number of dependents/ (number of dependents + number of dependencies)" +
            "A measure for how stable the module is; ranging between 0 (completely " +
            "stable module) to 1 (completely instable module). Derived from Uncle " +
            "Bob's instability metric - but applied to a single module instead of " +
            "to a group of them. This attribute is only present when dependency-cruiser " +
            "was asked to calculate metrics.",
        },
        checksum: {
          type: "string",
          description:
            "checksum of the contents of the module. This attribute is currently " +
            "only available when the cruise was executed with caching and the cache " +
            "strategy is 'content'.",
        },
      },
    },
    ReachableType: {
      type: "object",
      required: ["value", "asDefinedInRule", "matchedFrom"],
      additionalProperties: false,
      properties: {
        value: {
          type: "boolean",
          description:
            "'true' if this module is reachable from any of the modules matched by " +
            "the from part of a reachability-rule in 'asDefinedInRule', 'false' if " +
            "not.",
        },
        asDefinedInRule: {
          type: "string",
          description:
            "The name of the rule where the reachability was defined",
        },
        matchedFrom: {
          type: "string",
          description:
            "The matchedFrom attribute shows what the 'from' module " +
            "that causes the 'reachable' information to be what it is. " +
            "Sometimes the 'asDefinedInRule' is not specific enough - e.g. when the " +
            "from part can be many modules and/ or contains capturing groups used in the " +
            "to part of the rule.",
        },
      },
    },
    ReachesType: {
      type: "object",
      required: ["modules", "asDefinedInRule"],
      additionalProperties: false,
      properties: {
        modules: {
          type: "array",
          items: {
            type: "object",
            required: ["source", "via"],
            additionalProperties: false,
            properties: {
              source: {
                type: "string",
              },
              via: {
                type: "array",
                description:
                  "The path along which the 'to' module is reachable from this one.",
                items: { type: "string" },
              },
            },
          },
          description:
            "An array of modules that is (transitively) reachable from this module.",
        },
        asDefinedInRule: {
          type: "string",
          description:
            "The name of the rule within which the reachability is restricted",
        },
      },
    },
    ...dependencies.definitions,
    ...ruleSummary.definitions,
    ...dependencyType.definitions,
  },
};
