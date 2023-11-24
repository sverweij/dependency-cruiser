import type { ICruiseOptions } from "./options.d.mts";
import type { IFlattenedRuleSet } from "./rule-set.d.mts";

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
