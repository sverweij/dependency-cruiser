import { ok, equal } from "node:assert/strict";
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

    equal(Object.keys(lNormalizedOptions).length, lDefaultNoOfResolveOptions);
    equal(lNormalizedOptions.symlinks, false);
    equal(lNormalizedOptions.tsConfig, null);
    equal(lNormalizedOptions.combinedDependencies, false);
    ok(lNormalizedOptions.hasOwnProperty("extensions"));
    ok(lNormalizedOptions.hasOwnProperty("fileSystem"));
    equal(lNormalizedOptions.useSyncFileSystemCalls, true);
  });

  it("does not add the typescript paths plugin to the plugins if no tsConfig is specified", async () => {
    const lNormalizedOptions = await normalizeResolveOptions(
      {},
      normalizeCruiseOptions({
        ruleSet: { options: {} },
      }),
      lTsconfigContents,
    );

    equal(Object.keys(lNormalizedOptions).length, lDefaultNoOfResolveOptions);
    equal(lNormalizedOptions.symlinks, false);
    equal(lNormalizedOptions.tsConfig, null);
    equal(lNormalizedOptions.combinedDependencies, false);
    ok(lNormalizedOptions.hasOwnProperty("extensions"));
    ok(lNormalizedOptions.hasOwnProperty("fileSystem"));
    equal((lNormalizedOptions.plugins || []).length, 0);
    equal(lNormalizedOptions.useSyncFileSystemCalls, true);
  });

  it("adds the typescript paths plugin to the plugins if a tsConfig is specified, even without a baseUrl", async () => {
    const lNormalizedOptions = await normalizeResolveOptions(
      {},
      normalizeCruiseOptions({
        ruleSet: { options: { tsConfig: { fileName: TEST_TSCONFIG } } },
      }),
      lTsconfigContents,
    );

    equal(
      Object.keys(lNormalizedOptions).length,
      lDefaultNoOfResolveOptions + 1,
    );
    equal(lNormalizedOptions.symlinks, false);
    equal(lNormalizedOptions.tsConfig, TEST_TSCONFIG);
    equal(lNormalizedOptions.combinedDependencies, false);
    ok(lNormalizedOptions.hasOwnProperty("extensions"));
    ok(lNormalizedOptions.hasOwnProperty("fileSystem"));
    equal((lNormalizedOptions.plugins || []).length, 1);
    equal(lNormalizedOptions.useSyncFileSystemCalls, true);
  });

  it("adds the typescript paths plugin to the plugins if a tsConfig is specified with a baseUrl and actual paths", async () => {
    const lNormalizedOptions = await normalizeResolveOptions(
      {},
      normalizeCruiseOptions({
        ruleSet: { options: { tsConfig: { fileName: TEST_TSCONFIG } } },
      }),
      lTsconfigContentsWithBaseURLAndPaths,
    );

    equal(
      Object.keys(lNormalizedOptions).length,
      lDefaultNoOfResolveOptions + 1,
    );
    equal(lNormalizedOptions.symlinks, false);
    equal(lNormalizedOptions.tsConfig, TEST_TSCONFIG);
    equal(lNormalizedOptions.combinedDependencies, false);
    ok(lNormalizedOptions.hasOwnProperty("extensions"));
    ok(lNormalizedOptions.hasOwnProperty("fileSystem"));
    equal(lNormalizedOptions.plugins.length, 1);
    equal(lNormalizedOptions.useSyncFileSystemCalls, true);
  });
});
