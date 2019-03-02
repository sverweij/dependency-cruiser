const path             = require('path').posix;
const expect           = require('chai').expect;
const normalizeOptions = require('../../../src/main/options/normalize');
const normalize        = require('../../../src/main/resolveOptions/normalize');

describe("main/resolveOptions/normalize", () => {
    const DEFAULT_NO_OF_RESOLVE_OPTIONS = 7;
    const A_TEST_TSCONFIG = path.join(__dirname, "../fixtures/tsconfig.test.json");

    it("comes with a set of defaults when passed with no options at all", () => {
        const lNormalizedOptions = normalize({}, normalizeOptions({}));

        expect(Object.keys(lNormalizedOptions).length).to.equal(DEFAULT_NO_OF_RESOLVE_OPTIONS);
        expect(lNormalizedOptions.symlinks).to.equal(false);
        expect(lNormalizedOptions.tsConfig).to.equal(null);
        expect(lNormalizedOptions.combinedDependencies).to.equal(false);
        expect(lNormalizedOptions).to.ownProperty('extensions');
        expect(lNormalizedOptions).to.ownProperty('fileSystem');
        expect(lNormalizedOptions.useSyncFileSystemCalls).to.equal(true);
    });

    it("adds the pnp plugin to the resolver plugins for externalModuleResolutionStrategy yarn-pnp", () => {
        const lNormalizedOptions = normalize({}, normalizeOptions({externalModuleResolutionStrategy: "yarn-pnp"}));

        expect(Object.keys(lNormalizedOptions).length).to.equal(DEFAULT_NO_OF_RESOLVE_OPTIONS + 1);
        expect(lNormalizedOptions.symlinks).to.equal(false);
        expect(lNormalizedOptions.tsConfig).to.equal(null);
        expect(lNormalizedOptions.combinedDependencies).to.equal(false);
        expect(lNormalizedOptions).to.ownProperty('extensions');
        expect(lNormalizedOptions).to.ownProperty('fileSystem');
        expect(lNormalizedOptions.plugins.length).to.equal(1);
        expect(lNormalizedOptions.useSyncFileSystemCalls).to.equal(true);
    });

    it("adds the typescript plugin to the resolver plugins if a tsConfig is specified ", () => {
        const lNormalizedOptions = normalize(
            {},
            normalizeOptions(
                {ruleSet: {options: {tsConfig: {fileName: A_TEST_TSCONFIG}}}}
            )
        );

        expect(Object.keys(lNormalizedOptions).length).to.equal(DEFAULT_NO_OF_RESOLVE_OPTIONS + 1);
        expect(lNormalizedOptions.symlinks).to.equal(false);
        expect(lNormalizedOptions.tsConfig).to.equal(A_TEST_TSCONFIG);
        expect(lNormalizedOptions.combinedDependencies).to.equal(false);
        expect(lNormalizedOptions).to.ownProperty('extensions');
        expect(lNormalizedOptions).to.ownProperty('fileSystem');
        expect(lNormalizedOptions.plugins.length).to.equal(1);
        expect(lNormalizedOptions.useSyncFileSystemCalls).to.equal(true);
    });

    it("adds the typescript plugin and pnp plugins if a tsConfig and pnp resolution strategy are specified", () => {
        const lNormalizedOptions = normalize(
            {},
            normalizeOptions(
                {
                    ruleSet: {options: {tsConfig: {fileName: A_TEST_TSCONFIG}}},
                    externalModuleResolutionStrategy: "yarn-pnp"
                }
            )
        );

        expect(Object.keys(lNormalizedOptions).length).to.equal(DEFAULT_NO_OF_RESOLVE_OPTIONS + 1);

        /* eslint no-magic-numbers:0 */
        expect(lNormalizedOptions.plugins.length).to.equal(2);
        expect(lNormalizedOptions.tsConfig).to.equal(A_TEST_TSCONFIG);
    });
});
