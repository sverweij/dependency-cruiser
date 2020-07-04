import restrictions from "./restrictions.mjs";
import severityType from "./severity-type.mjs";

const RULE_SET_TYPE_PROPERTIES = {
  type: "object",
  additionalProperties: false,
  properties: {
    forbidden: {
      type: "array",
      description:
        "A list of rules that describe dependencies that are not allowed. dependency-cruiser " +
        "will emit a separate error (warning/ informational) messages for each violated " +
        "rule.",
      items: {
        $ref: "#/definitions/ForbiddenRuleType",
      },
    },
    allowed: {
      type: "array",
      description:
        "A list of rules that describe dependencies that are allowed. dependency-cruiser " +
        "will emit the warning message 'not-in-allowed' for each dependency that " +
        "does not at least meet one of them.",
      items: {
        $ref: "#/definitions/AllowedRuleType",
      },
    },
    allowedSeverity: {
      $ref: "#/definitions/SeverityType",
      description:
        "Severity to use when a dependency is not in the 'allowed' set of rules. " +
        "Defaults to 'warn'",
    },
    required: {
      type: "array",
      despcription: "",
      items: {
        $ref: "#/definitions/RequiredRuleType",
      },
    },
  },
};

export default {
  ...RULE_SET_TYPE_PROPERTIES,
  definitions: {
    RuleSetType: RULE_SET_TYPE_PROPERTIES,
    AllowedRuleType: {
      oneOf: [
        {
          $ref: "#/definitions/RegularAllowedRuleType",
        },
        {
          $ref: "#/definitions/ReachabilityAllowedRuleType",
        },
      ],
    },
    RegularAllowedRuleType: {
      type: "object",
      required: ["from", "to"],
      additionalProperties: false,
      properties: {
        comment: {
          type: "string",
        },
        from: {
          $ref: "#/definitions/FromRestrictionType",
        },
        to: {
          $ref: "#/definitions/ToRestrictionType",
        },
      },
    },
    ReachabilityAllowedRuleType: {
      type: "object",
      required: ["from", "to"],
      additionalProperties: false,
      properties: {
        comment: {
          type: "string",
        },
        from: {
          $ref: "#/definitions/ReachabilityFromRestrictionType",
        },
        to: {
          $ref: "#/definitions/ReachabilityToRestrictionType",
        },
      },
    },
    ForbiddenRuleType: {
      oneOf: [
        {
          $ref: "#/definitions/RegularForbiddenRuleType",
        },
        {
          $ref: "#/definitions/ReachabilityForbiddenRuleType",
        },
      ],
    },
    RegularForbiddenRuleType: {
      type: "object",
      required: ["from", "to"],
      additionalProperties: false,
      properties: {
        name: {
          type: "string",
          description:
            "A short name for the rule - will appear in reporters to enable customers " +
            "to quickly identify a violated rule. Try to keep them short, eslint " +
            "style. E.g. 'not-to-core' for a rule forbidding dependencies on core " +
            "modules, or 'not-to-unresolvable' for one that prevents dependencies " +
            "on modules that probably don't exist.",
        },
        severity: {
          $ref: "#/definitions/SeverityType",
        },
        comment: {
          type: "string",
          description:
            "You can use this field to document why the rule is there.",
        },
        from: {
          $ref: "#/definitions/FromRestrictionType",
        },
        to: {
          $ref: "#/definitions/ToRestrictionType",
        },
      },
    },
    ReachabilityForbiddenRuleType: {
      type: "object",
      required: ["from", "to"],
      additionalProperties: false,
      properties: {
        name: {
          type: "string",
        },
        severity: {
          $ref: "#/definitions/SeverityType",
        },
        comment: {
          type: "string",
        },
        from: {
          $ref: "#/definitions/ReachabilityFromRestrictionType",
        },
        to: {
          $ref: "#/definitions/ReachabilityToRestrictionType",
        },
      },
    },
    RequiredRuleType: {
      type: "object",
      required: ["from", "to"],
      additionalProperties: false,
      properties: {
        name: {
          type: "string",
        },
        severity: {
          $ref: "#/definitions/SeverityType",
        },
        comment: {
          type: "string",
        },
        from: {
          $ref: "#/definitions/RequiredFromRestrictionType",
        },
        to: {
          $ref: "#/definitions/RequiredToRestrictionType",
        },
      },
    },
    ...restrictions.definitions,
    ...severityType.definitions,
  },
};
