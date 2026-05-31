import { readFile } from "node:fs/promises";
import { extname } from "node:path";

/**
 *
 * @param {string} pAbsolutePathToConfigFile
 * @returns {Promise<import('../../../types/configuration.mjs').IConfiguration>}
 */
export default async function readConfig(pAbsolutePathToConfigFile) {
  if (
    [".js", ".cjs", ".mjs", ""].includes(extname(pAbsolutePathToConfigFile))
  ) {
    const { default: config } = await import(
      `file://${pAbsolutePathToConfigFile}`
    );
    return config;
  }
  const { default: json5 } = await import("json5");
  return json5.parse(await readFile(pAbsolutePathToConfigFile, "utf8"));
}
