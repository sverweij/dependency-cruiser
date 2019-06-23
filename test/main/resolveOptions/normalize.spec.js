const path                    = require('path');
const expect                  = require('chai').expect;
const normalizeOptions        = require('../../../src/main/options/normalize');
const normalizeResolveOptions = require('../../../src/main/resolveOptions/normalize');

describe("main/resolveOptions/normalize", () => {
    const DEFAULT_NO_OF_RESOLVE_OPTIONS = 8;
    const TEST_TSCONFIG = path.join(__dirname, "..", "fixtures", "tsconfig.test.json");
    const TSCONFIG_CONTENTS = {};
    const TSCONFIG_CONTENTS_WITH_BASEURL = {options:{baseUrl:""}};

    it("comes with a set of defaults when passed with no options at all", () => {
        const lNormalizedOptions = normalizeResolveOptions({}, normalizeOptions({}));

        expect(Object.keys(lNormalizedOptions).length).to.equal(DEFAULT_NO_OF_RESOLVE_OPTIONS);
        expect(lNormalizedOptions.symlinks).to.equal(false);
        expect(lNormalizedOptions.tsConfig).to.equal(null);
        expect(lNormalizedOptions.combinedDependencies).to.equal(false);
        expect(lNormalizedOptions).to.ownProperty('extensions');
        expect(lNormalizedOptions).to.ownProperty('fileSystem');
        expect(lNormalizedOptions.useSyncFileSystemCalls).to.equal(true);
    });

    it("adds the pnp plugin to the resolver plugins for externalModuleResolutionStrategy yarn-pnp", () => {
        const lNormalizedOptions = normalizeResolveOptions(
            {},
            normalizeOptions({externalModuleResolutionStrategy: "yarn-pnp"})
        );

        expect(Object.keys(lNormalizedOptions).length).to.equal(DEFAULT_NO_OF_RESOLVE_OPTIONS + 1);
        expect(lNormalizedOptions.symlinks).to.equal(false);
        expect(lNormalizedOptions.tsConfig).to.equal(null);
        expect(lNormalizedOptions.combinedDependencies).to.equal(false);
        expect(lNormalizedOptions).to.ownProperty('extensions');
        expect(lNormalizedOptions).to.ownProperty('fileSystem');
        expect(lNormalizedOptions.plugins.length).to.equal(1);
        expect(lNormalizedOptions.useSyncFileSystemCalls).to.equal(true);
    });

    it("does not add the typescript paths plugin to the plugins if a tsConfig is specified without a baseUrl", () => {
        const lNormalizedOptions = normalizeResolveOptions(
            {},
            normalizeOptions(
                {ruleSet: {options: {tsConfig: {fileName: TEST_TSCONFIG}}}}
            ),
            TSCONFIG_CONTENTS
        );

        expect(Object.keys(lNormalizedOptions).length).to.equal(DEFAULT_NO_OF_RESOLVE_OPTIONS);
        expect(lNormalizedOptions.symlinks).to.equal(false);
        expect(lNormalizedOptions.tsConfig).to.equal(TEST_TSCONFIG);
        expect(lNormalizedOptions.combinedDependencies).to.equal(false);
        expect(lNormalizedOptions).to.ownProperty('extensions');
        expect(lNormalizedOptions).to.ownProperty('fileSystem');
        expect((lNormalizedOptions.plugins || []).length).to.equal(0);
        expect(lNormalizedOptions.useSyncFileSystemCalls).to.equal(true);
    });

    it("adds the typescript paths plugin to the plugins if a tsConfig is specified with a baseUrl", () => {
        const lNormalizedOptions = normalizeResolveOptions(
            {},
            normalizeOptions(
                {ruleSet: {options: {tsConfig: {fileName: TEST_TSCONFIG}}}}
            ),
            TSCONFIG_CONTENTS_WITH_BASEURL
        );

        expect(Object.keys(lNormalizedOptions).length).to.equal(DEFAULT_NO_OF_RESOLVE_OPTIONS + 1);
        expect(lNormalizedOptions.symlinks).to.equal(false);
        expect(lNormalizedOptions.tsConfig).to.equal(TEST_TSCONFIG);
        expect(lNormalizedOptions.combinedDependencies).to.equal(false);
        expect(lNormalizedOptions).to.ownProperty('extensions');
        expect(lNormalizedOptions).to.ownProperty('fileSystem');
        expect(lNormalizedOptions.plugins.length).to.equal(1);
        expect(lNormalizedOptions.useSyncFileSystemCalls).to.equal(true);
    });

    it("adds the typescript plugin and pnp plugins if a tsConfig and pnp resolution strategy are specified", () => {
        const lNormalizedOptions = normalizeResolveOptions(
            {},
            normalizeOptions(
                {
                    ruleSet: {options: {tsConfig: {fileName: TEST_TSCONFIG}}},
                    externalModuleResolutionStrategy: "yarn-pnp"
                }
            ),
            TSCONFIG_CONTENTS_WITH_BASEURL
        );

        expect(Object.keys(lNormalizedOptions).length).to.equal(DEFAULT_NO_OF_RESOLVE_OPTIONS + 1);

        /* eslint no-magic-numbers:0 */
        expect(lNormalizedOptions.plugins.length).to.equal(2);
        expect(lNormalizedOptions.tsConfig).to.equal(TEST_TSCONFIG);
    });
});
