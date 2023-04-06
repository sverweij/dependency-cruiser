import { readFileSync } from "fs";
import { extname } from "path";
import json5 from "json5";

export default async function readConfig(pAbsolutePathToConfigFile) {
  if (
    [".js", ".cjs", ".mjs", ""].includes(extname(pAbsolutePathToConfigFile))
  ) {
    const lConfig = await import(`file://${pAbsolutePathToConfigFile}`);
    return lConfig.default;
  }
  return json5.parse(readFileSync(pAbsolutePathToConfigFile, "utf8"));
}
