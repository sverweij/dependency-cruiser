import type { ResolveOptions, CachedInputFileSystem } from "enhanced-resolve";

/**
 * an object with options to pass to the resolver
 * see https://github.com/webpack/enhanced-resolve#resolver-options
 * for a complete list. Extended with some sauce of our own for practical
 * purposes
 */
interface IResolveOptions extends ResolveOptions {
  /**
   *
   * Without bustTheCache (or with the value `false`) the resolver
   * is initialized only once per session. If the attribute
   * equals `true` the resolver is initialized on each call
   * (which is slower, but might is useful in some situations,
   * like in executing unit tests that verify if different
   * passed options yield different results))
   */
  bustTheCache?: boolean;
  /**
   * We're exclusively using CachedInputFileSystem, hence the
   * rude override
   */
  fileSystem: CachedInputFileSystem;

  /**
   * If true also tries to find out whether an external dependency has
   * been deprecated. Flagged because that's a relatively expensive
   * operation. Typically there's no need to set it as dependency-cruiser
   * will derive this from the rule set (if there's at least one rule
   * looking for deprecations it flips this flag to true)
   */
  resolveDeprecations: boolean;
}
