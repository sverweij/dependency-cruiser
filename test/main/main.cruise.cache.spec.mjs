import { deepEqual, notDeepStrictEqual } from "node:assert/strict";
import { rmSync } from "node:fs";
import Ajv from "ajv";
import cruiseResultSchema from "#cruise-result-schema";
import Cache from "#cache/cache.mjs";
import cruise from "#main/cruise.mjs";

const ajv = new Ajv();

const CACHE_FOLDER =
  "test/main/__mocks__/cache/node_modules/.cache/dependency-cruiser";

describe("[E] main.cruise - cache", () => {
  beforeEach("clean the cache", () => {
    rmSync(CACHE_FOLDER, { force: true, recursive: true });
  });
  after("clean the cache", () => {
    rmSync(CACHE_FOLDER, { force: true, recursive: true });
  });

  it("cruising fills the cache", async () => {
    const lResult = await cruise(
      ["test/main/__mocks__/cache"],
      {
        cache: CACHE_FOLDER,
      },
      { bustTheCache: true },
      {},
    );
    const lCacheInstance = new Cache();
    const lCache = await lCacheInstance.read(CACHE_FOLDER);
    Reflect.deleteProperty(lCache, "revisionData");

    deepEqual(lResult.output, lCache);
    ajv.validate(cruiseResultSchema, lResult.output);
  });

  it("cruising twice yields the same result (minus 'revisionData')", async () => {
    const lResult = await cruise(
      ["test/main/__mocks__/cache"],
      {
        cache: CACHE_FOLDER,
      },
      { bustTheCache: true },
      {},
    );
    const lCacheInstance = new Cache();
    const lCache = await lCacheInstance.read(CACHE_FOLDER);
    Reflect.deleteProperty(lCache, "revisionData");

    deepEqual(lResult.output, lCache);

    const lResultTwo = await cruise(
      ["test/main/__mocks__/cache"],
      {
        cache: CACHE_FOLDER,
      },
      { bustTheCache: true },
      {},
    );
    Reflect.deleteProperty(lResultTwo.output, "revisionData");
    deepEqual(lResultTwo.output, lResult.output);
    ajv.validate(cruiseResultSchema, lResultTwo.output);
  });

  it("cruising twice with non-compatible arguments yields different results", async () => {
    const lResult = await cruise(
      ["test/main/__mocks__/cache"],
      {
        cache: CACHE_FOLDER,
      },
      { bustTheCache: true },
      {},
    );
    const lCacheInstance = new Cache();
    const lOldCache = await lCacheInstance.read(CACHE_FOLDER);
    Reflect.deleteProperty(lOldCache, "revisionData");

    deepEqual(lResult.output, lOldCache);

    const lResultTwo = await cruise(
      ["test/main/__mocks__/cache", "test/main/__mocks__/cache-too"],
      {
        cache: CACHE_FOLDER,
      },
      { bustTheCache: true },
      {},
    );
    const lNewCacheInstance = new Cache();
    const lNewCache = await lNewCacheInstance.read(CACHE_FOLDER);
    Reflect.deleteProperty(lNewCache, "revisionData");
    notDeepStrictEqual(lNewCache, lOldCache);
    deepEqual(lNewCache, lResultTwo.output);
    ajv.validate(cruiseResultSchema, lNewCache);
  });
});
