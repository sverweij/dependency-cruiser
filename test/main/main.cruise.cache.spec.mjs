import { deepStrictEqual } from "node:assert";
import { rmSync } from "node:fs";
import { expect } from "chai";
import Ajv from "ajv";
import cruiseResultSchema from "../../src/schema/cruise-result.schema.mjs";
import cruise from "../../src/main/cruise.mjs";
import Cache from "../../src/cache/cache.mjs";

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

    deepStrictEqual(lResult.output, lCache);
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

    deepStrictEqual(lResult.output, lCache);

    const lResultTwo = await cruise(
      ["test/main/__mocks__/cache"],
      {
        cache: CACHE_FOLDER,
      },
      { bustTheCache: true },
      {},
    );
    Reflect.deleteProperty(lResultTwo.output, "revisionData");
    deepStrictEqual(lResultTwo.output, lResult.output);
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

    deepStrictEqual(lResult.output, lOldCache);

    const lResultTwo = await cruise(
      ["test/main/__mocks__/cache test/main/__mocks__/cache-too "],
      {
        cache: CACHE_FOLDER,
      },
      { bustTheCache: true },
      {},
    );
    const lNewCacheInstance = new Cache();
    const lNewCache = await lNewCacheInstance.read(CACHE_FOLDER);
    Reflect.deleteProperty(lNewCache, "revisionData");
    expect(lNewCache).to.not.deep.equal(lOldCache);
    deepStrictEqual(lNewCache, lResultTwo.output);
    ajv.validate(cruiseResultSchema, lNewCache);
  });
});
