const tryRequire = require("semver-try-require");
const _get = require("lodash/get");

const svelteCompile = tryRequire(
  "svelte/compiler",
  require("../../../package.json").supportedTranspilers.svelte
);

module.exports = (pTsWrapper) => ({
  isAvailable: () => svelteCompile !== false,
  transpile: async (pSource, pTranspileOptions = {}) => {
    const optionallyCompileTsToJsInSvelte = await svelteCompile.preprocess(
      pSource,
      {
        script: ({ content, attributes }) => {
          if (attributes.lang !== "ts" || !pTsWrapper.isAvailable()) {
            return { code: content };
          }
          const compiledToTsFromJs = pTsWrapper.transpile(content, {
            ...pTranspileOptions,
            tsConfig: {
              ..._get(pTranspileOptions, "tsConfig", {}),
              options: {
                ..._get(pTranspileOptions, "tsConfig.options", {}),
                importsNotUsedAsValues: "preserve",
                jsx: "preserve",
              },
            },
          });
          return { code: compiledToTsFromJs };
        },
      }
    );
    const compiledSvelteCode = svelteCompile.compile(
      optionallyCompileTsToJsInSvelte.code
    );
    return compiledSvelteCode.js.code;
  },
});
