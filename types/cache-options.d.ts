export type cacheStrategyType = "metadata" | "content";

export interface ICacheOptions {
  /**
   * The folder to store the cache in.
   *
   * Defaults to node_modules/.cache/dependency-cruiser/
   */
  folder: string;
  /**
   * The strategy to use for caching.
   * - 'metadata': use git metadata to detect changes;
   * - 'content': use (a checksum of) the contents of files to detect changes.
   *
   * 'content'is useful if you're not on git or work on partial clones
   * (which is typical on CI's). Trade-of: the 'content' strategy is typically
   * slower.
   *
   * Defaults to 'metadata'
   */
  strategy: cacheStrategyType;
  /**
   * Whether to compress the cache or not
   *
   *  Setting this to true adds a few ms to the execution time, but
   * typically reduces the cache size by 80-90%.
   *
   * Defaults to false.
   */
  compress: boolean;
}
