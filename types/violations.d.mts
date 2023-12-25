import type { IRuleSummary } from "./rule-summary.mjs";
import type { IMiniDependency, ViolationType } from "./shared-types.mjs";

export interface IMetricsSummary {
  from: {
    instability: number;
  };
  to: {
    instability: number;
  };
}

export interface IViolation {
  /**
   * Type of violation. When left out assumed to be of type 'dependency'
   */
  type?: ViolationType;
  /**
   * The violated rule
   */
  rule: IRuleSummary;
  /**
   * The from part of the dependency this violation is about
   */
  from: string;
  /**
   * The to part of the dependency this violation is about
   */
  to: string;
  /**
   * The circular path if the violation is about circularity
   */
  cycle?: IMiniDependency[];
  /**
   * The path from the from to the to if the violation is transitive
   */
  via?: IMiniDependency[];
  /**
   * metrics - when the violation pertains to a violation of a metrics
   * principle
   */
  metrics?: IMetricsSummary;
  /**
   * Free format text you can e.g. use to explain why this violation
   * can be ignored or is quarantined (only used in known violations)
   */
  comment?: string;
}
