import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect } from "chai";
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
      normalizeCruiseOptions({})
    );

    expect(Object.keys(lNormalizedOptions).length).to.equal(
      lDefaultNoOfResolveOptions
    );
    expect(lNormalizedOptions.symlinks).to.equal(false);
    expect(lNormalizedOptions.tsConfig).to.equal(null);
    expect(lNormalizedOptions.combinedDependencies).to.equal(false);
    expect(lNormalizedOptions).to.ownProperty("extensions");
    expect(lNormalizedOptions).to.ownProperty("fileSystem");
    expect(lNormalizedOptions.useSyncFileSystemCalls).to.equal(true);
  });

  it("does not add the typescript paths plugin to the plugins if a tsConfig is specified without a baseUrl", async () => {
    const lNormalizedOptions = await normalizeResolveOptions(
      {},
      normalizeCruiseOptions({
        ruleSet: { options: { tsConfig: { fileName: TEST_TSCONFIG } } },
      }),
      lTsconfigContents
    );

    expect(Object.keys(lNormalizedOptions).length).to.equal(
      lDefaultNoOfResolveOptions
    );
    expect(lNormalizedOptions.symlinks).to.equal(false);
    expect(lNormalizedOptions.tsConfig).to.equal(TEST_TSCONFIG);
    expect(lNormalizedOptions.combinedDependencies).to.equal(false);
    expect(lNormalizedOptions).to.ownProperty("extensions");
    expect(lNormalizedOptions).to.ownProperty("fileSystem");
    expect((lNormalizedOptions.plugins || []).length).to.equal(0);
    expect(lNormalizedOptions.useSyncFileSystemCalls).to.equal(true);
  });

  it("adds the typescript paths plugin to the plugins if a tsConfig is specified with a baseUrl and actual paths", async () => {
    const lNormalizedOptions = await normalizeResolveOptions(
      {},
      normalizeCruiseOptions({
        ruleSet: { options: { tsConfig: { fileName: TEST_TSCONFIG } } },
      }),
      lTsconfigContentsWithBaseURLAndPaths
    );

    expect(Object.keys(lNormalizedOptions).length).to.equal(
      lDefaultNoOfResolveOptions + 1
    );
    expect(lNormalizedOptions.symlinks).to.equal(false);
    expect(lNormalizedOptions.tsConfig).to.equal(TEST_TSCONFIG);
    expect(lNormalizedOptions.combinedDependencies).to.equal(false);
    expect(lNormalizedOptions).to.ownProperty("extensions");
    expect(lNormalizedOptions).to.ownProperty("fileSystem");
    expect(lNormalizedOptions.plugins.length).to.equal(1);
    expect(lNormalizedOptions.useSyncFileSystemCalls).to.equal(true);
  });
});
