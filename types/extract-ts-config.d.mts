import type { ParsedCommandLine } from "typescript";

/**
 * Reads the file with name `pTSConfigFileName` and returns its parsed
 * contents as an object
 *
 * Silently fails if a supported version of the typescript compiler isn't available
 *
 * @param pTSConfigFileName
 * @return tsconfig as an object
 * @throws {Error} when the tsconfig is invalid/ has errors
 * @throws {TypeError} when the tsconfig is unreadable
 */
export default function extractTSConfig(
  pTSConfigFileName: string,
): ParsedCommandLine;
