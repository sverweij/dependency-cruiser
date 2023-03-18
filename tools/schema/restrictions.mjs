import REAsStringsType from "./re-as-strings-type.mjs";
import dependencyType from "./dependency-type.mjs";

const BASE_RESTRICTION = {
  path: {
    description:
      "A regular expression or an array of regular expressions an end of a " +
      "dependency should match to be caught by this rule.",
    $ref: "#/definitions/REAsStringsType",
  },
  pathNot: {
    description:
      "A regular expression or an array of regular expressions an end of a " +
      "dependency should NOT match to be caught by this rule.",
    $ref: "#/definitions/REAsStringsType",
  },
};

export default {
  definitions: {
    FromRestrictionType: {
      type: "object",
      description:
        "Criteria an end of a dependency should match to be caught by this rule. " +
        "Leave it empty if you want any module to be matched.",
      additionalProperties: false,
      properties: {
        ...BASE_RESTRICTION,
        orphan: {
          type: "boolean",
          description:
            "Whether or not to match when the module is an orphan (= has no incoming " +
            "or outgoing dependencies). When this property it is part of a rule, " +
            "dependency-cruiser will ignore the 'to' part.",
        },
      },
    },
    ReachabilityFromRestrictionType: {
      type: "object",
      description:
        "Criteria an end of a dependency should match to be caught by this rule. " +
        "Leave it empty if you want any module to be matched.",
      additionalProperties: false,
      properties: {
        ...BASE_RESTRICTION,
      },
    },
    ToRestrictionType: {
      type: "object",
      description:
        "Criteria the 'to' end of a dependency should match to be caught by this " +
        "rule. Leave it empty if you want any module to be matched.",
      additionalProperties: false,
      properties: {
        ...BASE_RESTRICTION,
        couldNotResolve: {
          type: "boolean",
          description:
            "Whether or not to match modules dependency-cruiser could not resolve " +
            "(and probably aren't on disk). For this one too: leave out if you don't " +
            "care either way.",
        },
        circular: {
          type: "boolean",
          description:
            "Whether or not to match when following to the to will ultimately end " +
            "up in the from.",
        },
        dynamic: {
          type: "boolean",
          description:
            "Whether or not to match when the dependency is a dynamic one.",
        },
        exoticallyRequired: {
          type: "boolean",
          description:
            "Whether or not to match when the dependency is exotically required.",
        },
        exoticRequire: {
          description:
            "A regular expression to match against any 'exotic' require strings",
          $ref: "#/definitions/REAsStringsType",
        },
        exoticRequireNot: {
          description:
            "A regular expression to match against any 'exotic' require strings - " +
            "when it should NOT be caught by the rule",
          $ref: "#/definitions/REAsStringsType",
        },
        preCompilationOnly: {
          type: "boolean",
          description:
            "true if this dependency only exists before compilation (like type only " +
            "imports), false in all other cases. Only returned when the tsPreCompilationDeps " +
            "is set to 'specify'.",
        },
        dependencyTypes: {
          type: "array",
          description:
            "Whether or not to match modules of any of these types (leaving out " +
            "matches any of them)",
          items: {
            $ref: "#/definitions/DependencyTypeType",
          },
        },
        dependencyTypesNot: {
          type: "array",
          description:
            "Whether or not to match modules NOT of any of these types (leaving out " +
            "matches none of them)",
          items: {
            $ref: "#/definitions/DependencyTypeType",
          },
        },
        moreThanOneDependencyType: {
          type: "boolean",
          description:
            "If true matches dependencies with more than one dependency type (e.g. " +
            "defined in _both_ npm and npm-dev)",
        },
        license: {
          description:
            "Whether or not to match modules that were released under one of the " +
            "mentioned licenses. E.g. to flag GPL-1.0, GPL-2.0 licensed modules " +
            '(e.g. because your app is not compatible with the GPL) use "GPL"',
          $ref: "#/definitions/REAsStringsType",
        },
        licenseNot: {
          description:
            "Whether or not to match modules that were NOT released under one of " +
            'the mentioned licenses. E.g. to flag everything non MIT use "MIT" here',
          $ref: "#/definitions/REAsStringsType",
        },
        via: {
          description:
            "For circular dependencies - whether or not to match cycles that include " +
            "some modules with this regular expression. If you want to match cycles that " +
            "_exclusively_ include modules satisfying the regular expression use the viaOnly " +
            "restriction." +
            "E.g. to allow all cycles, " +
            "except when they go through one specific module. Typically to temporarily " +
            "disallow some cycles with a lower severity - setting up a rule with a via " +
            "that ignores them in an 'allowed' section.",
          $ref: "#/definitions/REAsStringsType",
        },
        viaOnly: {
          description:
            "For circular dependencies - whether or not to match cycles that include " +
            "exclusively modules with this regular expression. This is different from " +
            "the regular via that already matches when only some of the modules in the " +
            "cycle satisfy the regular expression",
          $ref: "#/definitions/REAsStringsType",
        },
        viaNot: {
          description:
            "For circular dependencies - whether or not to match cycles that include " +
            "_only_ modules that don't satisfy this regular expression. E.g. to disallow all cycles, " +
            "except when they go through one specific module. Typically to temporarily " +
            "allow some cycles until they're removed.",
          $ref: "#/definitions/REAsStringsType",
        },
        viaSomeNot: {
          description:
            "For circular dependencies - whether or not to match cycles that include " +
            "_some_ modules that don't satisfy this regular expression. ",
          $ref: "#/definitions/REAsStringsType",
        },
        moreUnstable: {
          type: "boolean",
          description:
            "When set to true moreUnstable matches for any dependency that has a higher " +
            "Instability than the module that depends on it. When set to false it matches " +
            "when the opposite is true; the dependency has an equal or lower Instability. " +
            "This attribute is useful when you want to check against Robert C. Martin's " +
            "stable dependency principle. See online documentation for examples and details. " +
            "Leave this out when you don't care either way.",
        },
      },
    },
    DependentsModuleRestrictionType: {
      description:
        "Criteria to select the module(s) this restriction should apply to",
      required: [],
      type: "object",
      additionalProperties: false,
      properties: {
        ...BASE_RESTRICTION,
        numberOfDependentsLessThan: {
          type: "integer",
          description:
            "Matches when the number of times the 'to' module is used falls below (<) " +
            "this number. Caveat: only works in concert with path and pathNot restrictions " +
            "in the from and to parts of the rule; other conditions will be ignored." +
            "(somewhat experimental; - syntax can change over time without a major bump)" +
            "E.g. to flag modules that are used only once or not at all, use 2 here.",
          minimum: 0,
          maximum: 100,
        },
        numberOfDependentsMoreThan: {
          type: "integer",
          description:
            "Matches when the number of times the 'to' module is used raises above (>) " +
            "this number. Caveat: only works in concert with path and pathNot restrictions " +
            "in the from and to parts of the rule; other conditions will be ignored." +
            "(somewhat experimental; - syntax can change over time without a major bump)" +
            "E.g. to flag modules that are used more than 10 times, use 10 here.",
          minimum: 0,
          maximum: 100,
        },
      },
    },
    DependentsFromRestrictionType: {
      description:
        "Criteria the dependents of the module should adhere to be caught by this rule " +
        "rule. Leave it empty if you want any dependent to be matched.",
      required: [],
      type: "object",
      additionalProperties: false,
      properties: {
        ...BASE_RESTRICTION,
      },
    },
    ReachabilityToRestrictionType: {
      description:
        "Criteria the 'to' end of a dependency should match to be caught by this " +
        "rule. Leave it empty if you want any module to be matched.",
      required: ["reachable"],
      type: "object",
      additionalProperties: false,
      properties: {
        ...BASE_RESTRICTION,
        reachable: {
          type: "boolean",
          description:
            "Whether or not to match modules that aren't reachable from the from " +
            "part of the rule.",
        },
      },
    },
    RequiredModuleRestrictionType: {
      description:
        "Criteria to select the module(s) this restriction should apply to",
      required: [],
      type: "object",
      additionalProperties: false,
      properties: {
        ...BASE_RESTRICTION,
      },
    },
    RequiredToRestrictionType: {
      description: "Criteria for modules the associated module must depend on.",
      required: [],
      type: "object",
      additionalProperties: false,
      properties: {
        path: {
          description:
            "Criteria at least one dependency of each matching module must " +
            "adhere to.",
          $ref: "#/definitions/REAsStringsType",
        },
      },
    },
    ...dependencyType.definitions,
    ...REAsStringsType.definitions,
  },
};
