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

export default class Cache {
  /**
   * @param {import("../../types/cache-options.js").cacheStrategyType=} pCacheStrategy
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
        // @ts-expect-error ts(2345) - it's indeed not strict cruise options,
        // but it will do for now (_it works_)
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
    let lPayload = this.#compact(lUncompressedPayload, this.compress);

    // relying on writeFile defaults to 'do the right thing' (i.e. utf8
    // when the payload is a string; raw buffer otherwise)
    await writeFile(join(pCacheFolder, CACHE_FILE_NAME), lPayload);
  }
}
