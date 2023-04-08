import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { scannableExtensions } from "../extract/transpile/meta.mjs";
import { optionsAreCompatible } from "./options-compatible.mjs";
import MetadataStrategy from "./metadata-strategy.mjs";
import ContentStrategy from "./content-strategy.mjs";

const CACHE_FILE_NAME = "cache.json";

export default class Cache {
  /**
   * @param {import("../../types/cache-options.js").cacheStrategyType=} pCacheStrategy
   */
  constructor(pCacheStrategy) {
    this.revisionData = null;
    this.cacheStrategy =
      pCacheStrategy === "content"
        ? new ContentStrategy()
        : new MetadataStrategy();
  }

  /**
   * @param {import("../../types/strict-options.js").IStrictCruiseOptions} pCruiseOptions
   * @param {import("../../types/dependency-cruiser.js").ICruiseResult} pCachedCruiseResult
   * @param {import("../../types/dependency-cruiser.js").IRevisionData=} pRevisionData
   * @returns {boolean}
   */
  canServeFromCache(pCruiseOptions, pCachedCruiseResult, pRevisionData) {
    this.revisionData =
      pRevisionData ??
      this.cacheStrategy.getRevisionData(
        ".",
        pCachedCruiseResult,
        pCruiseOptions,
        {
          extensions: new Set(
            scannableExtensions.concat(pCruiseOptions.extraExtensionsToScan)
          ),
        }
      );
    return (
      this.cacheStrategy.revisionDataEqual(
        pCachedCruiseResult.revisionData,
        this.revisionData
      ) &&
      optionsAreCompatible(
        pCachedCruiseResult.summary.optionsUsed,
        pCruiseOptions
      )
    );
  }

  /**
   * @param {string} pCacheFolder
   * @returns {import("../../types/dependency-cruiser.js").ICruiseResult}
   */
  read(pCacheFolder) {
    try {
      return JSON.parse(
        readFileSync(join(pCacheFolder, CACHE_FILE_NAME), "utf8")
      );
    } catch (pError) {
      return { modules: [], summary: {} };
    }
  }

  /**
   * @param {string} pCacheFolder
   * @param {import("../../types/dependency-cruiser.js").ICruiseResult} pCruiseResult
   * @param {import("../../types/dependency-cruiser.js").IRevisionData=} pRevisionData
   */
  write(pCacheFolder, pCruiseResult, pRevisionData) {
    const lRevisionData = pRevisionData ?? this.revisionData;

    mkdirSync(pCacheFolder, { recursive: true });
    writeFileSync(
      join(pCacheFolder, CACHE_FILE_NAME),
      JSON.stringify(
        this.cacheStrategy.prepareRevisionDataForSaving(
          pCruiseResult,
          lRevisionData
        )
      ),
      "utf8"
    );
  }
}
