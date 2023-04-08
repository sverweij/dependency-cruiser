import { rmSync } from "fs";
import { join } from "path";
import { expect } from "chai";
import { describe } from "mocha";
import Cache from "../../src/cache/cache.mjs";

const OUTPUTS_FOLDER = "test/cache/__outputs__/";

describe("[I] cache/cache - readCache", () => {
  it("returns an empty cache when trying to read from a non-existing one", () => {
    expect(new Cache().read("this/folder/does/not-exist")).to.deep.equal({
      modules: [],
      summary: {},
    });
  });

  it("returns an empty cache when trying to read from a file that is invalid JSON", () => {
    expect(
      new Cache().read("test/cache/__mocks__/cache/invalid-json")
    ).to.deep.equal({
      modules: [],
      summary: {},
    });
  });

  it("returns the contents of the cache when trying to read from an existing, valid json", () => {
    expect(
      new Cache().read("test/cache/__mocks__/cache/valid-minimal-cache")
    ).to.deep.equal({
      modules: [],
      summary: {},
      revisionData: {
        SHA1: "26fc7183127945393f77c8559f28bf623babe17f",
        changes: [],
      },
    });
  });
});

describe("[I] cache/cache - writeCache", () => {
  before("remove __outputs__ folder", () => {
    rmSync(OUTPUTS_FOLDER, { recursive: true, force: true });
  });
  after("remove __outputs__ folder", () => {
    rmSync(OUTPUTS_FOLDER, { recursive: true, force: true });
  });

  it("writes the passed cruise options to the cache folder (which is created when it doesn't exist yet)", () => {
    const lDummyCacheContents = {};
    const lCacheFolder = join(OUTPUTS_FOLDER, "write-cache");
    const lCache = new Cache();

    lCache.write(lCacheFolder, lDummyCacheContents);
    expect(lCache.read(lCacheFolder)).to.deep.equal(lDummyCacheContents);
  });

  it("writes the passed cruise options to the cache folder (folder already exists -> overwrite)", () => {
    const lDummyCacheContents = {};
    const lSecondDummyCacheContents = {
      modules: [],
      summary: {},
      revisionData: { SHA1: "dummy-sha", changes: [] },
    };
    const lCacheFolder = join(OUTPUTS_FOLDER, "two-writes");
    const lCache = new Cache();

    lCache.write(lCacheFolder, lDummyCacheContents);
    lCache.write(lCacheFolder, lSecondDummyCacheContents);
    expect(lCache.read(lCacheFolder)).to.deep.equal(lSecondDummyCacheContents);
  });

  it("writes the passed cruise options to the cache folder (which is created when it doesn't exist yet) - content based cached strategy", () => {
    /** @type {import("../..").ICruiseResult} */
    const lDummyCacheContents = {
      modules: [],
      summary: { optionsUsed: { baseDir: "test/cache/__mocks__/cache" } },
      revisionData: { SHA1: "dummy-sha", changes: [] },
    };
    const lCacheFolder = join(OUTPUTS_FOLDER, "write-cache-content-strategy");
    const lCache = new Cache("content");
    const lRevisionData = { SHA1: "dummy-sha", changes: [] };

    lCache.write(lCacheFolder, lDummyCacheContents, lRevisionData);
    expect(lCache.read(lCacheFolder)).to.deep.equal(lDummyCacheContents);
  });
});

describe("[I] cache/cache - canServeFromCache", () => {
  const lOriginalCacheFolder = join(
    OUTPUTS_FOLDER,
    "serve-from-cache-compatible"
  );
  /** @type import("../..").ICruiseResult */
  const lMinimalCruiseResult = {
    modules: [],
    summary: {
      optionsUsed: {
        cache: {
          folder: lOriginalCacheFolder,
          strategy: "metadata",
        },
        args: "src test tools",
      },
    },
    revisionData: { SHA1: "dummy-sha", changes: [] },
  };

  it("returns false when cache not written yet", () => {
    const lCacheFolder = join(OUTPUTS_FOLDER, "serve-from-cache");
    const lEmptyCruiseResult = { modules: [], summary: [] };

    expect(
      new Cache().canServeFromCache(
        { cache: { folder: lCacheFolder, strategy: "metadata" } },
        lEmptyCruiseResult,
        {
          SHA1: "dummy-sha",
          changes: [],
        }
      )
    ).to.equal(false);
  });

  it("returns false when the base SHA differs", () => {
    const lCacheFolder = join(OUTPUTS_FOLDER, "serve-from-cache-sha-differs");

    expect(
      new Cache().canServeFromCache(
        {
          args: "src test tools",
          cache: { folder: lCacheFolder, strategy: "metadata" },
        },
        lMinimalCruiseResult,
        {
          SHA1: "another-sha",
          changes: [],
        }
      )
    ).to.equal(false);
  });

  it("returns false when a file was added", () => {
    const lCacheFolder = join(OUTPUTS_FOLDER, "serve-from-cache-file-added");

    expect(
      new Cache().canServeFromCache(
        {
          args: "src test tools",
          cache: { folder: lCacheFolder, strategy: "metadata" },
        },
        lMinimalCruiseResult,
        {
          SHA1: "dummy-sha",
          changes: [
            {
              changeType: "added",
              name: "some-new-file.aap",
              checksum: "dummy-checksum",
            },
          ],
        }
      )
    ).to.equal(false);
  });

  it("returns false when cache written & revision data equal & options incompatible", () => {
    const lCacheFolder = join(
      OUTPUTS_FOLDER,
      "serve-from-cache-options-incompatible"
    );

    expect(
      new Cache().canServeFromCache(
        {
          args: "src test tools configs",
          cache: { folder: lCacheFolder, strategy: "metadata" },
        },
        lMinimalCruiseResult,
        { SHA1: "dummy-sha", changes: [] }
      )
    ).to.equal(false);
  });

  it("returns true when cache written & revision data equal & options compatible", () => {
    expect(
      new Cache().canServeFromCache(
        {
          args: "src test tools",
          cache: { folder: lOriginalCacheFolder, strategy: "metadata" },
        },
        lMinimalCruiseResult,
        { SHA1: "dummy-sha", changes: [] }
      )
    ).to.equal(true);
  });
});
