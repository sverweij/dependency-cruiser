import { rmSync } from "node:fs";
import { expect, use } from "chai";
import chaiJSONSchema from "chai-json-schema";
import cruiseResultSchema from "../../src/schema/cruise-result.schema.mjs";
import cruise from "../../src/main/cruise.mjs";
import Cache from "../../src/cache/cache.mjs";

use(chaiJSONSchema);

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
      {}
    );
    const lCacheInstance = new Cache();
    const lCache = await lCacheInstance.read(CACHE_FOLDER);
    Reflect.deleteProperty(lCache, "revisionData");

    expect(lResult.output).to.deep.equal(lCache);
    expect(lResult.output).to.be.jsonSchema(cruiseResultSchema);
  });

  it("cruising twice yields the same result (minus 'revisionData')", async () => {
    const lResult = await cruise(
      ["test/main/__mocks__/cache"],
      {
        cache: CACHE_FOLDER,
      },
      { bustTheCache: true },
      {}
    );
    const lCacheInstance = new Cache();
    const lCache = await lCacheInstance.read(CACHE_FOLDER);
    Reflect.deleteProperty(lCache, "revisionData");

    expect(lResult.output).to.deep.equal(lCache);

    const lResultTwo = await cruise(
      ["test/main/__mocks__/cache"],
      {
        cache: CACHE_FOLDER,
      },
      { bustTheCache: true },
      {}
    );
    Reflect.deleteProperty(lResultTwo.output, "revisionData");
    expect(lResultTwo.output).to.deep.equal(lResult.output);
    expect(lResultTwo.output).to.be.jsonSchema(cruiseResultSchema);
  });

  it("cruising twice with non-compatible arguments yields different results", async () => {
    const lResult = await cruise(
      ["test/main/__mocks__/cache"],
      {
        cache: CACHE_FOLDER,
      },
      { bustTheCache: true },
      {}
    );
    const lCacheInstance = new Cache();
    const lOldCache = await lCacheInstance.read(CACHE_FOLDER);
    Reflect.deleteProperty(lOldCache, "revisionData");

    expect(lResult.output).to.deep.equal(lOldCache);

    const lResultTwo = await cruise(
      ["test/main/__mocks__/cache test/main/__mocks__/cache-too "],
      {
        cache: CACHE_FOLDER,
      },
      { bustTheCache: true },
      {}
    );
    const lNewCacheInstance = new Cache();
    const lNewCache = await lNewCacheInstance.read(CACHE_FOLDER);
    Reflect.deleteProperty(lNewCache, "revisionData");
    expect(lNewCache).to.not.deep.equal(lOldCache);
    expect(lNewCache).to.deep.equal(lResultTwo.output);
    expect(lNewCache).to.be.jsonSchema(cruiseResultSchema);
  });
});
