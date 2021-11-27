import { IRuleSummary } from "./rule-summary";

export interface IViolation {
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
  cycle?: string[];
  /**
   * The path from the from to the to if the violation is transitive
   */
  via?: string[];
}
