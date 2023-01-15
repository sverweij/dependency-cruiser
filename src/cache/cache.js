const { readFileSync, mkdirSync, writeFileSync } = require("fs");
const { join } = require("path");
const meta = require("../extract/transpile/meta");
const { optionsAreCompatible } = require("./options-compatible");
const MetadataStrategy = require("./metadata-strategy");
const ContentStrategy = require("./content-strategy");

const CACHE_FILE_NAME = "cache.json";

module.exports = class Cache {
  /**
   * @param {import("../../types/cache-options").cacheStrategyType=} pCacheStrategy
   */
  constructor(pCacheStrategy) {
    this.revisionData = null;
    this.cacheStrategy =
      pCacheStrategy === "content"
        ? new ContentStrategy()
        : new MetadataStrategy();
  }

  /**
   * @param {import("../../types/strict-options").IStrictCruiseOptions} pCruiseOptions
   * @param {import("../..").ICruiseResult} pCachedCruiseResult
   * @param {import("../..").IRevisionData=} pRevisionData
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
            meta.scannableExtensions.concat(
              pCruiseOptions.extraExtensionsToScan
            )
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
   * @returns {import("../..").ICruiseResult}
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
   * @param {import("../..").ICruiseResult} pCruiseResult
   * @param {import("../..").IRevisionData=} pRevisionData
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
};
