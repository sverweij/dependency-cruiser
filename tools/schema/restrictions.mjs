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
            'the mentioned licenses. E.g. to flag everyting non MIT use "MIT" here',
          $ref: "#/definitions/REAsStringsType",
        },
      },
    },
    ReachabilityToRestrictionType: {
      description:
        "Criteria the 'to' end of a dependency should match to be caught by this " +
        "rule. Leave it empty if you want any module to be matched.",
      required: ["reachable"],
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
      additionalProperties: false,
      properties: {
        ...BASE_RESTRICTION,
      },
    },
    RequiredToRestrictionType: {
      description: "Criteria for modules the associated module must depend on.",
      required: [],
      additionalProperties: false,
      properties: {
        path: {
          description:
            "Criteria at least one dependency of each matching module must" +
            "adhere to.",
          $ref: "#/definitions/REAsStringsType",
        },
      },
    },
    ...dependencyType.definitions,
    ...REAsStringsType.definitions,
  },
};
