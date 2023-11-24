import type { SeverityType } from "./shared-types.mjs";

/**
 * If there was a rule violation (valid === false), this object contains the name of the
 * rule and severity of violating it.
 */

export interface IRuleSummary {
  /**
   * The (short, eslint style) name of the violated rule. Typically something like
   * 'no-core-punycode' or 'no-outside-deps'.
   */
  name: string;
  /**
   * How severe a violation of a rule is. The 'error' severity will make some reporters return
   * a non-zero exit code, so if you want e.g. a build to stop when there's a rule violated:
   * use that. The absence of the 'ignore' severity here is by design; ignored rules don't
   * show up in the output.
   *
   * Severity to use when a dependency is not in the 'allowed' set of rules. Defaults to 'warn'
   */
  severity: SeverityType;
}
