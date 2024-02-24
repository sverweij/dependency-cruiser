import { deepEqual, equal } from "node:assert/strict";
import { readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { brotliDecompressSync } from "node:zlib";
import { describe } from "mocha";
import Cache from "#cache/cache.mjs";

const OUTPUTS_FOLDER = "test/cache/__outputs__/";
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

describe("[I] cache/cache - readCache", () => {
  it("returns an empty cache when trying to read from a non-existing one", async () => {
    const lCache = new Cache();
    deepEqual(await lCache.read("this/folder/does/not-exist"), EMPTY_CACHE);
  });

  it("returns an empty cache when trying to read from a file that is invalid JSON", async () => {
    const lCache = new Cache();
    deepEqual(
      await lCache.read("test/cache/__mocks__/cache/invalid-json"),
      EMPTY_CACHE,
    );
  });

  it("returns the contents of the cache when trying to read from an existing, valid json", async () => {
    const lCache = new Cache();
    deepEqual(
      await lCache.read("test/cache/__mocks__/cache/valid-minimal-cache"),
      {
        modules: [],
        summary: {},
        revisionData: {
          SHA1: "26fc7183127945393f77c8559f28bf623babe17f",
          changes: [],
        },
      },
    );
  });
});

describe("[I] cache/cache - writeCache", () => {
  before("remove __outputs__ folder", () => {
    rmSync(OUTPUTS_FOLDER, { recursive: true, force: true });
  });
  after("remove __outputs__ folder", () => {
    rmSync(OUTPUTS_FOLDER, { recursive: true, force: true });
  });

  it("writes the passed cruise options to the cache folder (which is created when it doesn't exist yet)", async () => {
    const lDummyCacheContents = {};
    const lCacheFolder = join(OUTPUTS_FOLDER, "write-cache");
    const lCache = new Cache();

    await lCache.write(lCacheFolder, lDummyCacheContents);
    deepEqual(await lCache.read(lCacheFolder), lDummyCacheContents);
  });

  it("writes the passed cruise options to the cache folder (folder already exists -> overwrite)", async () => {
    const lDummyCacheContents = {};
    const lSecondDummyCacheContents = {
      modules: [],
      summary: {},
      revisionData: { SHA1: "dummy-sha", changes: [] },
    };
    const lCacheFolder = join(OUTPUTS_FOLDER, "two-writes");
    const lCache = new Cache();

    await lCache.write(lCacheFolder, lDummyCacheContents);
    await lCache.write(lCacheFolder, lSecondDummyCacheContents);
    deepEqual(await lCache.read(lCacheFolder), lSecondDummyCacheContents);
  });

  it("writes the passed cruise options to the cache folder (which is created when it doesn't exist yet) - content based cached strategy", async () => {
    /** @type {import("../..").ICruiseResult} */
    const lDummyCacheContents = {
      modules: [],
      summary: { optionsUsed: { baseDir: "test/cache/__mocks__/cache" } },
      revisionData: { SHA1: "dummy-sha", changes: [] },
    };
    const lCacheFolder = join(OUTPUTS_FOLDER, "write-cache-content-strategy");
    const lCache = new Cache("content");
    const lRevisionData = { SHA1: "dummy-sha", changes: [] };

    await lCache.write(lCacheFolder, lDummyCacheContents, lRevisionData);
    deepEqual(await lCache.read(lCacheFolder), lDummyCacheContents);
  });
});

describe("[I] cache/cache - canServeFromCache", () => {
  const lOriginalCacheFolder = join(
    OUTPUTS_FOLDER,
    "serve-from-cache-compatible",
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
    revisionData: { cacheFormatVersion: 16.2, SHA1: "dummy-sha", changes: [] },
  };

  /** @type import("../..").ICruiseResult */
  const lNoVersionCruiseResult = {
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

  /** @type import("../..").ICruiseResult */
  const lOldVersionCruiseResult = {
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
    revisionData: { cacheFormatVersion: 15, SHA1: "dummy-sha", changes: [] },
  };

  it("returns false when cache not written yet", async () => {
    const lCacheFolder = join(OUTPUTS_FOLDER, "serve-from-cache");
    const lEmptyCruiseResult = { modules: [], summary: [] };
    const lCache = new Cache();

    const lResult = await lCache.canServeFromCache(
      { cache: { folder: lCacheFolder, strategy: "metadata" } },
      lEmptyCruiseResult,
      {
        SHA1: "dummy-sha",
        changes: [],
      },
    );
    equal(lResult, false);
  });

  it("returns false when the cache's format version is incompatible (no version)", async () => {
    const lCacheFolder = join(OUTPUTS_FOLDER, "serve-from-cache-sha-differs");
    const lCache = new Cache();
    const lFound = await lCache.canServeFromCache(
      {
        args: "src test tools",
        cache: { folder: lCacheFolder, strategy: "metadata" },
      },
      lNoVersionCruiseResult,
      {
        SHA1: "another-sha",
        changes: [],
      },
    );

    equal(lFound, false);
  });

  it("returns false when the cache's format version is incompatible (old version)", async () => {
    const lCacheFolder = join(OUTPUTS_FOLDER, "serve-from-cache-sha-differs");
    const lCache = new Cache();
    const lFound = await lCache.canServeFromCache(
      {
        args: "src test tools",
        cache: { folder: lCacheFolder, strategy: "metadata" },
      },
      lOldVersionCruiseResult,
      {
        SHA1: "another-sha",
        changes: [],
      },
    );

    equal(lFound, false);
  });

  it("returns false when the base SHA differs", async () => {
    const lCacheFolder = join(OUTPUTS_FOLDER, "serve-from-cache-sha-differs");
    const lCache = new Cache();
    const lFound = await lCache.canServeFromCache(
      {
        args: "src test tools",
        cache: { folder: lCacheFolder, strategy: "metadata" },
      },
      lMinimalCruiseResult,
      {
        SHA1: "another-sha",
        changes: [],
      },
    );

    equal(lFound, false);
  });

  it("returns false when a file was added", async () => {
    const lCacheFolder = join(OUTPUTS_FOLDER, "serve-from-cache-file-added");
    const lCache = new Cache();
    const lFound = await lCache.canServeFromCache(
      {
        args: "src test tools",
        cache: { folder: lCacheFolder, strategy: "metadata" },
      },
      lMinimalCruiseResult,
      {
        SHA1: "dummy-sha",
        changes: [
          {
            type: "added",
            name: "some-new-file.aap",
            checksum: "dummy-checksum",
          },
        ],
      },
    );

    equal(lFound, false);
  });

  it("returns false when cache written & revision data equal & options incompatible", async () => {
    const lCacheFolder = join(
      OUTPUTS_FOLDER,
      "serve-from-cache-options-incompatible",
    );
    const lCache = new Cache();
    const lFound = await lCache.canServeFromCache(
      {
        args: "src test tools configs",
        cache: { folder: lCacheFolder, strategy: "metadata" },
      },
      lMinimalCruiseResult,
      { SHA1: "dummy-sha", changes: [] },
    );

    equal(lFound, false);
  });

  it("returns true when cache written & revision data equal & options compatible", async () => {
    const lCache = new Cache();
    const lFound = await lCache.canServeFromCache(
      {
        args: "src test tools",
        cache: { folder: lOriginalCacheFolder, strategy: "metadata" },
      },
      lMinimalCruiseResult,
      { SHA1: "dummy-sha", changes: [] },
    );

    equal(lFound, true);
  });
});

describe("[I] cache/cache - compression", () => {
  before("remove __outputs__ folder", () => {
    rmSync(OUTPUTS_FOLDER, { recursive: true, force: true });
  });
  after("remove __outputs__ folder", () => {
    rmSync(OUTPUTS_FOLDER, { recursive: true, force: true });
  });

  const lCacheFolderContent = {
    modules: [],
    summary: { optionsUsed: { baseDir: "test/cache/__mocks__/cache" } },
    revisionData: { SHA1: "dummy-sha", changes: [] },
  };

  it("read & write remain transparent when pCompress === true", async () => {
    const lCache = new Cache("metadata", true);
    const lCacheFolder = join(OUTPUTS_FOLDER, "compression-transparent-true");
    await lCache.write(lCacheFolder, lCacheFolderContent);
    deepEqual(await lCache.read(lCacheFolder), lCacheFolderContent);
  });

  it("read & write remain transparent when pCompress === false", async () => {
    const lCache = new Cache("metadata", false);
    const lCacheFolder = join(OUTPUTS_FOLDER, "compression-transparent-false");
    await lCache.write(lCacheFolder, lCacheFolderContent);
    deepEqual(await lCache.read(lCacheFolder), lCacheFolderContent);
  });

  it("compresses the cache when pCompress === true", async () => {
    const lCacheFolder = join(OUTPUTS_FOLDER, "compression-compress-when-true");
    const lCache = new Cache("metadata", true);
    await lCache.write(lCacheFolder, lCacheFolderContent);
    const lCompressedCacheContents = readFileSync(
      join(lCacheFolder, "cache.json"),
    );
    const lCacheContentsString = brotliDecompressSync(
      lCompressedCacheContents,
    ).toString("utf8");
    const lCacheContents = JSON.parse(lCacheContentsString);
    deepEqual(lCacheContents, lCacheFolderContent);
  });

  it("does _not_ compress the cache when pCompress is false", async () => {
    const lCacheFolder = join(
      OUTPUTS_FOLDER,
      "compression-no-compress-when-false",
    );
    const lCache = new Cache("metadata", false);
    await lCache.write(lCacheFolder, lCacheFolderContent);
    const lCacheContentsString = readFileSync(
      join(lCacheFolder, "cache.json"),
      {
        encoding: "utf8",
      },
    );
    const lCacheContents = JSON.parse(lCacheContentsString);
    deepEqual(lCacheContents, lCacheFolderContent);
  });

  it("does _not_ compress the cache when pCompress isn't provided", async () => {
    const lCacheFolder = join(
      OUTPUTS_FOLDER,
      "compression-no-compress-when-not-provided",
    );
    const lCache = new Cache("metadata");
    await lCache.write(lCacheFolder, lCacheFolderContent);
    const lCacheContentsString = readFileSync(
      join(lCacheFolder, "cache.json"),
      {
        encoding: "utf8",
      },
    );
    const lCacheContents = JSON.parse(lCacheContentsString);
    deepEqual(lCacheContents, lCacheFolderContent);
  });
});
