import { readFileSync } from "node:fs";

export function createRequireJSON(pBaseURL) {
  return function requireJSON(pString) {
    return JSON.parse(readFileSync(new URL(pString, pBaseURL), "utf8"));
  };
}
