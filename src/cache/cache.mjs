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
import { scannableExtensions } from "#extract/transpile/meta.mjs";
import { bus } from "#utl/bus.mjs";

/**
 * @import { IRevisionData, ICruiseResult } from "../../types/dependency-cruiser.mjs";
 * @import { IStrictCruiseOptions } from "../../types/strict-options.mjs";
 * @import { cacheStrategyType } from "../../types/cache-options.mjs";
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

// see ./cache-rationales.md#cache-format-versioning for rationale & bump instructions
const CACHE_FORMAT_VERSION = 16.2;

export default class Cache {
  /** @type {(IRevisionData | null)=} */
  #revisionData;
  #cacheStrategy;
  #compress;
  /**
   * @param {cacheStrategyType=} pCacheStrategy
   * @param {boolean=} pCompress
   */
  constructor(pCacheStrategy, pCompress) {
    this.#revisionData = null;
    this.#cacheStrategy =
      pCacheStrategy === "content"
        ? new ContentStrategy()
        : new MetadataStrategy();
    this.#compress = pCompress ?? false;
  }
  /**
   *
   * @param {ICruiseResult} pCachedCruiseResult
   * @returns {boolean}
   */
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
    this.#revisionData =
      pRevisionData ??
      (await this.#cacheStrategy.getRevisionData(
        ".",
        pCachedCruiseResult,
        pCruiseOptions,
        {
          extensions: new Set(
            scannableExtensions.concat(pCruiseOptions.extraExtensionsToScan),
          ),
        },
      ));
    this.#revisionData.cacheFormatVersion = CACHE_FORMAT_VERSION;
    bus.debug("cache: compare");
    return (
      this.cacheFormatVersionCompatible(pCachedCruiseResult) &&
      this.#cacheStrategy.revisionDataEqual(
        pCachedCruiseResult.revisionData,
        this.#revisionData,
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
      if (this.#compress === true) {
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
      // see ./cache-rationales.md#cache-compression for rationale
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
    let lRevisionData = pRevisionData ?? this.#revisionData;

    await mkdir(pCacheFolder, { recursive: true });
    const lUncompressedPayload = JSON.stringify(
      this.#cacheStrategy.prepareRevisionDataForSaving(
        pCruiseResult,
        lRevisionData,
      ),
    );
    let lPayload = this.#compact(lUncompressedPayload, this.#compress);

    // relying on writeFile defaults to 'do the right thing' (i.e. utf8
    // when the payload is a string; raw buffer otherwise)
    await writeFile(join(pCacheFolder, CACHE_FILE_NAME), lPayload);
  }
}
