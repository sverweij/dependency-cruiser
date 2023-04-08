import { readFileSync } from "node:fs";
import JSON5 from "json5";

export function createRequireJSON(pBaseURL) {
  return function requireJSON(pString) {
    return JSON5.parse(readFileSync(new URL(pString, pBaseURL), "utf8"));
  };
}
