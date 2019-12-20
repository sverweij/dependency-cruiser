const sharedTypes = require("./shared-types.schema-snippet");

module.exports = {
  properties: {
    forbidden: {
      type: "array",
      description:
        "A list of rules that describe dependencies that are not allowed. dependency-cruiser will emit a separate error (warning/ informational) messages for each violated rule.",
      items: {
        $ref: "#/definitions/ForbiddenRuleType"
      }
    },
    allowed: {
      type: "array",
      description:
        "A list of rules that describe dependencies that are allowed. dependency-cruiser will emit the warning message 'not-in-allowed' for each dependency that does not at least meet one of them.",
      items: {
        $ref: "#/definitions/AllowedRuleType"
      }
    },
    allowedSeverity: {
      $ref: "#/definitions/SeverityType",
      description:
        "Severity to use when a dependency is not in the 'allowed' set of rules. Defaults to 'warn'"
    }
  },
  definitions: {
    AllowedRuleType: {
      oneOf: [
        {
          $ref: "#/definitions/RegularAllowedRuleType"
        },
        {
          $ref: "#/definitions/ReachabilityAllowedRuleType"
        }
      ]
    },
    RegularAllowedRuleType: {
      type: "object",
      required: ["from", "to"],
      additionalProperties: false,
      properties: {
        comment: {
          type: "string"
        },
        from: {
          $ref: "#/definitions/FromRestrictionType"
        },
        to: {
          $ref: "#/definitions/ToRestrictionType"
        }
      }
    },
    ReachabilityAllowedRuleType: {
      type: "object",
      required: ["from", "to"],
      additionalProperties: false,
      properties: {
        comment: {
          type: "string"
        },
        from: {
          $ref: "#/definitions/ReachabilityFromRestrictionType"
        },
        to: {
          $ref: "#/definitions/ReachabilityToRestrictionType"
        }
      }
    },
    ForbiddenRuleType: {
      oneOf: [
        {
          $ref: "#/definitions/RegularForbiddenRuleType"
        },
        {
          $ref: "#/definitions/ReachabilityForbiddenRuleType"
        }
      ]
    },
    RegularForbiddenRuleType: {
      type: "object",
      required: ["from", "to"],
      additionalProperties: false,
      properties: {
        name: {
          type: "string",
          description:
            "A short name for the rule - will appear in reporters to enable customers to quickly identify a violated rule. Try to keep them short, eslint style. E.g. 'not-to-core' for a rule forbidding dependencies on core modules, or 'not-to-unresolvable' for one that prevents dependencies on modules that probably don't exist."
        },
        severity: {
          $ref: "#/definitions/SeverityType"
        },
        comment: {
          type: "string",
          description:
            "You can use this field to document why the rule is there."
        },
        from: {
          $ref: "#/definitions/FromRestrictionType"
        },
        to: {
          $ref: "#/definitions/ToRestrictionType"
        }
      }
    },
    ReachabilityForbiddenRuleType: {
      type: "object",
      required: ["from", "to"],
      additionalProperties: false,
      properties: {
        name: {
          type: "string"
        },
        severity: {
          $ref: "#/definitions/SeverityType"
        },
        comment: {
          type: "string"
        },
        from: {
          $ref: "#/definitions/ReachabilityFromRestrictionType"
        },
        to: {
          $ref: "#/definitions/ReachabilityToRestrictionType"
        }
      }
    },
    FromRestrictionType: {
      type: "object",
      description:
        "Criteria an end of a dependency should match to be caught by this rule. Leave it empty if you want any module to be matched.",
      additionalProperties: false,
      properties: {
        path: {
          type: "string",
          description:
            "A regular expression an end of a dependency should match to be catched by this rule."
        },
        pathNot: {
          type: "string",
          description:
            "A regular expression an end of a dependency should NOT match to be catched by this rule."
        },
        orphan: {
          type: "boolean",
          description:
            "Whether or not to match when the module is an orphan (= has no incoming or outgoing dependencies). When this property it is part of a rule, dependency-cruiser will ignore the 'to' part."
        }
      }
    },
    ReachabilityFromRestrictionType: {
      type: "object",
      description:
        "Criteria an end of a dependency should match to be caught by this rule. Leave it empty if you want any module to be matched.",
      additionalProperties: false,
      properties: {
        path: {
          type: "string",
          description:
            "A regular expression an end of a dependency should match to be catched by this rule."
        },
        pathNot: {
          type: "string",
          description:
            "A regular expression an end of a dependency should NOT match to be catched by this rule."
        }
      }
    },
    ToRestrictionType: {
      type: "object",
      description:
        "Criteria the 'to' end of a dependency should match to be caught by this rule. Leave it empty if you want any module to be matched.",
      additionalProperties: false,
      properties: {
        path: {
          type: "string",
          description:
            "A regular expression an end of a dependency should match to be catched by this rule."
        },
        pathNot: {
          type: "string",
          description:
            "A regular expression an end of a dependency should NOT match to be catched by this rule."
        },
        couldNotResolve: {
          type: "boolean",
          description:
            "Whether or not to match modules dependency-cruiser could not resolve (and probably aren't on disk). For this one too: leave out if you don't care either way."
        },
        circular: {
          type: "boolean",
          description:
            "Whether or not to match when following to the to will ultimately end up in the from."
        },
        dynamic: {
          type: "boolean",
          description:
            "Whether or not to match when the dependency is a dynamic one."
        },
        exoticRequire: {
          type: "string",
          description:
            "A regular expression to match against any 'exotic' require strings"
        },
        exoticRequireNot: {
          type: "string",
          description:
            "A regular expression to match against any 'exotic' require strings - when it should NOT be caught by the rule"
        },
        preCompilationOnly: {
          type: "boolean",
          description:
            "true if this dependency only exists before compilation (like type only imports), false in all other cases. Only returned when the tsPreCompilationDeps is set to 'specify'."
        },
        dependencyTypes: {
          type: "array",
          description:
            "Whether or not to match modules of any of these types (leaving out matches any of them)",
          items: {
            $ref: "#/definitions/DependencyType"
          }
        },
        moreThanOneDependencyType: {
          type: "boolean",
          description:
            "If true matches dependencies with more than one dependency type (e.g. defined in _both_ npm and npm-dev)"
        },
        license: {
          type: "string",
          description:
            'Whether or not to match modules that were released under one of the mentioned licenses. E.g. to flag GPL-1.0, GPL-2.0 licensed modules (e.g. because your app is not compatible with the GPL) use "GPL"'
        },
        licenseNot: {
          type: "string",
          description:
            'Whether or not to match modules that were NOT released under one of the mentioned licenses. E.g. to flag everyting non MIT use "MIT" here'
        }
      }
    },
    ReachabilityToRestrictionType: {
      description:
        "Criteria the 'to' end of a dependency should match to be caught by this rule. Leave it empty if you want any module to be matched.",
      required: ["reachable"],
      additionalProperties: false,
      properties: {
        path: {
          type: "string",
          description:
            "A regular expression an end of a dependency should match to be catched by this rule."
        },
        pathNot: {
          type: "string",
          description:
            "A regular expression an end of a dependency should NOT match to be catched by this rule."
        },
        reachable: {
          type: "boolean",
          description:
            "Whether or not to match modules that aren't reachable from the from part of the rule."
        }
      }
    }
  },
  ...sharedTypes
};
