import { readFile } from "node:fs/promises";
import { extname } from "node:path";
import json5 from "json5";

export default async function readConfig(pAbsolutePathToConfigFile) {
  if (
    [".js", ".cjs", ".mjs", ""].includes(extname(pAbsolutePathToConfigFile))
  ) {
    const { default: config } = await import(
      `file://${pAbsolutePathToConfigFile}`
    );
    return config;
  }
  const lConfig = await readFile(pAbsolutePathToConfigFile, "utf8");
  return json5.parse(lConfig);
}
