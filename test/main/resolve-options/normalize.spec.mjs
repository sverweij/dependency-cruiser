import { ok, strictEqual } from "node:assert";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeCruiseOptions } from "../../../src/main/options/normalize.mjs";
import normalizeResolveOptions from "../../../src/main/resolve-options/normalize.mjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

describe("[I] main/resolve-options/normalize", () => {
  const lDefaultNoOfResolveOptions = 10;
  const TEST_TSCONFIG = join(__dirname, "__mocks__", "tsconfig.test.json");
  const lTsconfigContents = {};
  const lTsconfigContentsWithBaseURLAndPaths = {
    options: { baseUrl: "", paths: { "*": ["lalala/*"] } },
  };

  it("comes with a set of defaults when passed with no options at all", async () => {
    const lNormalizedOptions = await normalizeResolveOptions(
      {},
      normalizeCruiseOptions({}),
    );

    strictEqual(
      Object.keys(lNormalizedOptions).length,
      lDefaultNoOfResolveOptions,
    );
    strictEqual(lNormalizedOptions.symlinks, false);
    strictEqual(lNormalizedOptions.tsConfig, null);
    strictEqual(lNormalizedOptions.combinedDependencies, false);
    ok(lNormalizedOptions.hasOwnProperty("extensions"));
    ok(lNormalizedOptions.hasOwnProperty("fileSystem"));
    strictEqual(lNormalizedOptions.useSyncFileSystemCalls, true);
  });

  it("does not add the typescript paths plugin to the plugins if no tsConfig is specified", async () => {
    const lNormalizedOptions = await normalizeResolveOptions(
      {},
      normalizeCruiseOptions({
        ruleSet: { options: {} },
      }),
      lTsconfigContents,
    );

    strictEqual(
      Object.keys(lNormalizedOptions).length,
      lDefaultNoOfResolveOptions,
    );
    strictEqual(lNormalizedOptions.symlinks, false);
    strictEqual(lNormalizedOptions.tsConfig, null);
    strictEqual(lNormalizedOptions.combinedDependencies, false);
    ok(lNormalizedOptions.hasOwnProperty("extensions"));
    ok(lNormalizedOptions.hasOwnProperty("fileSystem"));
    strictEqual((lNormalizedOptions.plugins || []).length, 0);
    strictEqual(lNormalizedOptions.useSyncFileSystemCalls, true);
  });

  it("adds the typescript paths plugin to the plugins if a tsConfig is specified, even without a baseUrl", async () => {
    const lNormalizedOptions = await normalizeResolveOptions(
      {},
      normalizeCruiseOptions({
        ruleSet: { options: { tsConfig: { fileName: TEST_TSCONFIG } } },
      }),
      lTsconfigContents,
    );

    strictEqual(
      Object.keys(lNormalizedOptions).length,
      lDefaultNoOfResolveOptions + 1,
    );
    strictEqual(lNormalizedOptions.symlinks, false);
    strictEqual(lNormalizedOptions.tsConfig, TEST_TSCONFIG);
    strictEqual(lNormalizedOptions.combinedDependencies, false);
    ok(lNormalizedOptions.hasOwnProperty("extensions"));
    ok(lNormalizedOptions.hasOwnProperty("fileSystem"));
    strictEqual((lNormalizedOptions.plugins || []).length, 1);
    strictEqual(lNormalizedOptions.useSyncFileSystemCalls, true);
  });

  it("adds the typescript paths plugin to the plugins if a tsConfig is specified with a baseUrl and actual paths", async () => {
    const lNormalizedOptions = await normalizeResolveOptions(
      {},
      normalizeCruiseOptions({
        ruleSet: { options: { tsConfig: { fileName: TEST_TSCONFIG } } },
      }),
      lTsconfigContentsWithBaseURLAndPaths,
    );

    strictEqual(
      Object.keys(lNormalizedOptions).length,
      lDefaultNoOfResolveOptions + 1,
    );
    strictEqual(lNormalizedOptions.symlinks, false);
    strictEqual(lNormalizedOptions.tsConfig, TEST_TSCONFIG);
    strictEqual(lNormalizedOptions.combinedDependencies, false);
    ok(lNormalizedOptions.hasOwnProperty("extensions"));
    ok(lNormalizedOptions.hasOwnProperty("fileSystem"));
    strictEqual(lNormalizedOptions.plugins.length, 1);
    strictEqual(lNormalizedOptions.useSyncFileSystemCalls, true);
  });
});
