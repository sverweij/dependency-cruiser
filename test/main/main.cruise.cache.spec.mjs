import { rmSync } from "fs";
import { expect, use } from "chai";
import chaiJSONSchema from "chai-json-schema";
import cruiseResultSchema from "../../src/schema/cruise-result.schema.js";
import { futureCruise } from "../../src/main/index.js";
import Cache from "../../src/cache/cache.js";

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

  it("cruising fills the cache", () => {
    const lResult = futureCruise(
      ["test/main/__mocks__/cache"],
      {
        cache: CACHE_FOLDER,
      },
      { bustTheCache: true },
      {}
    );
    const lCache = new Cache().read(CACHE_FOLDER);
    Reflect.deleteProperty(lCache, "revisionData");

    expect(lResult.output).to.deep.equal(lCache);
    expect(lResult.output).to.be.jsonSchema(cruiseResultSchema);
  });

  it("cruising twice yields the same result (minus 'revisionData')", () => {
    const lResult = futureCruise(
      ["test/main/__mocks__/cache"],
      {
        cache: CACHE_FOLDER,
      },
      { bustTheCache: true },
      {}
    );
    const lCache = new Cache().read(CACHE_FOLDER);
    Reflect.deleteProperty(lCache, "revisionData");

    expect(lResult.output).to.deep.equal(lCache);

    const lResultTwo = futureCruise(
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

  it("cruising twice with non-compatible arguments yields different results", () => {
    const lResult = futureCruise(
      ["test/main/__mocks__/cache"],
      {
        cache: CACHE_FOLDER,
      },
      { bustTheCache: true },
      {}
    );
    const lOldCache = new Cache().read(CACHE_FOLDER);
    Reflect.deleteProperty(lOldCache, "revisionData");

    expect(lResult.output).to.deep.equal(lOldCache);

    const lResultTwo = futureCruise(
      ["test/main/__mocks__/cache test/main/__mocks__/cache-too "],
      {
        cache: CACHE_FOLDER,
      },
      { bustTheCache: true },
      {}
    );
    const lNewCache = new Cache().read(CACHE_FOLDER);
    Reflect.deleteProperty(lNewCache, "revisionData");
    expect(lNewCache).to.not.deep.equal(lOldCache);
    expect(lNewCache).to.deep.equal(lResultTwo.output);
    expect(lNewCache).to.be.jsonSchema(cruiseResultSchema);
  });
});
