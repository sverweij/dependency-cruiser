import { ResolveOptions } from "enhanced-resolve";

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
}
