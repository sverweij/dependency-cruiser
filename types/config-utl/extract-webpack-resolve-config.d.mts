import type { ResolveOptions } from "enhanced-resolve";
/**
 * Reads the file with name `pWebpackConfigFilename` and (applying the
 * environment `pEnvironment` and the arguments `pArguments` (which can
 * either be a string or a keys-values object)) returns the resolve config
 * from it as an object.
 *
 * @param pWebpackConfigFilename
 * @param pEnvironment
 * @param pArguments
 * @return webpack resolve config as an object
 * @throws when the webpack config isn't usable (e.g. because it
 *         doesn't exist, or because it's invalid)
 */
export default function extractWebpackResolveConfig(
  pWebpackConfigFilename: string,
  pEnvironment?: { [key: string]: any },
  pArguments?: { [key: string]: any } | string
): Promise<ResolveOptions>;
