import { ICruiseOptions } from "./options";
import { IFlattenedRuleSet } from "./rule-set";

export interface IConfiguration extends IFlattenedRuleSet {
  /**
   * A (node require resolvable) file path to a dependency-cruiser config
   * that serves as the base for this one...
   * ... or an array of these
   */
  extends?: string | string[];
  /**
   * Runtime configuration options
   */
  options?: ICruiseOptions;
}

// for backwards compatibility:
/**
 * @deprecated use IConfiguration instead
 */
export type IRuleSetType = IConfiguration;
