// @ts-check
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  brotliCompressSync,
  brotliDecompressSync,
  constants as zlibConstants,
} from "node:zlib";
import { optionsAreCompatible } from "./options-compatible.mjs";
import MetadataStrategy from "./metadata-strategy.mjs";
import ContentStrategy from "./content-strategy.mjs";
// @ts-expect-error ts(2307) - the ts compiler is not privy to the existence of #imports in package.json
import { scannableExtensions } from "#extract/transpile/meta.mjs";
// @ts-expect-error ts(2307) - the ts compiler is not privy to the existence of #imports in package.json
import { bus } from "#utl/bus.mjs";

/**
 * @typedef {import("../../types/dependency-cruiser.mjs").IRevisionData} IRevisionData
 * @typedef {import("../../types/strict-options.mjs").IStrictCruiseOptions} IStrictCruiseOptions
 * @typedef {import("../../types/dependency-cruiser.mjs").ICruiseResult} ICruiseResult
 * @typedef {import("../../types/cache-options.mjs").cacheStrategyType} cacheStrategyType
 */

const CACHE_FILE_NAME = "cache.json";
const EMPTY_CACHE = {
  modules: [],
  summary: {
    error: 0,
    warn: 0,
    info: 0,
    ignore: 0,
    totalCruised: 0,
    violations: [],
    optionsUsed: {},
  },
};
// Bump this to the current major.minor version when the cache format changes in
// a way that's not backwards compatible.
// e.g. version 3.0.0 => 3
//     version 3.1.0 => 3.1
//     version 3.1.1 => 3.1
//     version 3.11.0 => 3.11
// This means we assume breaking cache format versions won't occur
// in patch releases. If worst case scenario it _is_ necessary we could
// add the patch version divided by 1000_000 e.g.:
//     version 3.14.16 => 3.14 + 16/1000_000 = 3.140016
const CACHE_FORMAT_VERSION = 16.2;

export default class Cache {
  /**
   * @param {cacheStrategyType=} pCacheStrategy
   * @param {boolean=} pCompress
   */
  constructor(pCacheStrategy, pCompress) {
    this.revisionData = null;
    this.cacheStrategy =
      pCacheStrategy === "content"
        ? new ContentStrategy()
        : new MetadataStrategy();
    this.compress = pCompress ?? false;
  }

  cacheFormatVersionCompatible(pCachedCruiseResult) {
    return (
      (pCachedCruiseResult?.revisionData?.cacheFormatVersion ?? 1) >=
      CACHE_FORMAT_VERSION
    );
  }

  /**
   * @param {IStrictCruiseOptions} pCruiseOptions
   * @param {ICruiseResult} pCachedCruiseResult
   * @param {IRevisionData=} pRevisionData
   * @returns {Promise<boolean>}
   */
  async canServeFromCache(pCruiseOptions, pCachedCruiseResult, pRevisionData) {
    this.revisionData =
      pRevisionData ??
      (await this.cacheStrategy.getRevisionData(
        ".",
        pCachedCruiseResult,
        pCruiseOptions,
        {
          extensions: new Set(
            scannableExtensions.concat(pCruiseOptions.extraExtensionsToScan),
          ),
        },
      ));
    this.revisionData.cacheFormatVersion = CACHE_FORMAT_VERSION;
    bus.debug("cache: - comparing");
    return (
      this.cacheFormatVersionCompatible(pCachedCruiseResult) &&
      this.cacheStrategy.revisionDataEqual(
        pCachedCruiseResult.revisionData,
        this.revisionData,
      ) &&
      optionsAreCompatible(
        pCachedCruiseResult.summary.optionsUsed,
        pCruiseOptions,
      )
    );
  }

  /**
   * @param {string} pCacheFolder
   * @returns {Promise<ICruiseResult>}
   */
  async read(pCacheFolder) {
    try {
      let lPayload = "";
      if (this.compress === true) {
        const lCompressedPayload = await readFile(
          join(pCacheFolder, CACHE_FILE_NAME),
        );
        const lPayloadAsBuffer = brotliDecompressSync(lCompressedPayload);
        lPayload = lPayloadAsBuffer.toString("utf8");
      } else {
        lPayload = await readFile(join(pCacheFolder, CACHE_FILE_NAME), "utf8");
      }
      return JSON.parse(lPayload);
    } catch (pError) {
      return EMPTY_CACHE;
    }
  }

  /**
   * @param {string} pPayload
   * @param {boolean} pCompress
   * @return {Buffer|string}
   */
  #compact(pPayload, pCompress) {
    if (pCompress) {
      /**
       * we landed on brotli with BROTLI_MIN_QUALITY because:
       * - even with BROTLI_MIN_QUALITY it compresses better than gzip
       *   (regardless of compression level)
       * - at BROTLI_MIN_QUALITY it's faster than gzip
       * - BROTLI_MAX_QUALITY gives a bit better compression but is _much_
       *   slower than even gzip
       *
       * In our situation the sync version is significantly faster than the
       * async version + zlib functions need to be promisified before they
       * can be used in promises, which will add the to the execution time
       * as well.
       *
       * As sync or async doesn't _really_
       * matter for the cli, we're using the sync version here.
       */
      return brotliCompressSync(pPayload, {
        params: {
          [zlibConstants.BROTLI_PARAM_QUALITY]:
            zlibConstants.BROTLI_MIN_QUALITY,
        },
      });
    }
    return pPayload;
  }

  /**
   * @param {string} pCacheFolder
   * @param {ICruiseResult} pCruiseResult
   * @param {IRevisionData=} pRevisionData
   */
  async write(pCacheFolder, pCruiseResult, pRevisionData) {
    let lRevisionData = pRevisionData ?? this.revisionData;

    await mkdir(pCacheFolder, { recursive: true });
    const lUncompressedPayload = JSON.stringify(
      this.cacheStrategy.prepareRevisionDataForSaving(
        pCruiseResult,
        lRevisionData,
      ),
    );
    let lPayload = this.#compact(lUncompressedPayload, this.compress);

    // relying on writeFile defaults to 'do the right thing' (i.e. utf8
    // when the payload is a string; raw buffer otherwise)
    await writeFile(join(pCacheFolder, CACHE_FILE_NAME), lPayload);
  }
}
