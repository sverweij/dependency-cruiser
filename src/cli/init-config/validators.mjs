import { statSync } from "node:fs";
import { toSourceLocationArray } from "./environment-helpers.mjs";

export function validateLocation(pLocations) {
  for (const lLocation of toSourceLocationArray(pLocations)) {
    try {
      if (!statSync(lLocation).isDirectory()) {
        return `'${lLocation}' doesn't seem to be a folder - please try again`;
      }
    } catch (pError) {
      return `'${lLocation}' doesn't seem to exist - please try again`;
    }
  }

  return true;
}
