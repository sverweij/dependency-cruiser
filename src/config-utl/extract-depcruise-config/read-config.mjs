import { readFile } from "node:fs/promises";
import { extname } from "node:path";
import json5 from "json5";

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
  return json5.parse(await readFile(pAbsolutePathToConfigFile, "utf8"));
}
