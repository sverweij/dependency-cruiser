import { ICruiseOptions } from "./cruise-options";
import { ICruiseResult } from "./cruise-result";
import { OutputType } from "./shared-types";
export * from "./rule-set";
export * from "./cruise-options";
export * from "./shared-types";
export * from "./cruise-result";

/**
 * all supported extensions; for each extension whether or not
 * it is supported in the current environment
 */
export const allExtensions: IAvailableExtension[];

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

export interface IReporterOutput {
  /**
   * The output proper of the reporter. For most reporters this will be
   * a string.
   */
  output: ICruiseResult | string;
  /**
   * The exit code - reporters can return a non-zero value when they find
   * errors here. api consumers (like a cli) can use this to return a
   * non-zero exit code, so the build breaks when something is wrong
   *
   * This is e.g. the default behavior of the `err` and `err-long` reporters.
   */
  exitCode: number;
}

/**
 * Cruises the specified files and files with supported extensions in
 * the specified directories in the pFileDirArray and returns the result
 * in an object.
 *
 * @param pFileDirArray   An array of (names of) files, directories and/ or glob patterns
 *                        to start the cruise with
 * @param pOptions        Options that influence the way the dependencies are cruised - and
 *                        how they are returned.
 * @param pResolveOptions Options that influence how dependency references are resolved to disk.
 *                        See https://webpack.js.org/configuration/resolve/ for the details.
 * @param pTSConfig       An object with with a typescript config object. Note that the
 *                        API will not take any 'extends' keys there into account, so
 *                        before calling make sure to flatten them out if you want them
 *                        used (the dependency-cruiser cli does this
 *                        [here](../src/cli/parseTSConfig.js))
 */
export function cruise(
  pFileDirArray: string[],
  pOptions?: ICruiseOptions,
  pResolveOptions?: any,
  pTSConfig?: any
): IReporterOutput;

/**
 * Given a cruise result, formats it with the given reporter (pOutputType)
 *
 * @param pResult     A javascript object that contains the result of a cruise. Must adhere
 *                    to the [dependency-cruiser results schema](https://github.com/sverweij/dependency-cruiser/blob/develop/src/extract/results-schema.json)
 * @param pOutputType Which reporter to use to format the cruise result with
 */
export function format(
  pResult: ICruiseResult,
  pOutputType: OutputType
): IReporterOutput;

/**
 * Returns an array of supported transpilers and for each of the transpilers
 * - the name of the transpiler
 * - the supported version range (semver version range)
 * - whether or not the transpiler is available in the current environment
 */
export function getAvailableTranspilers(): IAvailableTranspiler[];
