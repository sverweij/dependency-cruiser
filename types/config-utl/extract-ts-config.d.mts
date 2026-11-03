/**
 * A tsconfig as parsed by the typescript compiler. Declared here as from
 * typescript 7 the package's main entry point doesn't export its
 * ParsedCommandLine type anymore.
 */
export interface IParsedTSConfig {
  /**
   * The compiler options. Options with an enum type (target, module,
   * moduleResolution, jsx, ...) have the enum's (numerical) value.
   */
  options: Record<string, any>;
  /**
   * The (absolute) names of the files the tsconfig includes
   */
  fileNames: string[];
  /**
   * Errors the typescript compiler encountered parsing the tsconfig
   */
  errors: any[];
  /**
   * The tsconfig as read from disk
   */
  raw?: any;
  [key: string]: any;
}

/**
 * Reads the file with name `pTSConfigFileName` and returns its parsed
 * contents as an object
 *
 * Silently fails if a supported version of the typescript compiler isn't available
 *
 * @param pTSConfigFileName
 * @returns tsconfig as an object
 * @throws {Error} when the tsconfig is invalid/ has errors
 * @throws {TypeError} when the tsconfig is unreadable
 */
export default function extractTSConfig(
  pTSConfigFileName: string,
): IParsedTSConfig;
