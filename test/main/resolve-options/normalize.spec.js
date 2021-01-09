const path = require("path");
const { expect } = require("chai");
const {
  normalizeCruiseOptions,
} = require("../../../src/main/options/normalize");
const normalizeResolveOptions = require("../../../src/main/resolve-options/normalize");

describe("main/resolve-options/normalize", () => {
  const lDefaultNoOfResolveOptions = 10;
  const TEST_TSCONFIG = path.join(
    __dirname,
    "..",
    "fixtures",
    "tsconfig.test.json"
  );
  const lTsconfigContents = {};
  const lTsconfigContentsWithBaseURL = {
    options: { baseUrl: "" },
  };
  const lTsconfigContentsWithBaseURLAndPaths = {
    options: { baseUrl: "", paths: { "*": ["lalala/*"] } },
  };

  it("comes with a set of defaults when passed with no options at all", () => {
    const lNormalizedOptions = normalizeResolveOptions(
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

  it("does not add the typescript paths plugin to the plugins if a tsConfig is specified without a baseUrl", () => {
    const lNormalizedOptions = normalizeResolveOptions(
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

  it("does not add the typescript paths plugin to the plugins if a tsConfig is specified with a baseUrl and no actual paths", () => {
    const lNormalizedOptions = normalizeResolveOptions(
      {},
      normalizeCruiseOptions({
        ruleSet: { options: { tsConfig: { fileName: TEST_TSCONFIG } } },
      }),
      lTsconfigContentsWithBaseURL
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

  it("adds the typescript paths plugin to the plugins if a tsConfig is specified with a baseUrl and actual paths", () => {
    const lNormalizedOptions = normalizeResolveOptions(
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
