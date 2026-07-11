export interface IAvailableExtension {
  /**
   * File extension (e.g. ".js", ".ts", ".jsx")
   */
  extension: string;
  /**
   * Whether or not the extension is available as supported in the current environment
   */
  available: boolean;
}

export interface IAvailableTranspiler {
  /**
   * The name of the transpiler (e.g. "typescript", "coffeescript")
   */
  name: string;
  /**
   * A semver version range (e.g. ">=2.0.0 <3.0.0")
   */
  version: string;
  /**
   * Whether or not the transpiler is available in the current environment
   */
  available: boolean;
}
