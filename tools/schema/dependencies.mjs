import dependencyType from "./dependency-type.mjs";
import moduleSystemType from "./module-system-type.mjs";
import ruleSummary from "./rule-summary.mjs";

export default {
  definitions: {
    DependenciesType: {
      type: "array",
      items: { $ref: "#/definitions/DependencyType" },
    },
    DependencyType: {
      type: "object",
      required: [
        "circular",
        "coreModule",
        "couldNotResolve",
        "dependencyTypes",
        "exoticallyRequired",
        "dynamic",
        "followable",
        "module",
        "moduleSystem",
        "resolved",
        "valid",
      ],
      additionalProperties: false,
      properties: {
        module: {
          type: "string",
          description:
            "The name of the module as it appeared in the source code, e.g. './main'",
        },
        protocol: {
          type: "string",
          enum: ["data:", "file:", "node:"],
          description:
            "If the module specification is an URI with a protocol in it (e.g. " +
            "`import * as fs from 'node:fs'` or " +
            "`import stuff from 'data:application/json,some-thing'`) - this attribute " +
            "holds the protocol part (e.g. 'node:', 'data:', 'file:'). Also see " +
            "https://nodejs.org/api/esm.html#esm_urls",
        },
        mimeType: {
          type: "string",
          description:
            "If the module specification is an URI and contains a mime type, this " +
            "attribute holds the mime type (e.g. in `import stuff from 'data:application/json,some-thing'` " +
            "this would be data:application/json). Also see https://nodejs.org/api/esm.html#esm_urls",
        },
        resolved: {
          type: "string",
          description:
            "The (resolved) file name of the module, e.g. 'src/main/index.js'",
        },
        coreModule: {
          type: "boolean",
          description:
            "Whether or not this is a node.js core module - deprecated in favor " +
            "of dependencyType === core",
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
        followable: {
          type: "boolean",
          description:
            "Whether or not this is a dependency that can be followed any further. " +
            "This will be 'false' for for core modules, json, modules that could " +
            "not be resolved to a file and modules that weren't followed because " +
            "it matches the doNotFollow expression.",
        },
        dynamic: {
          type: "boolean",
          description:
            "true if this dependency is dynamic, false in all other cases",
        },
        exoticallyRequired: {
          type: "boolean",
          description:
            "true if the dependency was defined by a require function not named" +
            "'require' - false in all other cases",
        },
        exoticRequire: {
          type: "string",
          description:
            "If this dependency was defined by a require not named 'require' (as " +
            "defined in the exoticRequireStrings option): the string that was used",
        },
        matchesDoNotFollow: {
          type: "boolean",
          description:
            "'true' if the file name of this module matches the doNotFollow regular " +
            "expression",
        },
        couldNotResolve: {
          type: "boolean",
          description:
            "'true' if dependency-cruiser could not resolve the module name in " +
            "the source code to a file name or core module. 'false' in all other " +
            "cases.",
        },
        preCompilationOnly: {
          type: "boolean",
          description:
            "'true' if the dependency between this dependency and its parent only " +
            "exists before compilation takes place. 'false in all other cases. " +
            "Dependency-cruiser will only specify this attribute for TypeScript and " +
            "then only when the option 'tsPreCompilationDeps' has the value 'specify'.",
        },
        typeOnly: {
          type: "boolean",
          description:
            "'true' when the module included the module explicitly as type only " +
            "with the 'type' keyword e.g. import type { IThingus } from 'thing' " +
            "Dependency-cruiser will only specify this attribute for TypeScript and " +
            "when the 'tsPreCompilationDeps' option has either the value true or 'specify'.",
        },
        circular: {
          type: "boolean",
          description:
            "'true' if following this dependency will ultimately return to the " +
            "source, false in all other cases",
        },
        cycle: {
          type: "array",
          items: { type: "string" },
          description:
            "If following this dependency will ultimately return to the source " +
            "(circular === true), this attribute will contain an (ordered) array " +
            "of module names that shows (one of) the circular path(s)",
        },
        moduleSystem: { $ref: "#/definitions/ModuleSystemType" },
        valid: {
          type: "boolean",
          description:
            "'true' if this dependency violated a rule; 'false' in all other cases. " +
            "The violated rule will be in the 'rules' object at the same level.",
        },
        rules: {
          type: "array",
          items: { $ref: "#/definitions/RuleSummaryType" },
          description:
            "an array of rules violated by this dependency - left out if the dependency " +
            "is valid",
        },
        instability: {
          type: "number",
          description:
            "the (de-normalized) instability of the dependency - also available in " +
            "the module on the 'to' side of this dependency",
        },
      },
    },
    ...dependencyType.definitions,
    ...moduleSystemType.definitions,
    ...ruleSummary.definitions,
  },
};
