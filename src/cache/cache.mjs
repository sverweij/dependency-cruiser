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

const CACHE_FILE_NAME = "cache.json";

export default class Cache {
  /**
   * @param {import("../../types/cache-options.js").cacheStrategyType=} pCacheStrategy
   * @param {import("../../types/cache-options.js").cacheCompressionType=} pCompress
   */
  constructor(pCacheStrategy, pCompress) {
    this.revisionData = null;
    this.cacheStrategy =
      pCacheStrategy === "content"
        ? new ContentStrategy()
        : new MetadataStrategy();
    this.compress = pCompress ?? false;
  }

  /**
   * @param {import("../../types/strict-options.js").IStrictCruiseOptions} pCruiseOptions
   * @param {import("../../types/dependency-cruiser.js").ICruiseResult} pCachedCruiseResult
   * @param {import("../../types/dependency-cruiser.js").IRevisionData=} pRevisionData
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
    bus.debug("cache: - comparing");
    return (
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
   * @returns {Promise<import("../../types/dependency-cruiser.js").ICruiseResult>}
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
      return { modules: [], summary: {} };
    }
  }

  /**
   * @param {string} pCacheFolder
   * @param {import("../../types/dependency-cruiser.js").ICruiseResult} pCruiseResult
   * @param {import("../../types/dependency-cruiser.js").IRevisionData=} pRevisionData
   */
  async write(pCacheFolder, pCruiseResult, pRevisionData) {
    const lRevisionData = pRevisionData ?? this.revisionData;

    await mkdir(pCacheFolder, { recursive: true });
    const lUncompressedPayload = JSON.stringify(
      this.cacheStrategy.prepareRevisionDataForSaving(
        pCruiseResult,
        lRevisionData,
      ),
    );
    let lPayload = lUncompressedPayload;
    if (this.compress === true) {
      /**
       * we landed on brotli with BROTLI_MIN_QUALITY because:
       * - even with BROTLI_MIN_QUALITY it compresses
       *   better than gzip (regardless of the compression level)
       * - at BROTLI_MIN_QUALITY it's faster than gzip (/ deflate)
       * - BROTLI_MAX_QUALITY gives a bit better compression
       *   but is _much_ slower than even gzip (on compressing)
       *
       * In our situation the sync version is significantly
       * faster than the async version. As sync or async doesn't _really_
       * matter for the cli, we're using the sync version here.
       *
       * (also zlib functions need to promisified first before they can be
       * used in promises, which will add the to the execution time)
       */
      lPayload = brotliCompressSync(lPayload, {
        params: {
          [zlibConstants.BROTLI_PARAM_QUALITY]:
            zlibConstants.BROTLI_MIN_QUALITY,
        },
      });
    }

    // relying on writeFile defaults to 'do the right thing' (i.e. utf8
    // when the payload is a string, raw buffer otherwise)
    await writeFile(join(pCacheFolder, CACHE_FILE_NAME), lPayload);
  }
}
